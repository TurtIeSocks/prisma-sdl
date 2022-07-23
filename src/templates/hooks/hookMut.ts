import type { Model, Extension } from '../../assets/types'

export function hookMut(model: Model, ext: Extension): string {
  return {
    'd.ts': `import type { MutationHookOptions } from '@apollo/client'
import type { GqlQ${model.pascalPlural}, GqlM${model.pascalPlural} } from '../../../types'
export declare const useEdit${model.pascalPlural}: (
  options: MutationHookOptions<GqlQ${model.pascalPlural}, GqlM${model.pascalPlural}>,
) => import('@apollo/client').MutationTuple<
  GqlQ${model.pascalPlural},
  GqlM${model.pascalPlural},
  import('@apollo/client').DefaultContext,
  import('@apollo/client').ApolloCache<any>
>
`,
    js: `import { useMutation } from '@apollo/client';
import { EDIT_${model.screamingSnakePlural} } from '../../mutations';
export const use${model.pascalPlural} = (options) => useMutation(EDIT_${model.screamingSnakePlural}, options);
`,
    ts: `import { useMutation } from '@apollo/client'
import type { MutationHookOptions } from '@apollo/client'

import type { GqlQ${model.pascalPlural}, GqlM${model.pascalPlural} } from '../../../types'
import { EDIT_${model.screamingSnakePlural} } from '../../mutations'

export const useEdit${model.pascalPlural} = (
  options: MutationHookOptions<GqlQ${model.pascalPlural}, GqlM${model.pascalPlural}>,
) => useMutation<GqlQ${model.pascalPlural}, GqlM${model.pascalPlural}>(EDIT_${model.screamingSnakePlural}, options)
`,
  }[ext]
}
