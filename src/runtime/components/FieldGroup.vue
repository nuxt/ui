<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/field-group'
import type { ComponentConfig } from '../types/tv'

type FieldGroup = ComponentConfig<typeof theme, AppConfig, 'fieldGroup'>

export interface FieldGroupProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'md'
   */
  size?: FieldGroup['variants']['size']
  /**
   * The orientation the buttons are laid out.
   * @defaultValue 'horizontal'
   */
  orientation?: FieldGroup['variants']['orientation']
  /**
   * When true, clears the field group context so nested components don't inherit styling.
   * @defaultValue false
   */
  clear?: boolean
  class?: any
  ui?: FieldGroup['slots']
}

export interface FieldGroupSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { provide, computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { fieldGroupInjectionKey } from '../composables/useFieldGroup'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<FieldGroupProps>(), {
  orientation: 'horizontal'
})
defineSlots<FieldGroupSlots>()

const appConfig = useAppConfig() as FieldGroup['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.fieldGroup || {}) }))

provide(fieldGroupInjectionKey, computed(() => {
  if (props.clear) {
    return {
      orientation: undefined,
      size: undefined
    }
  }
  return {
    orientation: props.orientation,
    size: props.size
  }
}))
</script>

<template>
  <template v-if="clear">
    <slot />
  </template>
  <Primitive v-else :as="as" :data-orientation="orientation" :class="ui({ orientation, class: props.class })">
    <slot />
  </Primitive>
</template>
