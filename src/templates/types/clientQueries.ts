import type { Extension } from '../../assets/types'

export function clientQueries(ext: Extension): string {
  return {
    'd.ts': `import type { {{model_name}} as {{schema_pascal}}{{model_name}} } from '{{schema_output}}';
import type { GqlTypename, GqlQuery } from './utilities';

export declare type Gql{{model_name}} = GqlTypename<{{schema_pascal}}{{model_name}}, '{{model_camelPlural}}'>;
export declare type Gql{{model_name}}Var = {
  {{model_pKey}}: {{model_pType}};
};
export declare type GqlQ{{model_name}} = GqlQuery<Gql{{model_name}}, 'category'>;
export declare type GqlQ{{model_namePlural}} = GqlQuery<Gql{{model_name}}, '{{model_camelPlural}}'>;
export declare type GqlM{{model_namePlural}} = GqlQuery<{{schema_pascal}}{{model_name}}, 'edit{{model_namePlural}}'>;
export { {{schema_pascal}}{{model_name}} };  
`,
    js: `export {};\n`,
    ts: `// ==============================================================
// {{model_namePlural}}
// ==============================================================
import type { {{model_name}} as {{schema_pascal}}{{model_name}} } from '{{schema_output}}'
import type { GqlTypename, GqlQuery } from './utilities'

export type Gql{{model_name}} = GqlTypename<{{schema_pascal}}{{model_name}}, '{{model_camelPlural}}'>

export type Gql{{model_name}}Var = { {{model_pKey}}: {{model_pType}} }

// {{model_screamingSnake}}
export type GqlQ{{model_name}} = GqlQuery<Gql{{model_name}}, '{{model_camel}}'>

// {{model_screamingSnakePlural}}
export type GqlQ{{model_namePlural}} = GqlQuery<Gql{{model_name}}, '{{model_camelPlural}}'>

// EDIT_{{model_screamingSnakePlural}}
export type GqlM{{model_namePlural}} = GqlQuery<{{schema_pascal}}{{model_name}}, 'edit{{model_pascalPlural}}'>

export { {{schema_pascal}}{{model_name}} }
`,
  }[ext]
}
