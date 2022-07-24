import fs from 'fs'
import { resolve } from 'path'
import type { SafeOptions, TsFiles } from '../assets/types'
import { ES5_BINDING, ES5_EXPORT, ES5_MODULE } from '../assets/constants'
import { writeSafe } from './writeSafe'

function getFiles(path: string, opt: SafeOptions, tsFiles: TsFiles): void {
  const isServer = path.includes('server')
  const files = [
    ...new Set(
      fs
        .readdirSync(path)
        .filter((x) => !x.includes('index'))
        .map((x) => x.replace(/\.d\.ts|\.js|\.ts/g, '')),
    ),
  ]
  if (files.length) {
    const indexString = files
      .map((file) => `export * from './${file.split('.')[0]}'`)
      .join('\n')
    opt.internalFileTypes.forEach((ext) => {
      if (ext === 'ts') {
        files.forEach((file) => {
          if (isServer) {
            tsFiles.server.push(resolve(path, `${file}.ts`))
          } else {
            tsFiles.client.push(resolve(path, `${file}.ts`))
          }
        })
        if (path.includes('server')) {
          tsFiles.server.push(resolve(path, 'index.ts'))
        } else {
          tsFiles.client.push(resolve(path, 'index.ts'))
        }
      }
      if (path.includes('server') && ext === 'js') {
        writeSafe(
          `${opt.header}${ES5_BINDING}\n${ES5_EXPORT}\n${ES5_MODULE}\n${files
            .map((file) => `__exportStar(require("./${file}"), exports);`)
            .join('\n')}\n`,
          'index.js',
          path,
        )
      } else {
        writeSafe(`${opt.header}${indexString}`, `index.${ext}`, path)
      }
    })
  }
}

export function createIndexes(
  path: string,
  options: SafeOptions,
  tsFiles: TsFiles = { server: [], client: [] },
): TsFiles {
  if (fs.existsSync(path)) {
    const folders = fs
      .readdirSync(path)
      .filter((x) => fs.lstatSync(resolve(path, x)).isDirectory())

    if (folders.length) {
      folders.forEach((folder) => {
        getFiles(resolve(path, folder), options, tsFiles)
        createIndexes(resolve(path, folder), options, tsFiles)
      })
    } else {
      getFiles(resolve(path), options, tsFiles)
    }
  }
  return tsFiles
}
