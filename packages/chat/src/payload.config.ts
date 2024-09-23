import path from "node:path";
import {fileURLToPath} from "node:url";
import type {Config} from 'payload'
import {buildConfig} from 'payload'
import {chatPlugin} from "./plugin/ChatPlugin";
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
	collections: [],
	db: {} as Config['db'],
	secret: 'secret',
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts'),
	},
	plugins:[chatPlugin({})]
})
