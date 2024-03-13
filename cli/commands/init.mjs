import { existsSync, promises as fsp } from 'node:fs'
import { resolve } from 'pathe'
import { defineCommand } from 'citty'
import { consola } from 'consola'
import { camelCase, snakeCase } from 'scule'
import templates from '../utils/templates.mjs'

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
  async setup ({ args }) {
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
    const contents = `export { default as ${camelCase(name)} } from './${snakeCase(name)}'`
    if (!theme.includes(contents)) {
      await fsp.writeFile(themePath, theme.trim() + '\n' + contents + '\n')
    }
  }
})
