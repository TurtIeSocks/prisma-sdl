import { ES5_MODULE } from '../../assets/constants'
import type { Model, Extension } from '../../assets/types'

export function serverSDL(model: Model, mutation: boolean, ext: Extension): string {
  return {
    'd.ts': `export declare const ${model.screamingSnake}${mutation ? '_INPUT' : ''}: import("graphql").DocumentNode;\n`,
    js: `"use strict";
${ES5_MODULE}
exports.${model.screamingSnake}${mutation ? '_INPUT' : ''} = void 0;
const apollo_server_core_1 = require("apollo-server-core");
exports.${model.screamingSnake}${mutation ? '_INPUT' : ''} = (0, apollo_server_core_1.gql) \`
  ${mutation ? 'input' : 'type'} ${model.name}${mutation ? 'Input' : ''} {
    ${model.properties.map((x) => `${x.name}: ${x.type}`).join('\n    ')}
  }
\`;
  `,
    ts: `import { gql } from 'apollo-server-core'
export const ${model.screamingSnake}${mutation ? '_INPUT' : ''} = gql\`
  ${mutation ? 'input' : 'type'} ${model.name}${mutation ? 'Input' : ''} {
    ${model.properties.map((x) => `${x.name}: ${x.type}`).join('\n    ')}
  }
\`
  `,
  }[ext]
}
