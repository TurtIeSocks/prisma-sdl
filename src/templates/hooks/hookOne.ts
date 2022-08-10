import type { Extension } from '../../assets/types'

export function hookOne(ext: Extension): string {
  return {
    'd.ts': `import type { QueryHookOptions, QueryResult } from '@apollo/client'
import type { GqlQ{{model_name}}, Gql{{model_name}}Var } from '../../../types'

export declare function use{{model_name}}(
  options: QueryHookOptions<GqlQ{{model_name}}, Gql{{model_name}}Var>,
): QueryResult<GqlQ{{model_name}}, Gql{{model_name}}Var>
`,
    js: `import { useQuery } from '@apollo/client'
import { {{model_screamingSnake}} } from '../../queryOne'

export function use{{model_name}}(options) {
  return useQuery({{model_screamingSnake}}, options)
}
`,
    ts: `import { useQuery } from '@apollo/client'
import type { QueryHookOptions, QueryResult } from '@apollo/client'
import type { GqlQ{{model_name}}, Gql{{model_name}}Var } from '../../../types'
import { {{model_screamingSnake}} } from '../../queryOne'

export function use{{model_name}}(
  options: QueryHookOptions<GqlQ{{model_name}}, Gql{{model_name}}Var>,
): QueryResult<GqlQ{{model_name}}, Gql{{model_name}}Var> {
  return useQuery<GqlQ{{model_name}}, Gql{{model_name}}Var>({{model_screamingSnake}}, options)
}
`,
  }[ext]
}
