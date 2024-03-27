import { splitByCase, upperFirst, camelCase, kebabCase } from 'scule'

const playground = ({ name }) => {
  const upperName = splitByCase(name).map(p => upperFirst(p)).join('')
  const kebabName = kebabCase(name)

  return {
    filename: `playground/pages/${kebabName}.vue`,
    contents: `
<template>
  <div>
    <U${upperName} />
  </div>
</template>
    `
  }
}

const component = ({ name }) => {
  const upperName = splitByCase(name).map(p => upperFirst(p)).join('')
  const camelName = camelCase(name)

  return {
    filename: `src/runtime/components/${upperName}.vue`,
    contents: `
<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { ${upperName}RootProps, ${upperName}RootEmits } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/${camelName}'

const appConfig = _appConfig as AppConfig & { ui: { ${camelName}: Partial<typeof theme> } }

const ${camelName} = tv({ extend: tv(theme), ...(appConfig.ui?.${camelName} || {}) })

type ${upperName}Variants = VariantProps<typeof ${camelName}>

export interface ${upperName}Props extends Omit<${upperName}RootProps, 'asChild'> {
  class?: any
  ui?: Partial<typeof ${camelName}.slots>
}

export interface ${upperName}Emits extends ${upperName}RootEmits {}

export interface ${upperName}Slots {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ${upperName}Root, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'

const props = defineProps<${upperName}Props>()
const emits = defineEmits<${upperName}Emits>()
const slots = defineSlots<${upperName}Slots>()

const rootProps = useForwardPropsEmits(reactivePick(props), emits)

const ui = computed(() => tv({ extend: ${camelName}, slots: props.ui })())
</script>

<template>
  <${upperName}Root v-bind="rootProps" :class="ui.root({ class: props.class })" />
</template>
    `
  }
}

const theme = ({ name }) => {
  const camelName = camelCase(name)

  return {
    filename: `src/theme/${camelName}.ts`,
    contents: `
export default (config: { colors: string[] }) => ({
  slots: {
    root: ''
  },
  variants: {

  },
  defaultVariants: {

  }
})
    `
  }
}

const test = ({ name }) => {
  const upperName = splitByCase(name).map(p => upperFirst(p)).join('')

  return {
    filename: `test/components/${upperName}.spec.ts`,
    contents: `
import { describe, it, expect } from 'vitest'
import ${upperName}, { type ${upperName}Props } from '../../src/runtime/components/${upperName}.vue'
import ComponentRender from '../component-render'

describe('${upperName}', () => {
  it.each([
    ['basic case', {}],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ${upperName}Props, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, ${upperName})
    expect(html).toMatchSnapshot()
  })
})
    `
  }
}

export default {
  playground,
  component,
  theme,
  test
}
