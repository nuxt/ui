import { existsSync, promises as fsp } from 'node:fs'
import { resolve } from 'pathe'
import { defineCommand } from 'citty'
import { consola } from 'consola'
import { splitByCase, upperFirst, camelCase, kebabCase } from 'scule'
import templates from '../templates.mjs'

export default defineCommand({
  meta: {
    name: 'init',
    description: 'Init a new component.'
  },
  args: {
    name: {
      type: 'positional',
      required: true,
      description: 'Name of the component.'
    }
  },
  async setup({ args }) {
    const name = args.name
    if (!name) {
      consola.error('name argument is missing!')
      process.exit(1)
    }

    const path = resolve('.')

    for (const template of Object.keys(templates)) {
      const { filename, contents } = templates[template]({ name })
      const filePath = resolve(path, filename)

      if (existsSync(filePath)) {
        consola.error(`🚨 ${filePath} already exists!`)
        continue
      }

      await fsp.writeFile(filePath, contents.trim() + '\n')

      consola.success(`🪄 Generated ${filePath}!`)
    }

    const themePath = resolve(path, 'src/theme/index.ts')
    const theme = await fsp.readFile(themePath, 'utf-8')
    const themeContents = `export { default as ${camelCase(name)} } from './${kebabCase(name)}'`
    if (!theme.includes(themeContents)) {
      await fsp.writeFile(themePath, theme.trim() + '\n' + themeContents + '\n')
    }

    const typesPath = resolve(path, 'src/runtime/types/index.d.ts')
    const types = await fsp.readFile(typesPath, 'utf-8')
    const typesContents = `export * from '../components/${splitByCase(name).map(p => upperFirst(p)).join('')}.vue'`
    if (!types.includes(typesContents)) {
      await fsp.writeFile(typesPath, types.trim() + '\n' + typesContents + '\n')
    }
  }
})
