// import { dirname, join } from 'pathe'
// import { useNuxt, addTemplate } from '@nuxt/kit'
// import * as config from './runtime/ui.config'

// export default function createTemplates (nuxt = useNuxt()) {
//   const dtsContent: Array<string> = []

//   Object.entries(config).forEach(([key, value = {} as any]) => {
//     addTemplate({
//       filename: `ui.config/${key}.mjs`,
//       getContents: () => `export default ${JSON.stringify(value, null, 2)}`
//     })

//     dtsContent.push(`declare module "#ui-config/${key}" { const defaultExport: ${JSON.stringify(value)}; export default defaultExport; }`)
//   })

//   const configOptions = Object.keys(config)

//   const template = addTemplate({
//     filename: 'ui.config/index.mjs',
//     getContents: () => `${configOptions.map(v => `import ${v} from "#build/ui.config/${v}.mjs"`).join('\n')}\nconst config = { ${configOptions.join(', ')} }\nexport { config as default, ${configOptions.join(', ')} }`,
//     write: true
//   })

//   dtsContent.push(`declare module "#ui-config" {${configOptions.map(v => ` export const ${v}: typeof import("${join('#ui-config', v)}")["default"];`).join('')} const defaultExport: { ${configOptions.map(v => `"${v}": typeof ${v}`)} }; export default defaultExport; }`)

//   const typesTemplate = addTemplate({
//     filename: 'ui.config.d.ts',
//     getContents: () => dtsContent.join('\n'),
//     write: true
//   })

//   nuxt.options.alias['#ui-config'] = dirname(template.dst)

//   nuxt.hook('prepare:types', (opts) => {
//     opts.references.push({ path: typesTemplate.dst })
//   })
// }
