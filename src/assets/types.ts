import { VALID_TYPES } from './constants'

export interface Options {
  root?: string
  dest?: string
  header?: string
  fileTypes?: Extension[]
  tscClient?: string
  tscServer?: string
}

export interface SafeOptions extends Required<Options> {
  internalFileTypes: Extension[]
}

export interface ReturnObj {
  models: ModelTemplate[]
  schema: Schema
  resolvers: FileTypes
  typeDefs: FileTypes
  context: FileTypes
}

export type TsFiles = { server: string[]; client: string[] }

export type ValidType = typeof VALID_TYPES[number] | ''

export interface FileTypes {
  'd.ts'?: string
  js?: string
  ts?: string
}

export type Extension = keyof FileTypes

export interface ModelFile extends FileTypes {
  location: string
  fileName: string
}

export interface Base {
  name: string
  namePlural: string
  camel: string
  camelPlural: string
  upper: string
  upperPlural: string
  lower: string
  lowerPlural: string
  pascal: string
  pascalPlural: string
  snake: string
  snakePlural: string
  screamingSnake: string
  screamingSnakePlural: string
}

export interface Schema extends Base {
  schema: string
  output: string
  hasJson: boolean
  hasDate: boolean
}

export interface Model extends Base {
  type: 'model' | 'enum'
  pKey: string
  pType: string
  pGqlType: string
  properties: {
    name: string
    type: ValidType
    optional: boolean
    auto: boolean
  }[]
}

export interface ModelTemplate extends Model {
  templates: {
    serverQueryAll: ModelFile
    serverQueryOne: ModelFile
    serverMut: ModelFile
    serverTdQueries: ModelFile
    serverTdMut: ModelFile
    clientAllQuery: ModelFile
    clientOneQuery: ModelFile
    clientMut: ModelFile
    hookAll: ModelFile
    hookOne: ModelFile
    hookMut: ModelFile
    tsTypes: ModelFile
  }
}
