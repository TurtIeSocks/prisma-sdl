import { ES5_MODULE } from '../../assets/constants'
import type { Model, Schema, Extension } from '../../assets/types'

export function queryAll(schema: Schema, model: Model, singleMode: boolean, ext: Extension): string {
  const context = singleMode ? 'prisma' : `${schema.camel}Client: prisma`

  return {
    'd.ts': `import type { Context } from '../../context';
export declare const ${model.camelPlural}: (_parent: unknown, _args: unknown, { ${context} }: Context) => Promise<import("${schema.output}").${model.name}[]>;
  `,
    js: `"use strict";
${ES5_MODULE}
exports.${model.camelPlural} = void 0;
const ${model.camelPlural} = async (_parent, _args, { ${context} }) => prisma.${model.camel}.findMany({ orderBy: { id: 'asc' } });
exports.${model.camelPlural} = ${model.camelPlural};
`,
    ts: `import type { Context } from '../../context'
export const ${model.camelPlural} = async (
  _parent: unknown,
  _args: unknown,
  { ${context} }: Context,
) => prisma.${model.camel}.findMany({ orderBy: { ${model.pKey}: 'asc' } })
`,
  }[ext]
}
