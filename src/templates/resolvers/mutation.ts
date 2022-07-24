import { ES5_MODULE } from '../../assets/constants'
import type { Model, Schema, Extension } from '../../assets/types'

export function mutation(
  schema: Schema,
  model: Model,
  singleMode: boolean,
  ext: Extension,
): string {
  const autos = model.properties
    .filter((prop) => prop.auto)
    .map((x) => x.name)
    .join(', ')
  const modelHasJson = model.properties.some((prop) => prop.type === 'JSON')
  const context = singleMode ? 'prisma' : `${schema.camel}Client: prisma`

  return {
    js: `'use strict'
${ES5_MODULE}
exports.edit${model.pascalPlural} = void 0
async function edit${model.pascalPlural}(
  _parent,
  { incoming, deleting },
  { ${context} },
) {
  if (deleting) {
    await prisma.${model.camel}.deleteMany({
      where: { ${model.pKey}: { in: incoming.map((x) => x.${model.pKey}) } },
    })
    return incoming.map((x) => ({ ${model.pKey}: x.${model.pKey} }))
  }
  return Promise.all(
    incoming.map(async (x) => {
      const { ${model.pKey}, ${autos ? `${autos}, ` : ''}...properties } = x
      return prisma.${model.camel}.upsert({
        where: { ${model.pKey} },
        create: properties,
        update: properties,
      })
    }),
  )
}
exports.edit${model.pascalPlural} = edit${model.pascalPlural}
`,
    ts: `import type { Context } from '../../context'
import type { ${schema.pascal}${model.pascal}${
      modelHasJson ? ', JsonSafe' : ''
    } } from '../../../types'

export async function edit${model.pascalPlural}(
  _parent: unknown,
  {
    incoming,
    deleting,
  }: { incoming: ${
    modelHasJson
      ? `JsonSafe<${schema.pascal}${model.pascal}, ${model.properties
          .filter((x) => x.type === 'JSON')
          .map((x) => `'${x.name}'`)
          .join(' | ')}>`
      : `${schema.pascal}${model.pascal}`
  }[]; deleting: boolean },
  { ${context} }: Context,
): Promise<Pick<${schema.pascal}${model.pascal}, '${model.pKey}'>[]> {
  if (deleting) {
    await prisma.${model.camel}.deleteMany({
      where: { ${model.pKey}: { in: incoming.map((x) => x.${model.pKey}) } },
    })
    return incoming.map((x) => ({ ${model.pKey}: x.${model.pKey} }))
  }
  return Promise.all(
    incoming.map(async (x) => {
      const { ${model.pKey}, ${autos ? `${autos}, ` : ''}...properties } = x
      return prisma.${model.camel}.upsert({
        where: { ${model.pKey} },
        create: properties,
        update: properties,
      })
    }),
  )
}
`,
    'd.ts': `import type { Context } from '../../context'
import type { ${schema.pascal}${model.pascal}${
      modelHasJson ? ', JsonSafe' : ''
    } } from '../../../types'
export declare function edit${model.pascalPlural}(
  _parent: unknown,
  {
    incoming,
    deleting,
  }: {
    incoming: ${
      modelHasJson
        ? `JsonSafe<${schema.pascal}${model.pascal}, ${model.properties
            .filter((x) => x.type === 'JSON')
            .map((x) => `'${x.name}'`)
            .join(' | ')}`
        : `${schema.pascal}${model.pascal}`
    }>[]
    deleting: boolean
  },
  { ${context} }: Context,
): Promise<Pick<${schema.pascal}${model.pascal}, '${model.pKey}'>[]>
`,
  }[ext]
}
