import {
  KEYS,
  SCHEMA_KEYS,
  MODEL_KEYS,
  ES5_MODULE,
  ES5_BINDING,
  ES5_IMPORT,
  ES5_EXPORT,
  ES5_SET_DEFAULT,
} from '../assets/constants'
import type { Model, ModelTemplate, Schema } from '../assets/types'
import { getTsType } from './utils'

export function templater(
  template: string,
  schema: Schema,
  singleMode = false,
  models: ModelTemplate[] = [],
  model?: Model,
): string {
  let result = template
  const dynRegexes = {
    model: model
      ? {
          props: model.properties.map((x) => x.name).join('\n      '),
          autos: model.properties.filter((prop) => prop.auto).length
            ? `${model.properties
                .filter((prop) => prop.auto)
                .map((x) => x.name)
                .join(', ')}, `
            : '',
          td_props: model.properties
            .map((x) => `${x.name}: ${x.type}`)
            .join('\n    '),
          json_safe_import: model.properties.some(
            (prop) => prop.type === 'JSON',
          )
            ? ', JsonSafe'
            : '',
          json_props: model.properties.some((prop) => prop.type === 'JSON')
            ? `JsonSafe<${schema.pascal}${model.pascal}, ${model.properties
                .filter((x) => x.type === 'JSON')
                .map((x) => `'${x.name}'`)
                .join(' | ')}>`
            : `${schema.pascal}${model.pascal}`,
          rest_select: model.properties
            .map(
              (x) =>
                `${x.name}: '${x.name}' in req.query && !req.query.${x.name},`,
            )
            .join('\n                '),
          rest_where: model.properties
            .filter((x) => !x.auto)
            .map((x) => {
              const type = getTsType(x.type, true)
              return `${x.name}: 
                req.query?.${x.name} && ${
                type === 'number'
                  ? `+req.query.${x.name}`
                  : `typeof req.query.${x.name} === '${type}'`
              }
                  ? { equals: ${type === 'number' ? '+' : ''}req.query.${
                x.name
              } }
                  : undefined,`
            })
            .join('\n                '),
        }
      : {},
    context: {
      import_statement: singleMode
        ? 'PrismaClient'
        : `PrismaClient as ${schema.pascal}Client`,
      context: singleMode ? 'prisma' : `${schema.camel}Client`,
      context_pascal: singleMode ? 'prisma' : `${schema.pascal}Client`,
    },
    typeDefs: {
      json_scalar: schema.hasJson ? 'scalar JSON' : '',
      date_scalar: schema.hasDate ? 'scalar DateTime' : '',
      type_query: models
        .map(
          ({ name, camel, camelPlural, pKey, pType }) =>
            `${camel}(${pKey}: ${pType}): ${name}\n    ${camelPlural}: [${name}]`,
        )
        .join('\n    '),
      type_mutation: models
        .map(
          ({ name, pascalPlural }) =>
            `edit${pascalPlural}(incoming: [${name}Input], deleting: Boolean): [${name}]`,
        )
        .join('\n    '),
    },
    resolvers: {
      context: singleMode ? 'prisma' : `${schema.camel}Client: prisma`,
      scalar_import_ts:
        schema.hasDate || schema.hasJson
          ? `import { ${schema.hasDate ? 'GraphQLDateTime' : ''}${
              schema.hasDate && schema.hasJson ? ',' : ''
            }${schema.hasJson ? ' GraphQLJSON' : ''} } from 'graphql-scalars'`
          : '',
      scalar_import_js:
        schema.hasJson || schema.hasDate
          ? 'const graphql_scalars_1 = require("graphql-scalars");'
          : '',
      has_json_dts: schema.hasJson
        ? `JSON: import("graphql").GraphQLScalarType<unknown, unknown>;`
        : '',
      has_json_js: schema.hasJson ? 'JSON: graphql_scalars_1.GraphQLJSON,' : '',
      has_json_ts: schema.hasJson ? 'JSON: GraphQLJSON,' : '',
      has_date_ts: schema.hasDate ? 'DateTime: GraphQLDateTime,' : '',
      has_date_js: schema.hasDate
        ? 'Date: graphql_scalars_1.GraphQLDateTime,'
        : '',
      has_date_dts: schema.hasDate
        ? `DateTime: import("graphql").GraphQLScalarType<unknown, unknown>;`
        : '',
      type_query: models
        .map(
          (model) => `${
            model.camelPlural
          }: (_parent: unknown, _args: unknown, { ${
            singleMode ? 'prisma' : `${schema.camel}Client`
          } }: import("..").Context) => Promise<import("${schema.output}").${
            model.name
          }[]>;
          ${model.camel}: (_parent: unknown, { ${model.pKey} }: { ${
            model.pKey
          }: ${model.pType}; }, { ${
            singleMode ? 'prisma' : `${schema.camel}Client`
          } }: import("..").Context) => Promise<import("${schema.output}").${
            model.name
          } | null>;
      `,
        )
        .join('      '),
      type_mutation: models
        .map(
          (model) => `${
            model.camelPlural
          }: (_parent: unknown, { incoming, deleting }: {
      incoming: import("${schema.output}").${model.name}[]; 
      deleting: boolean; 
    }, { ${
      singleMode ? 'prisma' : `${schema.camel}Client`
    } }: import("..").Context) => Promise<import("${schema.output}").${
            model.name
          }[] | Pick<import("${schema.output}").${model.name}, "${
            model.pKey
          }">[]>;`,
        )
        .join('\n      '),
    },
  }

  KEYS.forEach((key) => {
    if (model) {
      result = result.replace(new RegExp(`{{model_${key}}}`, 'g'), model[key])
    }
    result = result.replace(new RegExp(`{{schema_${key}}}`, 'g'), schema[key])
  })
  SCHEMA_KEYS.forEach((key) => {
    result = result.replace(
      new RegExp(`{{schema_${key}}}`, 'g'),
      schema[key].toString(),
    )
  })
  if (model) {
    MODEL_KEYS.forEach((key) => {
      result = result.replace(
        new RegExp(`{{model_${key}}}`, 'g'),
        model[key].toString(),
      )
    })
  }
  Object.entries(dynRegexes).forEach(([key, value]) => {
    Object.entries(value).forEach(([subKey, subValue]) => {
      result = result.replace(new RegExp(`{{${key}_${subKey}}}`, 'g'), subValue)
    })
  })
  return result
    .replace(/{{es5_module}}/g, ES5_MODULE)
    .replace(/{{es5_binding}}/g, ES5_BINDING)
    .replace(/{{es5_import}}/g, ES5_IMPORT)
    .replace(/{{es5_export}}/g, ES5_EXPORT)
    .replace(/{{es5_set_default}}/g, ES5_SET_DEFAULT)
}
