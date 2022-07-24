import { ES5_MODULE } from '../../assets/constants'
import type { Model, Schema, Extension } from '../../assets/types'

export function queryOne(
  schema: Schema,
  model: Model,
  singleMode: boolean,
  ext: Extension,
): string {
  const context = singleMode ? 'prisma' : `${schema.camel}Client: prisma`

  return {
    'd.ts': `import type { Context } from '../../context';
import type { ${schema.pascal}${model.pascal} } from '../../../types';
export declare function ${model.camel}(_parent: unknown, { ${model.pKey} }: {
    ${model.pKey}: ${model.pType};
}, { ${context} }: Context): Promise<${schema.pascal}${model.pascal} | null>;
`,
    js: `'use strict'
${ES5_MODULE}
exports.${model.camel} = void 0
async function ${model.camel}(_parent, { ${model.pKey} }, { ${context} }) {
  return prisma.${model.camel}.findFirst({ where: { ${model.pKey} } })
}
exports.${model.camel} = ${model.camel}
`,
    ts: `import type { Context } from '../../context'
import type { ${schema.pascal}${model.pascal} } from '../../../types'

export async function ${model.camel}(
  _parent: unknown,
  { ${model.pKey} }: { ${model.pKey}: ${model.pType} },
  { ${context} }: Context,
): Promise<${schema.pascal}${model.pascal} | null> {
  return prisma.${model.camel}.findFirst({ where: { ${model.pKey} } })
}
`,
  }[ext]
}
