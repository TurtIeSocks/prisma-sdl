import ts from 'typescript'
import { SafeOptions } from '../assets/types'
import { writeSafe } from './writeSafe'

export function compiler(
  fileNames: string[],
  loc: string,
  options: SafeOptions,
): void {
  console.time(`Compiling TypeScript for ${loc}`)
  const isServer = loc.includes('server')
  const fileTypeObj = Object.fromEntries(
    options.fileTypes.map((ext) => [ext, true]),
  )
  const createdFiles: { [key: string]: string } = {}

  const configPath = isServer
    ? ts.findConfigFile(options.root, ts.sys.fileExists, options.tscServer)
    : ts.findConfigFile(options.root, ts.sys.fileExists, options.tscClient)

  const tsconfig: ts.CompilerOptions = configPath
    ? ts.readConfigFile(configPath, ts.sys.readFile).config
    : {
        lib: ['ES2020', 'ES5'],
        declaration: true,
        module: isServer ? ts.ModuleKind.Node16 : ts.ModuleKind.ES2020,
        skipLibCheck: true,
        removeComments: false,
      }

  const host = ts.createCompilerHost(tsconfig)
  host.writeFile = (fileName: string, contents: string) =>
    (createdFiles[fileName] = contents)

  const program = ts.createProgram(fileNames, tsconfig, host)
  program.emit()

  Object.entries(createdFiles).forEach(([fileName, content]) => {
    if (fileName.endsWith('.d.ts') && fileTypeObj.dts) {
      writeSafe(content, fileName)
    }
    if (fileName.endsWith('.js') && fileTypeObj.js) {
      writeSafe(content, fileName)
    }
  })
  console.timeEnd(`Compiling TypeScript for ${loc}`)
}

