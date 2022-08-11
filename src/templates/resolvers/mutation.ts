import type { Extension } from '../../assets/types'

export function mutation(ext: Extension): string {
  return {
    js: `'use strict'
{{es5_module}}
exports.edit{{model_pascalPlural}} = void 0
async function edit{{model_pascalPlural}}(
  _parent,
  { incoming, deleting },
  { {{resolvers_context}} },
) {
  if (deleting) {
    await prisma.{{model_camel}}.deleteMany({
      where: { {{model_pKey}}: { in: incoming.map((x) => x.{{model_pKey}}) } },
    })
    return incoming.map((x) => ({ {{model_pKey}}: x.{{model_pKey}} }))
  }
  return Promise.all(
    incoming.map(async (x) => {
      const { {{model_pKey}}, {{model_autos}}...properties } = x
      return prisma.{{model_camel}}.upsert({
        where: { {{model_pKey}} },
        create: properties,
        update: properties,
      })
    }),
  )
}
exports.edit{{model_pascalPlural}} = edit{{model_pascalPlural}}
`,
    ts: `import type { Context } from '../../context'
import type { {{schema_pascal}}{{model_pascal}}{{model_json_safe_import}} } from '../../../types'

export async function edit{{model_pascalPlural}}(
  _parent: unknown,
  {
    incoming,
    deleting,
  }: { incoming: {{model_json_props}}[]; deleting: boolean },
  { {{resolvers_context}} }: Context,
): Promise<Pick<{{schema_pascal}}{{model_pascal}}, '{{model_pKey}}'>[]> {
  if (deleting) {
    await prisma.{{model_camel}}.deleteMany({
      where: { {{model_pKey}}: { in: incoming.map((x) => x.{{model_pKey}}) } },
    })
    return incoming.map((x) => ({ {{model_pKey}}: x.{{model_pKey}} }))
  }
  return Promise.all(
    incoming.map(async (x) => {
      const { {{model_pKey}}, {{model_autos}}...properties } = x
      return prisma.{{model_camel}}.upsert({
        where: { {{model_pKey}} },
        create: properties,
        update: properties,
      })
    }),
  )
}
`,
    'd.ts': `import type { Context } from '../../context'
import type { {{schema_pascal}}{{model_pascal}}{{model_json_safe_import}} } from '../../../types'

export declare function edit{{model_pascalPlural}}(
  _parent: unknown,
  {
    incoming,
    deleting,
  }: {
    incoming: {{model_json_props}}[]
    deleting: boolean
  },
  { {{resolvers_context}} }: Context,
): Promise<Pick<{{schema_pascal}}{{model_pascal}}, '{{model_pKey}}'>[]>
`,
  }[ext]
}
