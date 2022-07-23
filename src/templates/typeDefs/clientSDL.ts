import type { Model, Extension } from '../../assets/types'

export function clientSDL(model: Model, mutation: boolean, all: boolean, ext: Extension): string {
  const props = model.properties.map((x) => x.name).join('\n      ')
  const tsJs = `import { gql } from '@apollo/client'
${
  mutation
    ? `export const EDIT_${model.screamingSnakePlural} = gql\`
  mutation Edit${model.pascalPlural}($incoming: [Edit${model.pascal}], $deleting: Boolean) {
    edit${model.pascalPlural}(incoming: $incoming, deleting: $deleting) {
      ${props}
    }
  }
\``
    : all
    ? `export const ${model.screamingSnakePlural} = gql\`
  query ${model.camelPlural} {
    ${model.camelPlural} {
      ${props}
    }
  }
\`
`
    : `export const ${model.screamingSnake} = gql\`
  query ${model.camel}($${model.pKey}: ${model.pGqlType}) {
    ${model.camel}(${model.pKey}: $${model.pKey}) {
      ${props}
    }
  }
\`
`
}`
  return {
    'd.ts': `export declare const ${
      mutation ? `EDIT_${model.screamingSnakePlural}` : all ? model.screamingSnakePlural : model.screamingSnake
    }: import("@apollo/client").DocumentNode;`,
    js: tsJs,
    ts: tsJs,
  }[ext]
}
