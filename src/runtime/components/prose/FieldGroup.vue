<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/field-group'

type ProseFieldGroup = ComponentConfig<typeof theme, AppConfig, 'fieldGroup', 'ui.prose'>

export interface ProseFieldGroupProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  ui?: { base?: any }
}

export interface ProseFieldGroupSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
import { tv } from '../../utils/tv'

const props = defineProps<ProseFieldGroupProps>()
defineSlots<ProseFieldGroupSlots>()

const appConfig = useAppConfig() as ProseFieldGroup['AppConfig']
const uiProp = useComponentUI('prose.fieldGroup', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.fieldGroup || {}) }))
</script>

<template>
  <Primitive :as="as" :class="ui({ class: [uiProp?.base, props.class] })">
    <slot />
  </Primitive>
</template>
