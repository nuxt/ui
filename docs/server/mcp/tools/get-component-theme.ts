import { defineMcpTool } from '@nuxtjs/mcp-toolkit/server'
import { useEvent } from 'nitropack/runtime'
import { createError } from 'h3'
import { z } from 'zod'
import { camelCase, kebabCase } from 'scule'
import { queryCollection } from '@nuxt/content/server'
// @ts-expect-error - no types available
import { dataSlots, outermost, tokens } from '#component-theme/nitro'
import * as theme from '../../../.nuxt/ui'
import { normalizeComponentName } from '../../utils/normalizeComponentName'
import { describeComponentTheme } from '../../utils/componentTheme'
import { SITE_URL } from '../../utils/site'

export default defineMcpTool({
  description: 'Retrieves the theme of a Nuxt UI component: its slots with their classes and `data-slot` attribute, its variants with their values, `defaultVariants`, `compoundVariants`, and the CSS variables its classes read and set. Use it before customizing a component through the `ui` prop, `app.config.ts` or `<UTheme>`, so overrides target real slot names and variant values and don\'t repeat the default classes. A slot without `dataSlot` styles a child component or renders no element of its own. Variant classes are left out by default, pass `full: true` to get them per slot.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    componentName: z.string().describe('Component name. Accepts `Button`, `UButton`, `button` or `u-button`.'),
    full: z.boolean().optional().describe('Include the classes of every variant value, per slot. Defaults to false (variant values only)')
  },
  inputExamples: [
    { componentName: 'Button' },
    { componentName: 'USelectMenu' },
    { componentName: 'Card', full: true }
  ],
  cache: '30m',
  async handler({ componentName, full }) {
    const event = useEvent()

    const normalizedName = normalizeComponentName(componentName)
    const camelName = camelCase(normalizedName)

    const componentTheme = (theme as Record<string, any>)[camelName]
    if (!componentTheme?.slots) {
      throw createError({ statusCode: 404, message: `Theme for component '${componentName}' not found` })
    }

    const page = await queryCollection(event, 'docs')
      .where('path', 'LIKE', `%/components/${kebabCase(normalizedName)}`)
      .where('extension', '=', 'md')
      .select('title', 'path')
      .first()

    return {
      name: normalizedName,
      // `ui.<key>` in `app.config.ts`, the Vue plugin options and `<UTheme :ui>`
      configKey: camelName,
      ...(page ? { documentation_url: `${SITE_URL}${page.path}` } : {}),
      ...describeComponentTheme(camelName, componentTheme, { dataSlots, outermost, tokens }, { full })
    }
  }
})
