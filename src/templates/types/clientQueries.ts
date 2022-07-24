import type { Model, Schema, Extension } from '../../assets/types'

export function clientQueries(
  schema: Schema,
  model: Model,
  ext: Extension,
): string {
  return {
    'd.ts': `import type { ${model.name} as ${schema.pascal}${model.name} } from '@prisma/client/rdt';
import type { GqlTypename, GqlQuery } from './utilities';

export declare type Gql${model.name} = GqlTypename<${schema.pascal}${model.name}, '${model.camelPlural}'>;
export declare type Gql${model.name}Var = {
  ${model.pKey}: ${model.pType};
};
export declare type GqlQ${model.name} = GqlQuery<Gql${model.name}, 'category'>;
export declare type GqlQ${model.namePlural} = GqlQuery<Gql${model.name}, '${model.camelPlural}'>;
export declare type GqlM${model.namePlural} = GqlQuery<${schema.pascal}${model.name}, 'edit${model.namePlural}'>;
export { ${schema.pascal}${model.name} };  
`,
    js: `export {};\n`,
    ts: `// ==============================================================
// ${model.namePlural}
// ==============================================================
import type { ${model.name} as ${schema.pascal}${model.name} } from '${schema.output}'
import type { GqlTypename, GqlQuery } from './utilities'

export type Gql${model.name} = GqlTypename<${schema.pascal}${model.name}, '${model.camelPlural}'>

export type Gql${model.name}Var = { ${model.pKey}: ${model.pType} }

// ${model.screamingSnake}
export type GqlQ${model.name} = GqlQuery<Gql${model.name}, '${model.camel}'>

// ${model.screamingSnakePlural}
export type GqlQ${model.namePlural} = GqlQuery<Gql${model.name}, '${model.camelPlural}'>

// EDIT_${model.screamingSnakePlural}
export type GqlM${model.namePlural} = GqlQuery<${schema.pascal}${model.name}, 'edit${model.pascalPlural}'>

export { ${schema.pascal}${model.name} }
`,
  }[ext]
}
