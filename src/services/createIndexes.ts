import fs from 'fs'
import { resolve } from 'path'
import type { Extension } from '../assets/types'
import { ES5_BINDING, ES5_EXPORT, ES5_MODULE } from '../assets/constants'
import { writeSafe } from './writeSafe'

function getFiles(path: string, header: string, extensions: Extension[]): void {
  const files = [
    ...new Set(
      fs
        .readdirSync(path)
        .filter((x) => !x.includes('index'))
        .map((x) => x.replace(/\.d\.ts|\.js|\.ts/g, '')),
    ),
  ]
  if (files.length) {
    const indexString = files.map((file) => `export * from './${file.split('.')[0]}'`).join('\n')
    extensions.forEach((ext) => {
      if (path.includes('server') && ext === 'js') {
        writeSafe(
          `${header}${ES5_BINDING}\n${ES5_EXPORT}\n${ES5_MODULE}\n${files.map((file) => `__exportStar(require("./${file}"), exports);`).join('\n')}\n`,
          'index.js',
          path,
        )
      } else {
        writeSafe(`${header}${indexString}`, `index.${ext}`, path)
      }
    })
  }
}

export function createIndexes(path: string, header: string, extensions: Extension[]): void {
  if (fs.existsSync(path)) {
    const folders = fs.readdirSync(path).filter((x) => fs.lstatSync(resolve(path, x)).isDirectory())

    if (folders.length) {
      folders.forEach((folder) => {
        getFiles(resolve(path, folder), header, extensions)
        createIndexes(resolve(path, folder), header, extensions)
      })
    } else {
      getFiles(resolve(path), header, extensions)
    }
  }
}
