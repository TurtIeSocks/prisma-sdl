import type { Extension } from '../../assets/types'

export function queryOne(ext: Extension): string {
  return {
    'd.ts': `import type { Context } from '../../context';
import type { {{schema_pascal}}{{model_pascal}} } from '../../../types';

export declare function {{model_camel}}(_parent: unknown, { {{model_pKey}} }: {
    {{model_pKey}}: {{model_pType}};
}, { {{resolvers_context}} }: Context): Promise<{{schema_pascal}}{{model_pascal}} | null>;
`,
    js: `'use strict'
{{es5_module}}
exports.{{model_camel}} = void 0
async function {{model_camel}}(_parent, { {{model_pKey}} }, { {{resolvers_context}} }) {
  return prisma.{{model_camel}}.findFirst({ where: { {{model_pKey}} } })
}
exports.{{model_camel}} = {{model_camel}}
`,
    ts: `import type { Context } from '../../context'
import type { {{schema_pascal}}{{model_pascal}} } from '../../../types'

export async function {{model_camel}}(
  _parent: unknown,
  { {{model_pKey}} }: { {{model_pKey}}: {{model_pType}} },
  { {{resolvers_context}} }: Context,
): Promise<{{schema_pascal}}{{model_pascal}} | null> {
  return prisma.{{model_camel}}.findFirst({ where: { {{model_pKey}} } })
}
`,
  }[ext]
}
