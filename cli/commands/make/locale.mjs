import { existsSync, promises as fsp } from 'node:fs'
import { resolve } from 'pathe'
import { consola } from 'consola'
import { appendFile, sortFile, normalizeLocale } from '../../utils.mjs'
import { defineCommand } from 'citty'

export default defineCommand({
  meta: {
    name: 'locale',
    description: 'Make a new locale.'
  },
  args: {
    code: {
      description: 'Locale code to create. For example: en.',
      required: true
    },
    name: {
      description: 'Locale name to create. For example: English.',
      required: true
    },
    dir: {
      description: 'Locale direction. For example: rtl.',
      default: 'ltr'
    }
  },
  async setup({ args }) {
    const path = resolve('.')
    const localePath = resolve(path, `src/runtime/locale`)

    const originLocaleFilePath = resolve(localePath, 'en.ts')
    const newLocaleFilePath = resolve(localePath, `${args.code}.ts`)

    // Validate locale code
    if (existsSync(newLocaleFilePath)) {
      consola.error(`🚨 ${args.code} already exists!`)
      process.exit(1)
    }

    if (!['ltr', 'rtl'].includes(args.dir)) {
      consola.error(`🚨 Direction ${args.dir} not supported!`)
      process.exit(1)
    }

    if (!args.code.match(/^[a-z]{2}(?:_[a-z]{2,4})?$/)) {
      consola.error(`🚨 ${args.code} is not a valid locale code!\nExample: en or en_us`)
      process.exit(1)
    }

    // Create new locale export
    const localeExportFile = resolve(localePath, `index.ts`)
    await appendFile(localeExportFile, `export { default as ${args.code} } from './${args.code}'`)
    await sortFile(localeExportFile)

    // Create new locale file
    await fsp.copyFile(originLocaleFilePath, newLocaleFilePath)
    const localeFile = await fsp.readFile(newLocaleFilePath, 'utf-8')
    const rewrittenLocaleFile = localeFile
      .replace(/name: '(.*)',/, `name: '${args.name}',`)
      .replace(/code: '(.*)',/, `code: '${normalizeLocale(args.code)}',${(args.dir && args.dir !== 'ltr') ? `\n  dir: '${args.dir}',` : ''}`)
    await fsp.writeFile(newLocaleFilePath, rewrittenLocaleFile)

    consola.success(`🪄 Generated ${newLocaleFilePath}`)
  }
})
