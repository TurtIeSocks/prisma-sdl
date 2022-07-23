import { resolve } from 'path'

import type { ReturnObj, Extension } from '../assets/types'
import { createIndexes } from './createIndexes'
import { writeSafe } from './writeSafe'

export function writeFiles(dest: string, header: string, { schema, models, ...rest }: ReturnObj, extensions: Extension[]): void {
  models.map(({ templates }) =>
    Object.values(templates).map((model) => {
      const { location, fileName, ...files } = model
      Object.entries(files).map(([ext, content]) => {
        writeSafe(`${header}${content}`, `${fileName}.${ext}`, dest, schema.name, ...location.split('/'))
      })
    }),
  )
  Object.entries(rest).map(([fileName, contents]) => {
    Object.entries(contents).map(([ext, content]) => {
      writeSafe(`${header}${content}`, `${fileName}.${ext}`, dest, schema.name, 'server', fileName)
    })
  })
  createIndexes(resolve(dest, schema.name), header, extensions)
}
