import { resolve } from 'node:path'
import fs from 'node:fs'
import { genObjectFromValues } from 'knitwork'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const newConfig = genObjectFromValues(body)

  const path = resolve('./playground/app/app.config.ts')
  fs.writeFileSync(path, `export default defineAppConfig(${newConfig})`)

  return newConfig
})
