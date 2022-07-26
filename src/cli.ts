#! /usr/bin/env node
import fs from 'fs'

import { prismaSdl } from './index'
import { search } from './services/getSchemas'
import type { Options } from './assets/types'

const args = process.argv.slice(2, process.argv.length)

const configNameRaw = args.find((arg) => arg.startsWith('config='))
const configName = configNameRaw ? configNameRaw.split('=')[1]! : ''

const rootRaw = args.find((arg) => arg.startsWith('root='))
const root = rootRaw ? rootRaw.split('=')[1]! : process.cwd()

const configFilePath = search(root, configName || 'prismaSdl.config.json')

const config: Options =
  configFilePath.length && typeof configFilePath[0] === 'string'
    ? JSON.parse(fs.readFileSync(configFilePath[0]).toString())
    : {}

const destRaw = args.find((arg) => arg.startsWith('dest='))
const dest = destRaw ? destRaw.split('=')[1] : config.dest

const fileTypesRaw = args.find((arg) => arg.startsWith('fileTypes='))
const fileTypes = (
  fileTypesRaw
    ? fileTypesRaw
        .split('=')[1]!
        .split(',')
        .map((ext) => ext.trim())
    : config.fileTypes
) as Options['fileTypes']

const headerRaw = args.find((arg) => arg.startsWith('header='))
const header = headerRaw ? headerRaw.split('=')[1] : config.header

const tscClientRaw = args.find((arg) => arg.startsWith('tscClient='))
const tscClient = tscClientRaw ? tscClientRaw.split('=')[1] : config.tscClient

const tscServerRaw = args.find((arg) => arg.startsWith('tscServer='))
const tscServer = tscServerRaw ? tscServerRaw.split('=')[1] : config.tscServer

prismaSdl({
  root,
  dest,
  fileTypes,
  header,
  tscClient,
  tscServer,
})
