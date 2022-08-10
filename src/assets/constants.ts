import type { Base, Schema, Model } from './types'

export const VALID_TYPES = [
  'Boolean',
  'DateTime',
  'Float',
  'Int',
  'JSON',
  'String',
] as const

export const REGEX =
  /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g

export const KEYS: (keyof Base)[] = [
  'name',
  'namePlural',
  'camel',
  'camelPlural',
  'upper',
  'upperPlural',
  'lower',
  'lowerPlural',
  'pascal',
  'pascalPlural',
  'snake',
  'snakePlural',
  'screamingSnake',
  'screamingSnakePlural',
]

export const SCHEMA_KEYS: (keyof Omit<Schema, keyof Base>)[] = [
  'hasDate',
  'hasJson',
  'output',
]
export const MODEL_KEYS: (keyof Omit<Model, keyof Base>)[] = [
  'pKey',
  'pType',
  'pGqlType',
  'properties',
]

export const TS_UTILITIES = `// ==============================================================
// Utility Types

// Adds the __typename property to the incoming GQL query
export type GqlTypename<T, U = string> = T & { __typename: U }

// Adds the __typename and object access name to the GQL query
export type GqlQuery<T, U extends string, A = true> = {
  [name in U]: A extends true ? T[] : T
}

// hack until https://github.com/prisma/prisma/issues/9247 is fixed
export type JsonSafe<T, U extends string> = T & { [key in U]: object }

// ==============================================================`

export const ES5_BINDING = `var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));`

export const ES5_IMPORT = `var __importStar = (this && this.__importStar) || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
};`

export const ES5_EXPORT = `var __exportStar = (this && this.__exportStar) || function(m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};`

export const ES5_SET_DEFAULT = `var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
});`

export const ES5_MODULE = `Object.defineProperty(exports, "__esModule", { value: true });`
