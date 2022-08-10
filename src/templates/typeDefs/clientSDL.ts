import type { Extension } from '../../assets/types'

export function clientSDL(
  mutation: boolean,
  all: boolean,
  ext: Extension,
): string {
  const tsJs = `import { gql } from '@apollo/client'
${
  mutation
    ? `export const EDIT_{{model_screamingSnakePlural}} = gql\`
  mutation Edit{{model_pascalPlural}}($incoming: [Edit{{model_pascal}}], $deleting: Boolean) {
    edit{{model_pascalPlural}}(incoming: $incoming, deleting: $deleting) {
      {{model_props}}
    }
  }
\`
`
    : all
    ? `export const {{model_screamingSnakePlural}} = gql\`
  query {{model_camelPlural}} {
    {{model_camelPlural}} {
      {{model_props}}
    }
  }
\`
`
    : `export const {{model_screamingSnake}} = gql\`
  query {{model_camel}}({{model_pKey}}: {{model_pGqlType}}) {
    {{model_camel}}({{model_pKey}}: {{model_pKey}}) {
      {{model_props}}
    }
  }
\`
`
}`
  return {
    'd.ts': `export declare const ${
      mutation
        ? `EDIT_{{model_screamingSnakePlural}}`
        : all
        ? '{{model_screamingSnakePlural}}'
        : '{{model_screamingSnake}}'
    }: import("@apollo/client").DocumentNode;`,
    js: tsJs,
    ts: tsJs,
  }[ext]
}
