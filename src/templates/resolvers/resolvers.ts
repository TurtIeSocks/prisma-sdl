import { ES5_BINDING, ES5_IMPORT, ES5_SET_DEFAULT, ES5_MODULE } from '../../assets/constants'
import type { ModelTemplate, Schema, Extension } from '../../assets/types'

export function allResolvers(schema: Schema, models: ModelTemplate[], singleMode: boolean, ext: Extension): string {
  const context = singleMode ? 'prisma' : `${schema.camel}Client: prisma`

  return {
    'd.ts': `export declare const resolvers: {
  ${schema.hasJson ? `JSON: import("graphql").GraphQLScalarType<unknown, unknown>;` : ''}
  ${schema.hasDate ? `DateTime: import("graphql").GraphQLScalarType<unknown, unknown>;` : ''}
  Query: {
    ${models
      .map(
        (
          model,
        ) => `${model.camelPlural}: (_parent: unknown, _args: unknown, { ${context} }: import("..").Context) => Promise<import("${schema.output}").${model.name}[]>;
    ${model.camel}: (_parent: unknown, { ${model.pKey} }: { ${model.pKey}: ${model.pType}; }, { ${context} }: import("..").Context) => Promise<import("${schema.output}").${model.name} | null>;
`,
      )
      .join('      ')}  
  },
  Mutation: {
    ${models
      .map(
        (model) => `${model.camelPlural}: (_parent: unknown, { incoming, deleting }: {
      incoming: import("${schema.output}").${model.name}[]; 
      deleting: boolean; 
    }, { ${context} }: import("..").Context) => Promise<import("${schema.output}").${model.name}[] | Pick<import("${schema.output}").${model.name}, "${model.pKey}">[]>;`,
      )
      .join('\n      ')}
  }
};
`,
    js: `"use strict";
${ES5_BINDING}
${ES5_SET_DEFAULT}
${ES5_IMPORT}
${ES5_MODULE}
exports.resolvers = void 0;
${schema.hasJson || schema.hasDate ? 'const graphql_scalars_1 = require("graphql-scalars");' : ''}
const queryOne = __importStar(require("./queryOne"));
const queryAll = __importStar(require("./queryAll"));
const Mutation = __importStar(require("./mutations"));
exports.resolvers = {
    ${schema.hasJson ? 'JSON: graphql_scalars_1.GraphQLJSON,' : ''}
    ${schema.hasDate ? 'Date: graphql_scalars_1.GraphQLDateTime,' : ''}
    Query: {
      ...queryOne,
      ...queryAll,
    },
    Mutation,
};
`,
    ts: `${
      schema.hasDate || schema.hasJson
        ? `import { ${schema.hasDate ? 'GraphQLDateTime' : ''}${schema.hasDate && schema.hasJson ? ',' : ''}${
            schema.hasJson ? ' GraphQLJSON' : ''
          } } from 'graphql-scalars'`
        : ''
    }
import * as queryOne from './queryOne'
import * as queryAll from './queryAll'
import * as mutations from './mutations'

export const resolvers = {
  ${schema.hasJson ? 'JSON: GraphQLJSON,\n' : ''}${schema.hasDate ? '  DateTime: GraphQLDateTime,\n' : ''}  Query: {
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
