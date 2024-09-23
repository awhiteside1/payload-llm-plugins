import {defineBuildConfig} from 'unbuild'

export default defineBuildConfig([
	{
		rollup:{
			esbuild:{
				jsx:'automatic',
				target:'ES2022',
			}
		}
	},
	{
		preset: './build.preset',
	},
])
