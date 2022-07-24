import { ES5_MODULE } from '../../assets/constants'
import type { Model, Schema, Extension } from '../../assets/types'

export function queryAll(
  schema: Schema,
  model: Model,
  singleMode: boolean,
  ext: Extension,
): string {
  const context = singleMode ? 'prisma' : `${schema.camel}Client: prisma`

  return {
    'd.ts': `import type { Context } from '../../context'
import type { ${schema.pascal}${model.pascal} } from '../../../types'
export declare function ${model.camelPlural}(
  _parent: unknown,
  _args: unknown,
  { ${context} }: Context,
): Promise<${schema.pascal}${model.pascal}[]>
`,
    js: `'use strict'
${ES5_MODULE}
exports.${model.camelPlural} = void 0
async function ${model.camelPlural}(_parent, _args, { ${context} }) {
  return prisma.${model.camel}.findMany({ orderBy: { sid: 'asc' } })
}
exports.${model.camelPlural} = ${model.camelPlural}
`,
    ts: `import type { Context } from '../../context'
import type { ${schema.pascal}${model.pascal} } from '../../../types'
export async function ${model.camelPlural}(
  _parent: unknown,
  _args: unknown,
  { ${context} }: Context,
): Promise<${schema.pascal}${model.pascal}[]> {
  return prisma.${model.camel}.findMany({ orderBy: { sid: 'asc' } })
}
`,
  }[ext]
}
