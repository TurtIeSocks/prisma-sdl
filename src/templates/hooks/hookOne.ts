import type { Model, Extension } from '../../assets/types'

export function hookOne(model: Model, ext: Extension): string {
  return {
    'd.ts': `import type { QueryHookOptions, QueryResult } from '@apollo/client'
import type { GqlQ${model.name}, Gql${model.name}Var } from '../../../types'
export declare function use${model.name}(
  options: QueryHookOptions<GqlQ${model.name}, Gql${model.name}Var>,
): QueryResult<GqlQ${model.name}, Gql${model.name}Var>
`,
    js: `import { useQuery } from '@apollo/client'
import { ${model.screamingSnake} } from '../../queryOne'
export function use${model.name}(options) {
  return useQuery(${model.screamingSnake}, options)
}
`,
    ts: `import { useQuery } from '@apollo/client'
import type { QueryHookOptions, QueryResult } from '@apollo/client'

import type { GqlQ${model.name}, Gql${model.name}Var } from '../../../types'
import { ${model.screamingSnake} } from '../../queryOne'

export function use${model.name}(
  options: QueryHookOptions<GqlQ${model.name}, Gql${model.name}Var>,
): QueryResult<GqlQ${model.name}, Gql${model.name}Var> {
  return useQuery<GqlQ${model.name}, Gql${model.name}Var>(${model.screamingSnake}, options)
}
`,
  }[ext]
}
