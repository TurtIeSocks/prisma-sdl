import fs from 'fs'
import { join } from 'path'

import type { Schema } from '../assets/types'
import { getConventions } from './utils'

export function search(
  startPath: string,
  input: string,
  found: string[] = [],
): string[] {
  if (!fs.existsSync(startPath)) return found

  fs.readdirSync(startPath).forEach((file) => {
    const filename = join(startPath, file)
    const stat = fs.lstatSync(filename)
    if (stat.isDirectory()) {
      search(filename, input, found)
    } else if (filename.endsWith(input) && !filename.includes('node_modules')) {
      console.log('Found:', filename)
      found.push(filename)
    }
  })
  return found
}

export function getSchemas(root: string): Schema[] {
  const schemas = search(root, 'schema.prisma')
  let fallback = 'a'
  return schemas.map((path, i) => {
    const schema = fs.readFileSync(path).toString()
    const generatorClient = schema
      .split('generator client {')![1]!
      .split('}')![0]!
      .split('\n')
      .map((line) => line.trim())

    const name = generatorClient
      .find((line) => line.startsWith('sdlGenerator'))
      ?.match(/"(.*?)"/)?.[0]
      ?.replace(/"/g, '')
    const output = generatorClient
      .find((line) => line.startsWith('output'))
      ?.split('node_modules/')[1]
      ?.replace(/"/g, '')
    if (!name) {
      console.warn('Name not found for schema', path)
    }
    fallback = i
      ? String.fromCharCode(fallback.charCodeAt(fallback.length - 1) + 1)
      : fallback

    return {
      ...getConventions(name || (schemas.length > 1 ? fallback : '')),
      schema,
      output: output || '@prisma/client',
      hasJson: schema.includes('Json'),
      hasDate: schema.includes('DateTime'),
    }
  })
}
