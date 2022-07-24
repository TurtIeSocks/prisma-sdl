import fs from 'fs'
import { resolve } from 'path'

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
  fs.writeFileSync(resolve(fileDir, fileName), content)
}
