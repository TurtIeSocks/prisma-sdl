import { ES5_MODULE } from '../../assets/constants'
import type { Model, Schema, Extension } from '../../assets/types'

export function queryOne(schema: Schema, model: Model, singleMode: boolean, ext: Extension): string {
  const context = singleMode ? 'prisma' : `${schema.camel}Client: prisma`

  return {
    'd.ts': `import type { Context } from '../../context';
export declare const ${model.camel}: (_parent: unknown, { ${model.pKey} }: {
    ${model.pKey}: ${model.pType};
}, { ${context} }: Context) => Promise<import("${schema.output}").${model.name} | null>;
`,
    js: `"use strict";
${ES5_MODULE}
exports.${model.camel} = void 0;
const ${model.camel} = async (_parent, { ${model.pKey} }, { ${context} }) => prisma.${model.camel}.findFirst({ where: { ${model.pKey} } });
exports.${model.camel} = ${model.camel};
`,
    ts: `import type { Context } from '../../context'

export const ${model.camel} = async (
  _parent: unknown,
  { ${model.pKey} }: { ${model.pKey}: ${model.pType} },
  { ${context} }: Context,
) => prisma.${model.camel}.findFirst({ where: { ${model.pKey} } })
`,
  }[ext]
}
