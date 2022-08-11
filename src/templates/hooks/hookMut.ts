import type { Extension } from '../../assets/types'

export function hookMut(ext: Extension): string {
  return {
    'd.ts': `import type {
  MutationHookOptions,
  MutationTuple,
  DefaultContext,
  ApolloCache,
} from '@apollo/client'
import type { GqlQ{{model_namePlural}}, GqlM{{model_namePlural}} } from '../../../types'

export declare function useEdit{{model_namePlural}}(
  options: MutationHookOptions<GqlQ{{model_namePlural}}, GqlM{{model_namePlural}}>,
): MutationTuple<GqlQ{{model_namePlural}}, GqlM{{model_namePlural}}, DefaultContext, ApolloCache<any>>
`,
    js: `import { useMutation } from '@apollo/client'
import { EDIT_{{model_screamingSnakePlural}} } from '../../mutations'

export function useEdit{{model_namePlural}}(options) {
  return useMutation(EDIT_{{model_screamingSnakePlural}}, options)
}
`,
    ts: `import { useMutation } from '@apollo/client'
import type { MutationHookOptions, MutationTuple, DefaultContext, ApolloCache } from '@apollo/client'

import type { GqlQ{{model_pascalPlural}}, GqlM{{model_pascalPlural}} } from '../../../types'
import { EDIT_{{model_screamingSnakePlural}} } from '../../mutations'

export function useEdit{{model_pascalPlural}}(
  options: MutationHookOptions<GqlQ{{model_pascalPlural}}, GqlM{{model_pascalPlural}}>,
): MutationTuple<GqlQ{{model_pascalPlural}}, GqlM{{model_pascalPlural}}, DefaultContext, ApolloCache<any>> { 
  return useMutation<GqlQ{{model_pascalPlural}}, GqlM{{model_pascalPlural}}>(EDIT_{{model_screamingSnakePlural}}, options)
} 
`,
  }[ext]
}
