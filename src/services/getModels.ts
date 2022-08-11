import { VALID_TYPES } from '../assets/constants'
import type {
  Extension,
  Model,
  ModelTemplate,
  Schema,
  TemplateObj,
  ValidType,
} from '../assets/types'
import { hookAll } from '../templates/hooks/hookAll'
import { hookMut } from '../templates/hooks/hookMut'
import { hookOne } from '../templates/hooks/hookOne'
import { clientSDL } from '../templates/typeDefs/clientSDL'
import { mutation } from '../templates/resolvers/mutation'
import { queryAll } from '../templates/resolvers/queryAll'
import { queryOne } from '../templates/resolvers/queryOne'
import { serverSDL } from '../templates/typeDefs/serverSDL'
import { getConventions, getTsType } from './utils'
import { clientQueries } from '../templates/types/clientQueries'
import { templater } from './templater'

export function getModels(
  schema: Schema,
  singleMode: boolean,
  fileTypes: Extension[],
  customTemplates: TemplateObj,
): ModelTemplate[] {
  const models: ModelTemplate[] = (schema.schema.match(/.+{([^}]*)}/g) || [])
    .filter(
      (model) =>
        model.startsWith('model') && !model.split(' ')[1]?.endsWith('s'),
    )
    .map((model) => model.replace(/{|}/g, ''))
    .map((model) => {
      const [name, ...rest] = model
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !/^[A-Z]/.test(line) && !/^@@/.test(line))

      const [type, key] = name ? name.split(' ') : []

      const [pKey, pType] = (rest.find((line) => line.includes('@id')) || 'id')
        .split(' ')
        .map((line) => line.trim())
        .filter((line) => line)

      const cleanModel: Model = {
        ...getConventions(key!.trim()),
        pKey: pKey!.trim(),
        pType: getTsType(pType!.trim()),
        pGqlType: pType!.trim(),
        type: type!.trim() as 'model' | 'enum',
        properties: rest
          .map((prop) => {
            const [propName, propType, details] = prop
              .split(' ')
              .filter((word) => word.trim())
            if (propName && propType) {
              const jsonCheck = propType.includes('Json') ? 'JSON' : propType
              return {
                name: propName,
                type: (VALID_TYPES.includes(
                  jsonCheck as typeof VALID_TYPES[number],
                )
                  ? jsonCheck.replace(/\?/g, '')
                  : '') as ValidType,
                optional: propType.includes('?'),
                auto: details
                  ? details.includes('now()') || details.includes('@updatedAt')
                  : false,
              }
            }
            return {
              name: '',
              type: '' as ValidType,
              optional: false,
              auto: false,
            }
          })
          .filter((prop) => prop.type),
      }
      return {
        ...cleanModel,
        templates: {
          serverQueryAll: {
            fileName: cleanModel.camelPlural,
            location: 'server/resolvers/queryAll',
            ...Object.fromEntries(
              fileTypes.map((ext) => [
                ext,
                templater(
                  customTemplates?.serverQueryAll?.[ext] || queryAll(ext),
                  schema,
                  singleMode,
                  [],
                  cleanModel,
                ),
              ]),
            ),
          },
          serverQueryOne: {
            fileName: cleanModel.camel,
            location: 'server/resolvers/queryOne',
            ...Object.fromEntries(
              fileTypes.map((ext) => [
                ext,
                templater(
                  customTemplates?.serverQueryOne?.[ext] || queryOne(ext),
                  schema,
                  singleMode,
                  [],
                  cleanModel,
                ),
              ]),
            ),
          },
          serverMut: {
            fileName: `edit${cleanModel.pascalPlural}`,
            location: 'server/resolvers/mutations',
            ...Object.fromEntries(
              fileTypes.map((ext) => [
                ext,
                templater(
                  customTemplates?.serverMut?.[ext] || mutation(ext),
                  schema,
                  singleMode,
                  [],
                  cleanModel,
                ),
              ]),
            ),
          },
          serverTdQueries: {
            fileName: cleanModel.screamingSnake,
            location: 'server/typeDefs/queries',
            ...Object.fromEntries(
              fileTypes.map((ext) => [
                ext,
                templater(
                  customTemplates?.serverTdQueries?.[ext] ||
                    serverSDL(cleanModel, false, ext),
                  schema,
                  singleMode,
                  [],
                  cleanModel,
                ),
              ]),
            ),
          },
          serverTdMut: {
            fileName: `${cleanModel.screamingSnake}_INPUT`,
            location: 'server/typeDefs/mutations',
            ...Object.fromEntries(
              fileTypes.map((ext) => [
                ext,
                templater(
                  customTemplates?.serverTdMut?.[ext] ||
                    serverSDL(cleanModel, true, ext),
                  schema,
                  singleMode,
                  [],
                  cleanModel,
                ),
              ]),
            ),
          },
          clientQueryAll: {
            fileName: cleanModel.screamingSnakePlural,
            location: 'client/queryAll',
            ...Object.fromEntries(
              fileTypes.map((ext) => [
                ext,
                templater(
                  customTemplates?.clientQueryAll?.[ext] ||
                    clientSDL(false, true, ext),
                  schema,
                  singleMode,
                  [],
                  cleanModel,
                ),
              ]),
            ),
          },
          clientQueryOne: {
            fileName: cleanModel.screamingSnake,
            location: 'client/queryOne',
            ...Object.fromEntries(
              fileTypes.map((ext) => [
                ext,
                templater(
                  customTemplates?.clientQueryOne?.[ext] ||
                    clientSDL(false, false, ext),
                  schema,
                  singleMode,
                  [],
                  cleanModel,
                ),
              ]),
            ),
          },
          clientMut: {
            fileName: `EDIT_${cleanModel.screamingSnakePlural}`,
            location: 'client/mutations',
            ...Object.fromEntries(
              fileTypes.map((ext) => [
                ext,
                templater(
                  customTemplates?.clientMut?.[ext] ||
                    clientSDL(true, false, ext),
                  schema,
                  singleMode,
                  [],
                  cleanModel,
                ),
              ]),
            ),
          },
          hookAll: {
            fileName: `use${cleanModel.pascalPlural}`,
            location: 'client/hooks/queryAll',
            ...Object.fromEntries(
              fileTypes.map((ext) => [
                ext,
                templater(
                  customTemplates?.hookAll?.[ext] || hookAll(ext),
                  schema,
                  singleMode,
                  [],
                  cleanModel,
                ),
              ]),
            ),
          },
          hookOne: {
            fileName: `use${cleanModel.pascal}`,
            location: 'client/hooks/queryOne',
            ...Object.fromEntries(
              fileTypes.map((ext) => [
                ext,
                templater(
                  customTemplates?.hookOne?.[ext] || hookOne(ext),
                  schema,
                  singleMode,
                  [],
                  cleanModel,
                ),
              ]),
            ),
          },
          hookMut: {
            fileName: `useEdit${cleanModel.pascalPlural}`,
            location: 'client/hooks/mutations',
            ...Object.fromEntries(
              fileTypes.map((ext) => [
                ext,
                templater(
                  customTemplates?.hookMut?.[ext] || hookMut(ext),
                  schema,
                  singleMode,
                  [],
                  cleanModel,
                ),
              ]),
            ),
          },
          tsTypes: {
            fileName: cleanModel.camelPlural,
            location: 'types',
            ...Object.fromEntries(
              fileTypes.map((ext) => [
                ext,
                templater(
                  customTemplates?.tsTypes?.[ext] || clientQueries(ext),
                  schema,
                  singleMode,
                  [],
                  cleanModel,
                ),
              ]),
            ),
          },
        },
      }
    })
    .filter(Boolean)
  return models.sort((a, b) => a.name.localeCompare(b.name))
}
