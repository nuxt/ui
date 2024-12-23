import { join } from 'pathe'
import { defu } from 'defu'
import { addTemplate, createResolver, installModule, useNuxt } from '@nuxt/kit'
import { setGlobalColors } from './runtime/utils/colors'
import type { ModuleOptions } from './module'

export default function installTailwind(
  moduleOptions: ModuleOptions,
  nuxt = useNuxt(),
  resolve = createResolver(import.meta.url).resolve
): Promise<void> {
  const runtimeDir = resolve('./runtime')

  // 1. register hook
  nuxt.hook('tailwindcss:config', function (tailwindConfig) {
    tailwindConfig.theme = tailwindConfig.theme || {}
    tailwindConfig.theme.extend = tailwindConfig.theme.extend || {}
    tailwindConfig.theme.extend.colors = tailwindConfig.theme.extend.colors || {}

    const colors = setGlobalColors(tailwindConfig.theme)

    // @ts-ignore
    nuxt.options.appConfig.ui = {
      primary: 'green',
      gray: 'cool',
      colors,
      strategy: 'merge'
    }
  })

  // 2. add config template
  const configTemplate = addTemplate({
    filename: 'nuxtui-tailwind.config.mjs',
    write: true,
    getContents: ({ nuxt }) => `
      import { defaultExtractor as createDefaultExtractor } from "tailwindcss/lib/lib/defaultExtractor.js";
      import { customSafelistExtractor, generateSafelist } from ${JSON.stringify(resolve(runtimeDir, 'utils', 'colors'))};
      import formsPlugin from "@tailwindcss/forms";
      import aspectRatio from "@tailwindcss/aspect-ratio";
      import typography from "@tailwindcss/typography";
      import containerQueries from "@tailwindcss/container-queries";
      import headlessUi from "@headlessui/tailwindcss";

      const defaultExtractor = createDefaultExtractor({ tailwindConfig: { separator: ':' } });

      export default {
        plugins: [
          formsPlugin({ strategy: 'class' }),
          aspectRatio,
          typography,
          containerQueries,
          headlessUi
        ],
        content: {
          files: [
            ${JSON.stringify(resolve(runtimeDir, 'components/**/*.{vue,mjs,ts}'))},
            ${JSON.stringify(resolve(runtimeDir, 'ui.config/**/*.{mjs,js,ts}'))}
          ],
          transform: {
            vue: (content) => {
              return content.replaceAll(/(?:\\r\\n|\\r|\\n)/g, ' ')
            }
          },
          extract: {
            vue: (content) => {
              return [
                ...defaultExtractor(content),
                ...customSafelistExtractor(${JSON.stringify(moduleOptions.prefix)}, content, ${JSON.stringify(nuxt.options.appConfig.ui.colors)}, ${JSON.stringify(moduleOptions.safelistColors)})
              ]
            }
          }
        },
        safelist: generateSafelist(${JSON.stringify(moduleOptions.safelistColors || [])}, ${JSON.stringify(nuxt.options.appConfig.ui.colors)}),
      }
    `
  })

  const { configPath: userTwConfigPath = [], ...twModuleConfig } = nuxt.options.tailwindcss ?? {}

  const twConfigPaths = [
    configTemplate.dst,
    join(nuxt.options.rootDir, 'tailwind.config')
  ]

  if (typeof userTwConfigPath === 'string') {
    twConfigPaths.push(userTwConfigPath)
  } else {
    twConfigPaths.push(...userTwConfigPath)
  }

  // 3. install module
  return installModule('@nuxtjs/tailwindcss', defu({
    exposeConfig: true,
    config: {
      darkMode: 'class' as const
    },
    configPath: twConfigPaths
  }, twModuleConfig))
}
