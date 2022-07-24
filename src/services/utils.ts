import { REGEX } from '../assets/constants'
import type { Base, ValidType } from '../assets/types'

export function toCamelCase(str: string): string {
  const s = ((str && str.match(REGEX)) || [])
    .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
    .join('')
  return s.slice(0, 1).toLowerCase() + s.slice(1)
}

export function pascalCase(str: string): string {
  return ((str && str.match(REGEX)) || [])
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
    .join('')
}

export function toSnakeCase(str: string): string {
  return ((str && str.match(REGEX)) || []).map((x) => x.toLowerCase()).join('_')
}

export function makePlural(str: string): string {
  if (str.endsWith('s')) return str
  if (str.endsWith('y')) return `${str.slice(0, -1)}ies`
  return `${str}s`
}

export function getConventions(name: string): Base {
  const plural = makePlural(name)
  const camel = toCamelCase(name)
  const pascal = pascalCase(name)
  const snake = toSnakeCase(name)

  return {
    name,
    namePlural: plural,
    camel,
    camelPlural: makePlural(camel),
    upper: name.toUpperCase(),
    upperPlural: plural.toUpperCase(),
    lower: name.toLowerCase(),
    lowerPlural: plural.toLowerCase(),
    pascal,
    pascalPlural: makePlural(pascal),
    snake,
    snakePlural: makePlural(snake),
    screamingSnake: snake.toUpperCase(),
    screamingSnakePlural: makePlural(snake).toUpperCase(),
  }
}

export function getTsType(type: ValidType[number]) {
  switch (type) {
    case 'String':
      return 'string'
    case 'Float':
    case 'Int':
      return 'number'
    case 'Bool':
      return 'boolean'
    case 'DateTime':
      return 'Date'
    case 'Json':
      return 'JSON'
    default:
      return 'unknown'
  }
}
