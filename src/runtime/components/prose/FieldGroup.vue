<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '../../theme/prose/field-group'

type ProseFieldGroup = ComponentConfig<typeof theme, AppConfig, 'fieldGroup', 'ui.prose'>

export interface ProseFieldGroupProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  ui?: ProseFieldGroup['slots']
}

export interface ProseFieldGroupSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseFieldGroupProps>()

defineSlots<ProseFieldGroupSlots>()

const props = useComponentProps('prose.fieldGroup', _props, theme)

const appConfig = useThemeConfig() as ProseFieldGroup['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.prose?.fieldGroup)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <Primitive :as="props.as" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot />
  </Primitive>
</template>
