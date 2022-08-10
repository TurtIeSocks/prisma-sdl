import type { Extension } from '../../assets/types'

export function allTypeDefs(ext: Extension): string {
  return {
    'd.ts': `export declare const typeDefs: import("graphql").DocumentNode;\n`,
    js: `"use strict";
{{es5_binding}}
{{es5_set_default}}
{{es5_import}}
{{es5_module}}
exports.typeDefs = void 0;
const apollo_server_core_1 = require("apollo-server-core");
const queries = __importStar(require("./queries"));
const mutations = __importStar(require("./mutations"));
exports.typeDefs = (0, apollo_server_core_1.gql) \`
  \${queries}
  \${mutations}

  {{typeDefs_json_scalar}}
  {{typeDefs_date_scalar}}

  type Query {
    {{typeDefs_type_query}}
  }

  type Mutation {
    {{typeDefs_type_mutation}}
  }
\`;
`,
    ts: `import { gql } from 'apollo-server-core'
import * as queries from './queries'
import * as mutations from './mutations'

export const typeDefs = gql\`
  \${queries}
  \${mutations}

  {{typeDefs_json_scalar}}
  {{typeDefs_date_scalar}}
  type Query {
    {{typeDefs_type_query}}
  }

  type Mutation {
    {{typeDefs_type_mutation}}
  }
\`
`,
  }[ext]
}
