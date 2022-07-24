import { ES5_MODULE } from '../../assets/constants'
import type { Schema, Extension } from '../../assets/types'

export function gqlContext(
  schema: Schema,
  singleMode: boolean,
  ext: Extension,
): string {
  const importStatement = singleMode
    ? 'PrismaClient'
    : `PrismaClient as ${schema.pascal}Client`
  return {
    'd.ts': `import { ${importStatement} } from '${schema.output}'
export declare type Context = {
  ${singleMode ? 'prisma' : `${schema.camel}Client`}: ${
      singleMode ? 'prisma' : `${schema.pascal}Client`
    }
}
export declare const context: {
  ${singleMode ? 'prisma' : `${schema.camel}Client`}: ${
      singleMode ? 'prisma' : `${schema.pascal}Client`
    }<
    import('${schema.output}').Prisma.PrismaClientOptions,
    never,
    | import('${schema.output}').Prisma.RejectOnNotFound
    | import('${schema.output}').Prisma.RejectPerOperation
  >
}
`,
    js: `"use strict";
${ES5_MODULE}
exports.context = void 0;
const ${schema.camel}_1 = require("${schema.output}");
exports.context = {
    ${
      singleMode ? 'prisma' : `${schema.camel}Client`
    }: new ${schema.camel}_1.PrismaClient(),
};
`,
    ts: `import { ${importStatement} } from '${schema.output}'

export type Context = {
  ${singleMode ? 'prisma' : `${schema.camel}Client`}: ${
      singleMode ? 'prisma' : `${schema.pascal}Client`
    }
}

export const context = {
  ${singleMode ? 'prisma' : `${schema.camel}Client`}: new ${
      singleMode ? 'prisma' : `${schema.pascal}Client`
    }(),
}
`,
  }[ext]
}
