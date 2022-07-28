import type { Extension } from '../../assets/types'

export function hookAll(ext: Extension): string {
  return {
    'd.ts': `import type { QueryHookOptions, QueryResult } from '@apollo/client'
import type { GqlQ{{model_namePlural}} } from '../../../types'

export declare function use{{model_namePlural}}(
  options?: QueryHookOptions<GqlQ{{model_namePlural}}>,
): QueryResult<GqlQ{{model_namePlural}}>
`,
    js: `import { useQuery } from '@apollo/client'
import { {{model_screamingSnakePlural}} } from '../../queryAll'

export function use{{model_namePlural}}(options) {
  return useQuery({{model_screamingSnakePlural}}, options)
}
`,
    ts: `import { useQuery } from '@apollo/client'
import type { QueryHookOptions, QueryResult } from '@apollo/client'

import type { GqlQ{{model_namePlural}} } from '../../../types'
import { {{model_screamingSnakePlural}} } from '../../queryAll'

export function use{{model_namePlural}}(
  options?: QueryHookOptions<GqlQ{{model_namePlural}}>,
): QueryResult<GqlQ{{model_namePlural}}> {
  return useQuery<GqlQ{{model_namePlural}}>({{model_screamingSnakePlural}}, options)
}
`,
  }[ext]
}
