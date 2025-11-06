import { splitByCase, upperFirst, camelCase, kebabCase } from 'scule'

const playground = ({ name }) => {
  const upperName = splitByCase(name).map(p => upperFirst(p)).join('')
  const kebabName = kebabCase(name)

  return {
    filename: `playgrounds/nuxt/app/pages/components/${kebabName}.vue`,
    contents: `
<template>
  <div>
    <U${upperName} />
  </div>
</template>
`
  }
}

const component = ({ name, primitive, prose, content }) => {
  const upperName = splitByCase(name).map(p => upperFirst(p)).join('')
  const camelName = camelCase(name)
  const kebabName = kebabCase(name)

  return {
    filename: `src/runtime/components/${prose ? 'prose/' : ''}${content ? 'content/' : ''}${upperName}.vue`,
    contents: primitive
      ? `
<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/${prose ? 'prose/' : ''}${content ? 'content/' : ''}${kebabName}'
import type { ComponentConfig } from '../types/tv'

type ${upperName} = ComponentConfig<typeof theme, AppConfig, '${camelName}'>

export interface ${upperName}Props {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  ui?: ${upperName}['slots']
}

export interface ${upperName}Slots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = defineProps<${upperName}Props>()
defineSlots<${upperName}Slots>()

const appConfig = useAppConfig() as ${upperName}['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.${camelName} || {}) })())
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot />
  </Primitive>
</template>
`
      : `
<script lang="ts">
import type { ${upperName}RootProps, ${upperName}RootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/${prose ? 'prose/' : ''}${content ? 'content/' : ''}${kebabName}'
import type { ComponentConfig } from '../types/tv'

type ${upperName} = ComponentConfig<typeof theme, AppConfig, '${camelName}'>

export interface ${upperName}Props extends Pick<${upperName}RootProps> {
  class?: any
  ui?: ${upperName}['slots']
}

export interface ${upperName}Emits extends ${upperName}RootEmits {}

export interface ${upperName}Slots {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ${upperName}Root, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = defineProps<${upperName}Props>()
const emits = defineEmits<${upperName}Emits>()
const slots = defineSlots<${upperName}Slots>()

const appConfig = useAppConfig() as ${upperName}['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props), emits)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.${camelName} || {}) })())
</script>

<template>
  <${upperName}Root v-bind="rootProps" :class="ui.root({ class: [props.ui?.root, props.class] })" />
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
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ${upperName} from '../../${content ? '../' : ''}src/runtime/components/${content ? 'content/' : ''}${upperName}.vue'
import type { ${upperName}Props, ${upperName}Slots } from '../../${content ? '../' : ''}src/runtime/components/${content ? 'content/' : ''}${upperName}.vue'
import ComponentRender from '../${content ? '../' : ''}component-render'

describe('${upperName}', () => {
  const props = {}

  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ${upperName}Props, slots?: Partial<${upperName}Slots> }) => {
    const html = await ComponentRender(nameOrHtml, options, ${upperName})
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(${upperName}, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
`
  }
}

const docs = ({ name, primitive }) => {
  const kebabName = kebabCase(name)
  const upperName = splitByCase(name).map(p => upperFirst(p)).join('')

  return {
    filename: `docs/content/docs/2.components/${kebabName}.md`,
    contents: `---
title: ${upperName}
description: ''
links:${primitive
  ? ''
  : `
  - label: ${upperName}
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/${kebabName}`}
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/${upperName}.vue
navigation.badge: Soon
---

## Usage

## Examples

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

## Theme

:component-theme

## Changelog

:component-changelog
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
