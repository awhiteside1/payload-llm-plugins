import {parseHtml} from './utils'

const givenAnHTMLDocument = async () =>
	(
		await fetch(
			'https://api.wikimedia.org/core/v1/wikipedia/en/page/Cantaloupe/html',{
				headers:{accept:'text/html'}
			}
		)
	).text()

describe('HTML Utils', () => {
	it('should process HTML', async () => {
		const document = await givenAnHTMLDocument()
		const out = await parseHtml(document)
		expect(out).toBeDefined()
	})
})
