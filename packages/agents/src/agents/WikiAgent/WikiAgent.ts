import {WikiSearchTool} from './WikiTools'
import {Agent} from '../../Agent/Agent'

export class WikiAgent extends Agent {
	tools = [WikiSearchTool]
	name = 'Wikipedia Agent'
	description = 'Searches wikipedia for information on requested topics. '
}
