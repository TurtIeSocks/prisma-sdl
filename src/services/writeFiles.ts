import fs from 'fs'
import { resolve } from 'path'

import { TS_UTILITIES } from '../assets/constants'
import type { ReturnObj, SafeOptions } from '../assets/types'
import { createIndexes } from './createIndexes'
import { writeSafe } from './writeSafe'
import { compiler } from './compiler'

export function writeFiles(
  { schema, models, ...rest }: ReturnObj,
  options: SafeOptions,
): void {
  writeSafe(
    `${options.header}${TS_UTILITIES}`,
    'utilities.ts',
    options.dest,
    schema.name,
    'types',
  )
  models.forEach(({ templates }) =>
    Object.values(templates).forEach((model) => {
      const { location, fileName, ...files } = model
      Object.entries(files).forEach(([ext, content]) => {
        writeSafe(
          `${options.header}${content}`,
          `${fileName}.${ext}`,
          options.dest,
          schema.name,
          ...location.split('/'),
        )
      })
    }),
  )
  Object.entries(rest).forEach(([fileName, contents]) => {
    Object.entries(contents).forEach(([ext, content]) => {
      writeSafe(
        `${options.header}${content}`,
        `${fileName}.${ext}`,
        options.dest,
        schema.name,
        'server',
        fileName,
      )
    })
  })
  const { server, client } = createIndexes(
    resolve(options.dest, schema.name),
    options,
  )
  if (options.tscClient) {
    compiler(client, `${schema.name}/client`, options)
  }
  if (options.tscServer) {
    compiler(server, `${schema.name}/server`, options)
  }
  // if (!options.fileTypes.includes('ts')) {
  //   server.forEach((fileName) => {
  //     fs.unlinkSync(fileName)
  //   })
  //   client.forEach((fileName) => {
  //     fs.unlinkSync(fileName)
  //   })
  // }
}
