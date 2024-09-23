import type { Config } from 'payload'
import {get, isObject} from 'radash'


export const createCustomContext = <T>(key:string)=>{
    const CUSTOM_KEY=key
    const retrieve = (custom:unknown)=>{
        if (isObject(custom) && key in custom) {
            return get<T>(custom, CUSTOM_KEY)
        }
        throw new Error('Not a valid object')

    }


    const setup = (  payloadConfig: Config,
                     customContext: T)=>{

        payloadConfig.custom = {
            ...payloadConfig.custom,
            [CUSTOM_KEY]: customContext,
        }
        return payloadConfig
    }

    return [createCustomContext, setup] as const

}

