import type { Model, Extension } from '../../assets/types'

export function hookOne(model: Model, ext: Extension): string {
  return {
    'd.ts': `import type { QueryHookOptions } from '@apollo/client';
import type { GqlQ${model.name}, Gql${model.name}Var } from '../../../types'
export declare const use${model.pascal}: (
  options: QueryHookOptions<GqlQ${model.pascal}, Gql${model.name}Var>,
) => import("@apollo/client").QueryResult<GqlQ${model.pascal}, Gql${model.name}Var>;
  `,
    js: `import { useQuery } from '@apollo/client';
import { ${model.screamingSnake} } from '../../queryOne';
export const use${model.pascal} = (options) => useQuery(${model.screamingSnake}, options);
  `,
    ts: `import { useQuery } from '@apollo/client'
import type { QueryHookOptions } from '@apollo/client'

import type { GqlQ${model.pascal}, Gql${model.pascal}Var } from '../../../types'
import { ${model.screamingSnake} } from '../../queryOne'

export const use${model.pascal} = (
  options: QueryHookOptions<GqlQ${model.pascal}, Gql${model.pascal}Var>,
) => useQuery<GqlQ${model.pascal}, Gql${model.pascal}Var>(${model.screamingSnake}, options)
`,
  }[ext]
}
