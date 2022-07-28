import type { Extension } from '../../assets/types'

export function allResolvers(ext: Extension): string {
  return {
    'd.ts': `export declare const resolvers: {

  {{resolvers_has_json_dts}}
  {{resolvers_has_date_dts}}
  Query: {
    {{resolvers_type_query}}
  },
  Mutation: {
    {{resolvers_type_mutation}}
  }
};
`,
    js: `"use strict";
{{es5_binding}}
{{es5_set_default}}
{{es5_import}}
{{es5_module}}
exports.resolvers = void 0;
{{resolvers_scalar_import_js}}
const queryOne = __importStar(require("./queryOne"));
const queryAll = __importStar(require("./queryAll"));
const Mutation = __importStar(require("./mutations"));
exports.resolvers = {
    {{resolvers_has_json_js}}
    {{resolvers_has_date_js}}
    Query: {
      ...queryOne,
      ...queryAll,
    },
    Mutation,
};
`,
    ts: `{{resolvers_scalar_import_ts}}
import * as queryOne from './queryOne'
import * as queryAll from './queryAll'
import * as mutations from './mutations'

export const resolvers = {
  {{resolvers_has_json_ts}}
  {{resolvers_has_date_ts}}
  Query: {
    ...queryOne,
    ...queryAll,
  },
  Mutation: {
    ...mutations,
  },
}
`,
  }[ext]
}
