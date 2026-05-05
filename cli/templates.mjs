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
  const nested = prose || content
  const dirPrefix = prose ? 'prose/' : (content ? 'content/' : '')
  const importPrefix = nested ? '../..' : '..'
  const componentKey = prose ? `prose.${camelName}` : camelName
  const componentConfigArgs = prose
    ? `typeof theme, AppConfig, '${camelName}', 'ui.prose'`
    : `typeof theme, AppConfig, '${camelName}'`
  const appConfigLookup = prose
    ? `appConfig.ui?.prose?.${camelName}`
    : `appConfig.ui?.${camelName}`

  return {
    filename: `src/runtime/components/${dirPrefix}${upperName}.vue`,
    contents: primitive
      ? `
<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/${dirPrefix}${kebabName}'
import type { ComponentConfig } from '${importPrefix}/types/tv'

type ${upperName} = ComponentConfig<${componentConfigArgs}>

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
  default?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentProps } from '${importPrefix}/composables/useComponentProps'
import { tv } from '${importPrefix}/utils/tv'

const _props = defineProps<${upperName}Props>()
defineSlots<${upperName}Slots>()

const props = useComponentProps('${componentKey}', _props)

const appConfig = useAppConfig() as ${upperName}['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(${appConfigLookup} || {}) })())
</script>

<template>
  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot />
  </Primitive>
</template>
`
      : `
<script lang="ts">
import type { ${upperName}RootProps, ${upperName}RootEmits } from 'reka-ui'
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/${dirPrefix}${kebabName}'
import type { ComponentConfig } from '${importPrefix}/types/tv'

type ${upperName} = ComponentConfig<${componentConfigArgs}>

// TODO: narrow with \`Pick<${upperName}RootProps, '...' | '...'>\` to expose only the props you need.
export interface ${upperName}Props extends ${upperName}RootProps {
  class?: any
  ui?: ${upperName}['slots']
}

export interface ${upperName}Emits extends ${upperName}RootEmits {}

export interface ${upperName}Slots {
  default?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ${upperName}Root } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '${importPrefix}/composables/useComponentProps'
import { useForwardProps } from '${importPrefix}/composables/useForwardProps'
import { tv } from '${importPrefix}/utils/tv'

const _props = defineProps<${upperName}Props>()
const emits = defineEmits<${upperName}Emits>()
defineSlots<${upperName}Slots>()

const props = useComponentProps('${componentKey}', _props)

const appConfig = useAppConfig() as ${upperName}['AppConfig']

// TODO: list the same keys as in \`${upperName}Props\` Pick.
const rootProps = useForwardProps(reactivePick(props, 'as'), emits)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(${appConfigLookup} || {}) })())
</script>

<template>
  <${upperName}Root v-bind="rootProps" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot />
  </${upperName}Root>
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
import { renderEach } from '../${content ? '../' : ''}component-render'

describe('${upperName}', () => {
  const props = {}

  renderEach(${upperName}, [
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }]
  ])

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
