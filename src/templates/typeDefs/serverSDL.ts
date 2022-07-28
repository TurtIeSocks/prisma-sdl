import type { Model, Extension } from '../../assets/types'

export function serverSDL(
  model: Model,
  mutation: boolean,
  ext: Extension,
): string {
  return {
    'd.ts': `export declare const {{model_screamingSnake}}${
      mutation ? '_INPUT' : ''
    }: import("graphql").DocumentNode;\n`,
    js: `"use strict";
{{es5_module}}
exports.{{model_screamingSnake}}${mutation ? '_INPUT' : ''} = void 0;
const apollo_server_core_1 = require("apollo-server-core");
exports.{{model_screamingSnake}}${
      mutation ? '_INPUT' : ''
    } = (0, apollo_server_core_1.gql) \`
  ${mutation ? 'input' : 'type'} {{model_name}}${mutation ? 'Input' : ''} {
    {{model_td_props}}
  }
\`;
  `,
    ts: `import { gql } from 'apollo-server-core'
export const {{model_screamingSnake}}${mutation ? '_INPUT' : ''} = gql\`
  ${mutation ? 'input' : 'type'} {{model_name}}${mutation ? 'Input' : ''} {
    {{model_td_props}}
  }
\`
  `,
  }[ext]
}
