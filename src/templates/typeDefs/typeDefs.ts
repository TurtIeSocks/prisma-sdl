import {
  ES5_BINDING,
  ES5_IMPORT,
  ES5_MODULE,
  ES5_SET_DEFAULT,
} from '../../assets/constants'
import type { ModelTemplate, Schema, Extension } from '../../assets/types'

export function allTypeDefs(
  schema: Schema,
  models: ModelTemplate[],
  ext: Extension,
): string {
  return {
    'd.ts': `export declare const typeDefs: import("graphql").DocumentNode;\n`,
    js: `"use strict";
${ES5_BINDING}
${ES5_SET_DEFAULT}
${ES5_IMPORT}
${ES5_MODULE}
exports.typeDefs = void 0;
const apollo_server_core_1 = require("apollo-server-core");
const queries = __importStar(require("./queries"));
const mutations = __importStar(require("./mutations"));
exports.typeDefs = (0, apollo_server_core_1.gql) \`
  \${queries}
  \${mutations}

  ${schema.hasJson ? 'scalar JSON' : ''}
  ${schema.hasDate ? 'scalar DateTime' : ''}

  type Query {
    ${models
      .map(
        (model) =>
          `${model.camel}(${model.pKey}: ${model.pType}): [${model.name}]\n    ${model.camelPlural}: [${model.name}]`,
      )
      .join('\n    ')}
  }

  type Mutation {
    ${models
      .map(
        (model) =>
          `edit${model.pascalPlural}(incoming: [${model.name}Input], deleting: Boolean): [${model.name}]`,
      )
      .join('\n    ')}
  }
\`;
`,
    ts: `import { gql } from 'apollo-server-core'
import * as queries from './queries'
import * as mutations from './mutations'

export const typeDefs = gql\`
  \${queries}
  \${mutations}

${schema.hasJson ? 'scalar JSON\n' : ''}${
      schema.hasDate ? '  scalar DateTime\n' : ''
    }
  type Query {
    ${models
      .map(
        ({ camel, camelPlural, pascal }) =>
          `${camel}: ${pascal}\n    ${camelPlural}: [${pascal}]`,
      )
      .join('\n    ')}
  }

  type Mutation {
    ${models
      .map(
        ({ pascal, pascalPlural }) =>
          `edit${pascalPlural}(incoming: [${pascal}Input], deleting: Boolean): [${pascal}]`,
      )
      .join('\n    ')}
  }
\`
`,
  }[ext]
}
