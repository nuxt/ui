import { splitByCase, upperFirst, camelCase, kebabCase } from 'scule'

const playground = ({ name, pro }) => {
  const upperName = splitByCase(name).map(p => upperFirst(p)).join('')
  const kebabName = kebabCase(name)

  return {
    filename: `playground/app/pages/components/${kebabName}.vue`,
    contents: pro
      ? undefined
      : `
<template>
  <div>
    <U${upperName} />
  </div>
</template>
`
  }
}

const component = ({ name, primitive, pro, prose, content }) => {
  const upperName = splitByCase(name).map(p => upperFirst(p)).join('')
  const camelName = camelCase(name)
  const kebabName = kebabCase(name)
  const key = pro ? 'uiPro' : 'ui'
  const path = pro ? 'ui-pro' : 'ui'

  return {
    filename: `src/runtime/components/${prose ? 'prose/' : ''}${content ? 'content/' : ''}${upperName}.vue`,
    contents: primitive
      ? `
<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/${path}/${prose ? 'prose/' : ''}${content ? 'content/' : ''}${kebabName}'
import { tv } from '${pro ? '#ui/utils/tv' : '../utils/tv'}'

const appConfig${camelName} = _appConfig as AppConfig & { ${key}: { ${prose ? 'prose: { ' : ''}${camelName}: Partial<typeof theme> } }${prose ? ' }' : ''}

const ${camelName} = tv({ extend: tv(theme), ...(appConfig${camelName}.${key}?.${prose ? 'prose?.' : ''}${camelName} || {}) })

export interface ${upperName}Props {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  ui?: Partial<typeof ${camelName}.slots>
}

export interface ${upperName}Slots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

const props = defineProps<${upperName}Props>()
defineSlots<${upperName}Slots>()

const ui = ${camelName}()
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <slot />
  </Primitive>
</template>
`
      : `
<script lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ${upperName}RootProps, ${upperName}RootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/${path}/${prose ? 'prose/' : ''}${content ? 'content/' : ''}${kebabName}'
import { tv } from '${pro ? '#ui/utils/tv' : '../utils/tv'}'

const appConfig${camelName} = _appConfig as AppConfig & { ${key}: { ${prose ? 'prose: { ' : ''}${camelName}: Partial<typeof theme> } }${prose ? ' }' : ''}

const ${camelName} = tv({ extend: tv(theme), ...(appConfig${camelName}.${key}?.${prose ? 'prose?.' : ''}${camelName} || {}) })

type ${upperName}Variants = VariantProps<typeof ${camelName}>

export interface ${upperName}Props extends Pick<${upperName}RootProps> {
  class?: any
  ui?: Partial<typeof ${camelName}.slots>
}

export interface ${upperName}Emits extends ${upperName}RootEmits {}

export interface ${upperName}Slots {}
</script>

<script setup lang="ts">
import { ${upperName}Root, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'

const props = defineProps<${upperName}Props>()
const emits = defineEmits<${upperName}Emits>()
const slots = defineSlots<${upperName}Slots>()

const rootProps = useForwardPropsEmits(reactivePick(props), emits)

const ui = ${camelName}()
</script>

<template>
  <${upperName}Root v-bind="rootProps" :class="ui.root({ class: [props.class, props.ui?.root] })" />
</template>
`
  }
}

const theme = ({ name, prose, content }) => {
  const kebabName = kebabCase(name)

  return {
    filename: `src/theme/${prose ? 'prose/' : ''}${content ? 'content/' : ''}${kebabName}.ts`,
    contents: prose
      ? `
export default {
  base: ''
}
`
      : `
export default {
  slots: {
    root: ''
  }
}
`
  }
}

const test = ({ name, prose, content }) => {
  const upperName = splitByCase(name).map(p => upperFirst(p)).join('')

  return {
    filename: `test/components/${content ? 'content/' : ''}${upperName}.spec.ts`,
    contents: prose
      ? undefined
      : `
import { describe, it, expect } from 'vitest'
import ${upperName}, { type ${upperName}Props, type ${upperName}Slots } from '../../${content ? '../' : ''}src/runtime/components/${content ? 'content/' : ''}${upperName}.vue'
import ComponentRender from '../${content ? '../' : ''}component-render'

describe('${upperName}', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ${upperName}Props, slots?: Partial<${upperName}Slots> }) => {
    const html = await ComponentRender(nameOrHtml, options, ${upperName})
    expect(html).toMatchSnapshot()
  })
})
`
  }
}

const docs = ({ name, pro, primitive }) => {
  const kebabName = kebabCase(name)
  const upperName = splitByCase(name).map(p => upperFirst(p)).join('')

  return {
    filename: `docs/content/3.components/${kebabName}.md`,
    contents: `---
title: ${upperName}
description: ''${pro
  ? `
module: ui-pro`
  : ''}
links:${primitive
  ? ''
  : `
  - label: ${upperName}
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/${kebabName}`}
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/${pro ? 'ui-pro' : 'ui'}/tree/v3/src/runtime/components/${upperName}.vue
---

## Usage

## Examples

## API

### Props

:component-props${pro ? '{pro}' : ''}

### Slots

:component-slots${pro ? '{pro}' : ''}

### Emits

:component-emits${pro ? '{pro}' : ''}

## Theme

:component-theme${pro ? '{pro}' : ''}
`
  }
}

export default {
  playground,
  component,
  theme,
  test,
  docs
}
