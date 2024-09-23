import {definePreset} from 'unbuild'
import {execSync} from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

export default definePreset({
	declaration: 'compatible',
	rollup: {
		cjsBridge: true,
	},
	hooks: {
		'build:before': () => {
			console.log('Before build')
		},
		'build:done': (ctx) => {
			try {
				console.log('After build')
				// Run tailwindcss to generate the stylesheet
				execSync(
					'npx tailwindcss -i ./src/ui/tailwind.css -o dist/ui/tailwind.css',
					{stdio: 'inherit'},
				)
				// Paths to the generated files
				const mjsFilePath = path.resolve(__dirname, 'dist/ui/page/ChatView.mjs')
				const cjsFilePath = path.resolve(__dirname, 'dist/ui/page/ChatView.cjs')
				const cssImportStatement = "import '../tailwind.css';\n"
				// Function to inject the import statement
				const injectCssImport = (filePath: string) => {
					const fileContent = fs.readFileSync(filePath, 'utf8')
					if (!fileContent.includes(cssImportStatement)) {
						const updatedContent = cssImportStatement + fileContent
						fs.writeFileSync(filePath, updatedContent, 'utf8')
					}
				}
				// Inject the import statement into the generated files
				injectCssImport(mjsFilePath)
				injectCssImport(cjsFilePath)
			}catch (err){}
		},
	},
})
