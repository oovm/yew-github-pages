import * as core from '@actions/core'
import * as io from '@actions/io'
import * as tc from '@actions/tool-cache'
import * as os from 'os'
import * as path from 'path'
import { wasm_version, trunk_version } from './versions'



async function install_wasm(): Promise<void> {
    const tempFolder = path.join(os.tmpdir(), 'setup-wasm-pack')
    await io.mkdirP(tempFolder)
    const version = await wasm_version()
    core.info(`Installing wasm-pack ${version} ...`)
    const platform = process.env['PLATFORM'] || process.platform
    let ext = ''
    let arch = ''
    switch (platform) {
        case 'win32':
            ext = '.exe'
            arch = 'x86_64-pc-windows-msvc'
            break
        case 'darwin':
            arch = 'x86_64-apple-darwin'
            break
        case 'linux':
            arch = 'x86_64-unknown-linux-musl'
            break
        default:
            core.setFailed(`Unsupported platform: ${platform}`)
            return
    }
    const archive = `wasm-pack-${version}-${arch}`
    const url = `https://github.com/rustwasm/wasm-pack/releases/download/${version}/${archive}.tar.gz`
    core.info(`Downloading wasm-pack from ${url} ...`)
    const downloadArchive = await tc.downloadTool(url)
    core.info(`Extracting wasm-pack to ${tempFolder} ...`)
    const extractedFolder = await tc.extractTar(downloadArchive, tempFolder)
    const execFolder = path.join(os.homedir(), '.cargo', 'bin')
    await io.mkdirP(execFolder)
    const exec = `wasm-pack${ext}`
    const execPath = path.join(execFolder, exec)
    await io.mv(path.join(extractedFolder, archive, exec), execPath)
    await io.rmRF(path.join(extractedFolder, archive))
    core.info(`Installed wasm-pack to ${execPath} 🎉`)
    io.rmRF(tempFolder)

}

async function install_trunk(): Promise<void> {
    const tempFolder = path.join(os.tmpdir(), 'setup-trunk-pack')
    await io.mkdirP(tempFolder)
    const version = await trunk_version()
    core.info(`Installing trunk ${version} ...`)
    const platform = process.env['PLATFORM'] || process.platform
    let ext = ''
    let archive = ''
    switch (platform) {
        case 'win32':
            ext = '.exe'
            archive = 'trunk-x86_64-pc-windows-msvc.zip'
            break
        case 'darwin':
            archive = 'trunk-x86_64-apple-darwin.tar.gz'
            break
        case 'linux':
            archive = 'trunk-x86_64-unknown-linux-gnu.tar.gz'
            break
        default:
            core.setFailed(`Unsupported platform: ${platform}`)
            return
    }
    const url = `https://github.com/thedodd/trunk/releases/download/${version}/${archive}`
    core.info(`Downloading trunk from ${url} ...`)
    const downloadArchive = await tc.downloadTool(url)
    core.info(`Extracting trunk to ${tempFolder} ...`)
    const extractedFolder = await tc.extractTar(downloadArchive, tempFolder)
    const execFolder = path.join(os.homedir(), '.cargo', 'bin')
    await io.mkdirP(execFolder)
    const exec = `trunk${ext}`
    const execPath = path.join(execFolder, exec)
    await io.mv(path.join(extractedFolder, archive, exec), execPath)
    await io.rmRF(path.join(extractedFolder, archive))
    core.info(`Installed trunk to ${execPath} 🎉`)
    io.rmRF(tempFolder)

}


async function run(): Promise<void> {
    try {
        install_wasm()
        install_trunk()
    }
    catch (error) {
        core.setFailed(error.message)
    }
}

run().then(
    () => core.info('Done'),
    err => core.error(err),
)
