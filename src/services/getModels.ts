import { VALID_TYPES } from '../assets/constants'
import type {
  Extension,
  Model,
  ModelTemplate,
  Options,
  Schema,
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
import { clientQueries } from '../templates/types/clientQueries'
import { restExpress } from '../templates/rest/express'
import { getConventions, getTsType } from './utils'
import { templater } from './templater'

export function getModels(
  schema: Schema,
  singleMode: boolean,
  fileTypes: Extension[],
  customTemplates: Options['customTemplates'],
  extraTemplates: Options['extraTemplates'],
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
              const jsonCheck = propType.includes('Json') ? 'JSON' : propType.replace(/\?/g, '')
              return {
                name: propName,
                type: (VALID_TYPES.includes(
                  jsonCheck as typeof VALID_TYPES[number],
                )
                  ? jsonCheck
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
            fileName: templater(
              customTemplates?.serverQueryAll?.fileName ||
                cleanModel.camelPlural,
              schema,
              singleMode,
              [],
              cleanModel,
            ),
            location:
              customTemplates?.serverQueryAll?.location ||
              'server/resolvers/queryAll',
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
            fileName: templater(
              customTemplates?.serverQueryOne?.fileName || cleanModel.camel,
              schema,
              singleMode,
              [],
              cleanModel,
            ),
            location:
              customTemplates?.serverQueryOne?.location ||
              'server/resolvers/queryOne',
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
            fileName: templater(
              customTemplates?.serverMut?.fileName ||
                `edit${cleanModel.pascalPlural}`,
              schema,
              singleMode,
              [],
              cleanModel,
            ),
            location:
              customTemplates?.serverMut?.location ||
              'server/resolvers/mutations',
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
            fileName: templater(
              customTemplates?.serverTdQueries?.fileName ||
                cleanModel.screamingSnake,
              schema,
              singleMode,
              [],
              cleanModel,
            ),
            location:
              customTemplates?.serverTdQueries?.location ||
              'server/typeDefs/queries',
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
            fileName: templater(
              customTemplates?.serverTdMut?.fileName ||
                `${cleanModel.screamingSnake}_INPUT`,
              schema,
              singleMode,
              [],
              cleanModel,
            ),
            location:
              customTemplates?.serverTdMut?.location ||
              'server/typeDefs/mutations',
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
            fileName: templater(
              customTemplates?.clientQueryAll?.fileName ||
                cleanModel.screamingSnakePlural,
              schema,
              singleMode,
              [],
              cleanModel,
            ),
            location:
              customTemplates?.clientQueryAll?.location || 'client/queryAll',
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
            fileName: templater(
              customTemplates?.clientQueryOne?.fileName ||
                cleanModel.screamingSnake,
              schema,
              singleMode,
              [],
              cleanModel,
            ),
            location:
              customTemplates?.clientQueryOne?.location || 'client/queryOne',
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
            fileName: templater(
              customTemplates?.clientMut?.fileName ||
                `EDIT_${cleanModel.screamingSnakePlural}`,
              schema,
              singleMode,
              [],
              cleanModel,
            ),
            location:
              customTemplates?.clientMut?.location || 'client/mutations',
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
            fileName: templater(
              customTemplates?.hookAll?.fileName ||
                `use${cleanModel.pascalPlural}`,
              schema,
              singleMode,
              [],
              cleanModel,
            ),
            location:
              customTemplates?.hookAll?.location || 'client/hooks/queryAll',
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
            fileName: templater(
              customTemplates?.hookOne?.fileName || `use${cleanModel.pascal}`,
              schema,
              singleMode,
              [],
              cleanModel,
            ),
            location:
              customTemplates?.hookOne?.location || 'client/hooks/queryOne',
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
            fileName: templater(
              customTemplates?.hookMut?.fileName ||
                `useEdit${cleanModel.pascalPlural}`,
              schema,
              singleMode,
              [],
              cleanModel,
            ),
            location:
              customTemplates?.hookMut?.location || 'client/hooks/mutations',
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
          restExpress: {
            fileName: templater(
              customTemplates?.restExpress?.fileName || cleanModel.camelPlural,
              schema,
              singleMode,
              [],
              cleanModel,
            ),
            location:
              customTemplates?.restExpress?.location || '/server/rest/express',
            ...Object.fromEntries(
              fileTypes.map((ext) => [
                ext,
                templater(
                  customTemplates?.restExpress?.[ext] || restExpress(ext),
                  schema,
                  singleMode,
                  [],
                  cleanModel,
                ),
              ]),
            ),
          },
          tsTypes: {
            fileName: templater(
              customTemplates?.tsTypes?.fileName || cleanModel.camelPlural,
              schema,
              singleMode,
              [],
              cleanModel,
            ),
            location: customTemplates?.tsTypes?.location || 'types',
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
          ...Object.fromEntries(
            (extraTemplates?.model || []).map((template, i) => [
              i,
              {
                ...template,
                location: template.location || 'custom',
                fileName: templater(
                  template?.fileName || `custom_${i}`,
                  schema,
                  singleMode,
                  [],
                  cleanModel,
                ),
              },
            ]),
          ),
        },
      }
    })
    .filter(Boolean)
  return models.sort((a, b) => a.name.localeCompare(b.name))
}
