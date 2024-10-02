import {config} from 'dotenv'
import {dirname, resolve} from 'pathe'
import {fileURLToPath} from 'node:url'
import {Schema} from '@effect/schema'
import {createTool} from '../../ChatEngine/tools/tools'
import {get} from 'radash'
import type {Result} from './types'
import {Effect} from 'effect'
import defu from 'defu'
import {parseHtml} from '../../md/fromHtml/utils'

const localEnv = resolve(dirname(fileURLToPath(import.meta.url)), '.env')
const envVars = config({ path: localEnv, processEnv: {} })
const accessToken = get(envVars.parsed, 'ACCESS_TOKEN')

const schema = Schema.Struct({
	query: Schema.String.annotations({ description: 'The query to search for' }),
})

const fetchConfig = {
	headers: {
		'api-user-agent': 'Alex Whiteside (https://github.com/awhiteside1)',
		Authorization: `Bearer ${accessToken}`,
	},
}

const getPageSource = (key: string) =>
	Effect.tryPromise({
		try: async () => {
			const result = await fetch(
				`https://api.wikimedia.org/core/v1/wikipedia/en/page/${key}/html`,
				fetchConfig,
			)
			if (result.ok) {
				const details = await result.text()
				return parseHtml(details)
			}
		},
		catch: (error) => new Error('Page Not Retrieved'),
	})

const getWikiSearch = (query: string) => {
	const params = { q: query.toLowerCase(), limit: '10' }
	return Effect.tryPromise({
		try: async () => {
			const result = await fetch(
				`https://api.wikimedia.org/core/v1/wikipedia/en/search/page?${new URLSearchParams(params).toString()}`,
				defu(fetchConfig, { headers: { accept: 'application/json' } }),
			)
			const response = await result.json()
			if (response.pages) {
				return response as Result
			}
			throw new Error('No Pages')
		},
		catch: (error) => new Error('Search Failed'),
	})
}

const getFirst = (result: Result) => result.pages[0].key

const searchWikipedia = async (args: Schema.Schema.Type<typeof schema>) => {
	const program = Effect.gen(function* () {
		const searchResult = yield* getWikiSearch(args.query)
		const firstPage = yield* getPageSource(getFirst(searchResult))
		const rest = searchResult.pages.slice(1)

		return [
			`# ${searchResult.pages.at(0)?.title}`,
			firstPage
			// '-------',
			// '# Other Results',
			// ...rest.flatMap((item) => [
			// 	`## ${item.title} (${item.key})`,
			// 	item.excerpt,
		].join('\n')
	})

	return Effect.runPromise(program)
}

export const WikiSearchTool = createTool({
	name: 'search_wikipedia',
	description: 'query wikipedia for a given search term or topic',
	implementation: searchWikipedia,
	params: schema,
})
