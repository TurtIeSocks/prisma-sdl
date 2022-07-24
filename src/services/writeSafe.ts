import fs from 'fs'
import { resolve } from 'path'
// import ts from 'typescript'

export function writeSafe(
  content: string,
  fileName: string,
  ...args: string[]
): void {
  const fileDir = resolve(...args)
  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir, {
      recursive: true,
    })
  }

  // const js = ts.transpileModule(content, {
  //   compilerOptions: { module: ts.ModuleKind.CommonJS },
  // }).outputText
  // fs.writeFileSync(resolve(fileDir, fileName.replace('.ts', '.js')), js)

  fs.writeFileSync(resolve(fileDir, fileName), content)
}
