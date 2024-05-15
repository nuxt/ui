import { kebabCase } from 'scule'
import { addTemplate, addTypeTemplate } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions } from './module'
import * as theme from './theme'

export function addTemplates(options: ModuleOptions, nuxt: Nuxt) {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  const template = addTemplate({
    filename: 'tailwind.css',
    write: true,
    getContents: () => `@import "tailwindcss";

@layer base {
  :root {
    color-scheme: light dark;
  }

  @keyframes accordion-up {
    from { height: var(--radix-accordion-content-height); }
    to { height: 0; }
  }
  @keyframes accordion-down {
    from { height: 0; }
    to { height: var(--radix-accordion-content-height); }
  }

  @keyframes collapsible-up {
    from { height: var(--radix-collapsible-content-height); }
    to { height: 0; }
  }
  @keyframes collapsible-down {
    from { height: 0; }
    to { height: var(--radix-collapsible-content-height); }
  }

  @keyframes toast-collapsed-closed {
    from { transform: var(--transform); }
    to { transform: translateY(calc((var(--before) - var(--height)) * var(--gap))) scale(var(--scale)); }
  }
  @keyframes toast-closed {
    from { transform: var(--transform); }
    to { transform: translateY(calc((var(--offset) - var(--height)) * var(--translate-factor))); }
  }
  @keyframes toast-slide-left {
    from { transform: translateX(0) translateY(var(--translate)); }
    to { transform: translateX(-100%) translateY(var(--translate)); }
  }
  @keyframes toast-slide-right {
    from { transform: translateX(0) translateY(var(--translate)); }
    to { transform: translateX(100%) translateY(var(--translate)); }
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes scale-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes scale-out {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.95); }
  }

  @keyframes slide-in-from-top {
    from { transform: translateY(-100%); }
    to { transform: translateY(0); }
  }
  @keyframes slide-out-to-top {
    from { transform: translateY(0); }
    to { transform: translateY(-100%); }
  }
  @keyframes slide-in-from-right {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  @keyframes slide-out-to-right {
    from { transform: translateX(0); }
    to { transform: translateX(100%); }
  }
  @keyframes slide-in-from-bottom {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  @keyframes slide-out-to-bottom {
    from { transform: translateY(0); }
    to { transform: translateY(100%); }
  }
  @keyframes slide-in-from-left {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
  @keyframes slide-out-to-left {
    from { transform: translateX(0); }
    to { transform: translateX(-100%); }
  }

  @keyframes slide-in-from-top-and-fade {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slide-out-to-top-and-fade {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-4px); }
  }
  @keyframes slide-in-from-right-and-fade {
    from { opacity: 0; transform: translateX(4px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slide-out-to-right-and-fade {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(4px); }
  }
  @keyframes slide-in-from-bottom-and-fade {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slide-out-to-bottom-and-fade {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(4px); }
  }
  @keyframes slide-in-from-left-and-fade {
    from { opacity: 0; transform: translateX(-4px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slide-out-to-left-and-fade {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(-4px); }
  }

  @keyframes enter-from-right {
    from { opacity: 0; transform: translateX(200px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes enter-from-left {
    from { opacity: 0; transform: translateX(-200px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes exit-to-right {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(200px); }
  }
  @keyframes exit-to-left {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(-200px); }
  }
  @keyframes carousel {
    0%,
    100% {
      width: 50%
    }
    0% {
      transform: translateX(-100%)
    }
    100% {
      transform: translateX(200%)
    }
  }
  @keyframes carousel-vertical {
    0%,
    100% {
      height: 50%
    }
    0% {
      transform: translateY(-100%)
    }
    100% {
      transform: translateY(200%)
    }
  }
  
  @keyframes carousel-inverse {
    0%,
    100% {
      width: 50%
    }
    0% {
      transform: translateX(200%)
    }
    100% {
      transform: translateX(-100%)
    }
  }
  @keyframes carousel-inverse-vertical {
    0%
    100% {
      height: 50%
    }
    0% {
      transform: translateY(200%)
    }
    100% {
      transform: translateY(-100%)
    }
  }
  
  @keyframes swing {
    0%,
    100% {
      width: 50%
    }
    0%,
    100% {
      transform: translateX(-25%)
    }
    50% {
      transform: translateX(125%)
    }
  }
  @keyframes swing-vertical {
    0%,
    100% {
      height: 50%
    }
    0%,
    100% {
      transform: translateY(-25%)
    }
    50% {
      transform: translateY(125%)
    }
  }
  
  @keyframes elastic {
    /* Firefox doesn't do "margin: 0 auto", we have to play with margin-left */
    0%,
    100% {
      width: 50%;
      margin-left: 25%;
    }
    50% {
      width: 90%;
      margin-left: 5%;
    }
  }
  @keyframes elastic-vertical {
    0%,
    100% {
      height: 50%;
      margin-top: 25%;
    }
    50% {
      height: 90%;
      margin-top: 5%;
    }
  }
}

@theme {
  --color-gray-*: initial;
  --color-cool-50: #f9fafb;
  --color-cool-100: #f3f4f6;
  --color-cool-200: #e5e7eb;
  --color-cool-300: #d1d5db;
  --color-cool-400: #9ca3af;
  --color-cool-500: #6b7280;
  --color-cool-600: #4b5563;
  --color-cool-700: #374151;
  --color-cool-800: #1f2937;
  --color-cool-900: #111827;
  --color-cool-950: #030712;

  --spacing-4_5: 1.125rem;

  ${shades.map(shade => `--color-primary-${shade}: var(--color-primary-${shade});`).join('\n\t')}
  ${shades.map(shade => `--color-gray-${shade}: var(--color-gray-${shade});`).join('\n\t')}
}
`
  })

  nuxt.options.css.unshift(template.dst)

  for (const component in theme) {
    addTemplate({
      filename: `ui/${kebabCase(component)}.ts`,
      write: true,
      getContents: async () => {
        const template = (theme as any)[component]
        const result = typeof template === 'function' ? template({ colors: options.colors }) : template

        const variants = Object.keys(result.variants || {})

        let json = JSON.stringify(result, null, 2)

        for (const variant of variants) {
          json = json.replace(new RegExp(`("${variant}": "[^"]+")`, 'g'), '$1 as const')
          json = json.replace(new RegExp(`("${variant}": \\[\\s*)((?:"[^"]+",?\\s*)+)(\\])`, 'g'), (_, before, match, after) => {
            const replaced = match.replace(/("[^"]+")/g, '$1 as const')
            return `${before}${replaced}${after}`
          })
        }

        return `export default ${json}`
      }
    })
  }

  addTemplate({
    filename: 'ui/index.ts',
    write: true,
    getContents: () => Object.keys(theme).map(component => `export { default as ${component} } from './${kebabCase(component)}'`).join('\n')
  })

  // FIXME: `typeof colors[number]` should include all colors from the theme
  addTypeTemplate({
    filename: 'types/ui.d.ts',
    getContents: () => `import * as ui from '#build/ui'
import type { DeepPartial } from '#ui/types/utils'

const colors = ${JSON.stringify(options.colors)} as const;
const icons = ${JSON.stringify(nuxt.options.appConfig.ui.icons)};

type AppConfigUI = {
  primary?: typeof colors[number]
  gray?: 'slate' | 'cool' | 'zinc' | 'neutral' | 'stone'
  icons?: Partial<typeof icons>
} & DeepPartial<typeof ui>

declare module 'nuxt/schema' {
  interface AppConfigInput {
    ui?: AppConfigUI
  }
}
declare module '@nuxt/schema' {
  interface AppConfigInput {
    ui?: AppConfigUI
  }
}
export {}
`
  })
}
