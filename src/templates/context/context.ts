import type { Extension } from '../../assets/types'

export function gqlContext(ext: Extension): string {
  return {
    'd.ts': `import { {{context_import_statement}} } from '{{schema_output}}'

export declare type Context = {
  {{context_context}}: {{context_context_pascal}}
}
export declare const context: {
  {{context_context}}: {{context_context_pascal}}<
    import('{{schema_output}}').Prisma.PrismaClientOptions,
    never,
    | import('{{schema_output}}').Prisma.RejectOnNotFound
    | import('{{schema_output}}').Prisma.RejectPerOperation
  >
}
`,
    js: `"use strict";
{{es5_module}}
exports.context = void 0;
const {{schema_camel}}_1 = require("{{schema_output}}");
exports.context = {
    {{context_context}}: new {{schema_camel}}_1.PrismaClient(),
};
`,
    ts: `import { {{context_import_statement}} } from '{{schema_output}}'

export type Context = {
  {{context_context}}: {{context_context_pascal}}
}

export const context = {
  {{context_context}}: new {{context_context_pascal}}(),
}
`,
  }[ext]
}
