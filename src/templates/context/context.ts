import { ES5_MODULE } from '../../assets/constants'
import type { Schema, Extension } from '../../assets/types'

export function gqlContext(schema: Schema, singleMode: boolean, ext: Extension): string {
  return {
    'd.ts': `import { PrismaClient${singleMode ? '' : ` as ${schema.pascal}Client`} } from '${schema.output}';
export declare type Context = {
  ${schema.camel}Client: ${schema.pascal}Client;
};
export declare const context: {
  ${schema.camel}Client: ${schema.pascal}Client<
    import("${schema.output}").Prisma.PrismaClientOptions,
    never,
    | import("${schema.output}").Prisma.RejectOnNotFound
    | import("${schema.output}").Prisma.RejectPerOperation
    | undefined
  >;
};
`,
    js: `"use strict";
${ES5_MODULE}
exports.context = void 0;
const ${schema.camel}_1 = require("${schema.output}");
exports.context = {
    ${schema.camel}Client: new ${schema.camel}_1.PrismaClient(),
};
`,
    ts: `import { PrismaClient ${singleMode ? '' : `as ${schema.pascal}Client `}} from '${schema.output}'

export type Context = {
  ${singleMode ? 'prisma' : `${schema.camel}Client`}: ${singleMode ? 'PrismaClient' : `${schema.pascal}Client`}
}

export const context = {
  ${singleMode ? 'prisma: new PrismaClient()' : `${schema.camel}Client: new ${schema.pascal}Client(),`}
}
`,
  }[ext]
}
