import { ES5_MODULE } from '../../assets/constants'
import type { Model, Schema, Extension } from '../../assets/types'

export function mutation(schema: Schema, model: Model, singleMode: boolean, ext: Extension): string {
  const autos = model.properties.filter((prop) => prop.auto).map((x) => x.name)
  const modelHasJson = model.properties.some((prop) => prop.type === 'JSON')
  const context = singleMode ? 'prisma' : `${schema.camel}Client: prisma`

  return {
    js: `"use strict";
${ES5_MODULE}
exports.edit${model.pascalPlural} = void 0;
const edit${model.pascalPlural} = async (_parent, { incoming, deleting }, { ${context} }) => {
    if (deleting) {
        await prisma.${model.camel}.deleteMany({
            where: { ${model.pKey}: { in: incoming.map((x) => x.${model.pKey}) } },
        });
        return incoming.map((x) => ({ id: x.id }));
    }
    return Promise.all(incoming.map(async (x) => {
        const { id, ${autos.join(', ')}, ...properties } = x;
        return prisma.${model.camel}.upsert({
            where: { id },
            create: properties,
            update: properties,
        });
    }));
};
exports.edit${model.pascalPlural} = edit${model.pascalPlural};
`,
    ts: `import type { Context } from '../../context'
import type { ${schema.pascal}${model.name} } from '../../../types'${
      modelHasJson ? `\nimport type { JsonSafe } from '${singleMode ? '' : '../'}../../../utilTypes'` : ''
    }

export const edit${model.pascalPlural} = async (
  _parent: unknown,
  { incoming, deleting }: { incoming: ${
    modelHasJson
      ? `JsonSafe<${schema.pascal}${model.name}, ${model.properties
          .filter((x) => x.type === 'JSON')
          .map((x) => `'${x.name}'`)
          .join(' | ')}>`
      : `${schema.pascal}${model.name}`
  }[]; deleting: boolean },
  { ${context} }: Context,
) => {
  if (deleting) {
    await prisma.${model.camel}.deleteMany({
      where: { ${model.pKey}: { in: incoming.map((x) => x.${model.pKey}) } },
    })
    return incoming.map((x) => ({ ${model.pKey}: x.${model.pKey} }))
  }
  return Promise.all(
    incoming.map(async (x) => {
      const { ${model.pKey},${autos.length ? ` ${autos.join(', ')},` : ''} ...properties } = x
      return prisma.${model.camel}.upsert({
        where: { ${model.pKey} },
        create: properties,
        update: properties,
      })
    }),
  )
}
`,
    'd.ts': `import type { Context } from '../../context';
export declare const edit${model.camelPlural}: (_parent: unknown, { incoming, deleting }: {
  incoming: import("${schema.output}").${model.name}[]; 
  deleting: boolean; 
}, { ${context} }: Context) => Promise<import("${schema.output}").${model.name}[] | Pick<import("${schema.output}").${model.name}, "${model.pKey}">[]>;
`,
  }[ext]
}
