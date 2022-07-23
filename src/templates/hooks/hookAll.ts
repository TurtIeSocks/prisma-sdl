import type { Model, Extension } from '../../assets/types'

export function hookAll(model: Model, ext: Extension): string {
  return {
    'd.ts': `import type { QueryHookOptions } from '@apollo/client';
import type { GqlQ${model.pascalPlural} } from '../../../types'
export declare const use${model.pascalPlural}: (
  options?: QueryHookOptions<GqlQ${model.pascalPlural}>,
) => import("@apollo/client").QueryResult<
  GqlQ${model.pascalPlural},
  import("@apollo/client").OperationVariables
>;
`,
    js: `import { useQuery } from '@apollo/client';
import { ${model.screamingSnakePlural} } from '../../queryAll';
export const use${model.pascalPlural} = (options) => useQuery(${model.screamingSnakePlural}, options);
`,
    ts: `import { useQuery } from '@apollo/client'
import type { QueryHookOptions } from '@apollo/client'

import type { GqlQ${model.pascalPlural} } from '../../../types'
import { ${model.screamingSnakePlural} } from '../../queryAll'

export const use${model.pascalPlural} = (options?: QueryHookOptions<GqlQ${model.pascalPlural}>) =>
  useQuery<GqlQ${model.pascalPlural}>(${model.screamingSnakePlural}, options)
`,
  }[ext]
}
