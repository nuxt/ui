import { existsSync, promises as fsp } from 'node:fs'
import { resolve } from 'pathe'
import { defineCommand } from 'citty'
import { consola } from 'consola'
import { splitByCase, upperFirst, camelCase, kebabCase } from 'scule'
import { appendFile, appendThemeDefault, sortFile } from '../../utils.mjs'
import templates from '../../templates.mjs'

export default defineCommand({
  meta: {
    name: 'component',
    description: 'Make a new component.'
  },
  args: {
    name: {
      type: 'positional',
      required: true,
      description: 'Name of the component.'
    },
    primitive: {
      type: 'boolean',
      description: 'Create a primitive component.'
    },
    prose: {
      type: 'boolean',
      description: 'Create a prose component.'
    },
    content: {
      type: 'boolean',
      description: 'Create a content component.'
    },
    template: {
      type: 'string',
      description: 'Only generate template.'
    }
  },
  async setup({ args }) {
    const name = args.name
    if (!name) {
      consola.error('`name` argument is missing!')
      process.exit(1)
    }

    const path = resolve('.')

    for (const template of Object.keys(templates)) {
      if (args.template && template !== args.template) {
        continue
      }

      const { filename, contents } = templates[template](args)
      if (!contents) {
        continue
      }

      const filePath = resolve(path, filename)

      if (existsSync(filePath)) {
        consola.error(`🚨 ${filePath} already exists!`)
        continue
      }

      await fsp.writeFile(filePath, contents.trim() + '\n')

      consola.success(`🪄 Generated ${filePath}!`)
    }

    if (args.template) {
      return
    }

    const themePath = resolve(path, `src/theme/${args.prose ? 'prose/' : ''}${args.content ? 'content/' : ''}index.ts`)
    await appendFile(themePath, `export { default as ${camelCase(name)} } from './${kebabCase(name)}'`)
    await sortFile(themePath)

    if (!args.prose) {
      const typesPath = resolve(path, 'src/runtime/types/index.ts')
      const pascal = splitByCase(name).map(p => upperFirst(p)).join('')
      await appendFile(typesPath, `export * from '../components/${args.content ? 'content/' : ''}${pascal}.vue'`)
      await sortFile(typesPath)

      const useComponentPropsPath = resolve(path, 'src/runtime/composables/useComponentProps.ts')
      await appendThemeDefault(useComponentPropsPath, camelCase(name), `${pascal}Props`)
    }
  }
})
