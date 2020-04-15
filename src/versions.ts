import * as core from '@actions/core'
import {HttpClient} from 'typed-rest-client/HttpClient'

const c: HttpClient = new HttpClient('vsts-node-api')

export async function wasm_version(): Promise<string> {
    const version: string = core.getInput('wasm')
    if (version === 'latest' || version === null || version === undefined) {
        core.info('Searching the latest version of wasm-pack ...')
        const response = await c.get(
            'https://api.github.com/repos/rustwasm/wasm-pack/releases/latest',
        )
        const body = await response.readBody()
        return Promise.resolve(JSON.parse(body).tag_name || 'v0.9.1')
    }
    return Promise.resolve(version)
}

export async function trunk_version(): Promise<string> {
    const version: string = core.getInput('trunk')
    if (version === 'latest' || version === null || version === undefined) {
        core.info('Searching the latest version of wasm-pack ...')
        const response = await c.get(
            'https://api.github.com/repos/rustwasm/wasm-pack/releases/latest',
        )
        const body = await response.readBody()
        return Promise.resolve(JSON.parse(body).tag_name || 'v0.6.0')
    }
    return Promise.resolve(version)
}
