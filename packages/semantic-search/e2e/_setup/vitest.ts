import Docker from 'dockerode'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import { sleep, uid } from 'radash'
import type { GlobalSetupContext } from 'vitest/node'

export const givenAPostgres = async () => {
	const docker = new Docker()
	const instance = await docker.createContainer({
		name: `postgres-${uid(5)}`,
		Image: 'postgres',
		Env: ['POSTGRES_PASSWORD=postgres'],
		ExposedPorts: { '5432/tcp': {} },
		HostConfig: {
			PortBindings: { '5432/tcp': [{ HostPort: '' }] },
		},
	})
	await instance.start()
	const details = await instance.inspect()
	const port = details.NetworkSettings.Ports['5432/tcp'].find(
		(x) => x.HostIp === '0.0.0.0',
	)?.HostPort
	if (!port) {
		await instance.stop()
		throw new Error('no port')
	}
	await sleep(1500)
	return {
		url: `postgres://postgres:postgres@localhost:${port}/postgres`,
		shutdown: async () => {
			try {
				await instance.stop()
			} catch (err) {}
		},
	}
}

export default async function setup({ provide }: GlobalSetupContext) {
	const mongo = await MongoMemoryReplSet.create({})
	if (mongo.state === 'stopped') {
		await mongo.start()
	}
	provide('mongoURL', mongo.getUri())
}

declare module 'vitest' {
	export interface ProvidedContext {
		postgresURL: string
		mongoURL: string
	}
}
