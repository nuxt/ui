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
      description: 'Locale code to create. For example: en or en_gb.',
      required: true
    },
    name: {
      description: 'Locale name in its own language. Defaults to the CLDR name for the code.'
    },
    dir: {
      description: 'Locale direction. Defaults to the CLDR direction for the code.'
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

    if (!args.code.match(/^[a-z]{2,3}(?:_[a-z]{2,4})?$/)) {
      consola.error(`🚨 ${args.code} is not a valid locale code!\nExample: en or en_gb`)
      process.exit(1)
    }

    const code = normalizeLocale(args.code)
    const language = code.split('-')[0]

    // `Intl.DisplayNames` echoes the input back when the code is unknown to CLDR
    if (new Intl.DisplayNames(['en'], { type: 'language' }).of(language) === language) {
      consola.error(`🚨 ${language} is not a known ISO 639 language code!\nFor example, the code for Tajik is tg, not tj.`)
      process.exit(1)
    }

    const region = code.split('-')[1]
    if (region && new Intl.DisplayNames(['en'], { type: 'region' }).of(region) === region) {
      consola.error(`🚨 ${region} is not a known region code!\nExample: en_gb or pt_br`)
      process.exit(1)
    }

    let name = args.name
    if (!name) {
      const cldrName = new Intl.DisplayNames([code], { type: 'language', languageDisplay: 'standard' }).of(code)
      name = cldrName.charAt(0).toLocaleUpperCase(code) + cldrName.slice(1)
      consola.info(`🌍 Using CLDR name for ${code}: ${name}`)
    }

    let dir = args.dir
    if (!dir) {
      const intlLocale = new Intl.Locale(code)
      dir = (intlLocale.getTextInfo?.() ?? intlLocale.textInfo)?.direction ?? 'ltr'
      if (dir === 'rtl') {
        consola.info(`🌍 Using CLDR direction for ${code}: ${dir}`)
      }
    }

    if (!['ltr', 'rtl'].includes(dir)) {
      consola.error(`🚨 Direction ${dir} not supported!`)
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
      .replace(/name: '(.*)',/, `name: '${name}',`)
      .replace(/code: '(.*)',/, `code: '${code}',${dir !== 'ltr' ? `\n  dir: '${dir}',` : ''}`)
    await fsp.writeFile(newLocaleFilePath, rewrittenLocaleFile)

    consola.success(`🪄 Generated ${newLocaleFilePath}`)
  }
})
