import type { Extension } from '../../assets/types'

export function queryAll(ext: Extension): string {
  return {
    'd.ts': `import type { Context } from '../../context'
import type { {{schema_pascal}}{{model_pascal}} } from '../../../types'
export declare function {{model_camelPlural}}(
  _parent: unknown,
  _args: unknown,
  { {{resolvers_context}} }: Context,
): Promise<{{schema_pascal}}{{model_pascal}}[]>
`,
    js: `'use strict'
{{es5_module}}
exports.{{model_camelPlural}} = void 0
async function {{model_camelPlural}}(_parent, _args, { {{resolvers_context}} }) {
  return prisma.{{model_camel}}.findMany({ orderBy: { {{model_pKey}}: 'asc' } })
}
exports.{{model_camelPlural}} = {{model_camelPlural}}
`,
    ts: `import type { Context } from '../../context'
import type { {{schema_pascal}}{{model_pascal}} } from '../../../types'
export async function {{model_camelPlural}}(
  _parent: unknown,
  _args: unknown,
  { {{resolvers_context}} }: Context,
): Promise<{{schema_pascal}}{{model_pascal}}[]> {
  return prisma.{{model_camel}}.findMany({ orderBy: { {{model_pKey}}: 'asc' } })
}
`,
  }[ext]
}
