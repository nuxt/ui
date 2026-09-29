<script lang="ts">
import type { VNode } from 'vue'
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
  class?: any
  ui?: FieldGroup['slots']
}

export interface FieldGroupSlots {
  default?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { provide, computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { fieldGroupInjectionKey } from '../composables/useFieldGroup'
import { tv } from '../utils/tv'

const _props = withDefaults(defineProps<FieldGroupProps>(), {
  orientation: 'horizontal'
})
defineSlots<FieldGroupSlots>()

const props = useComponentProps('fieldGroup', _props, theme)

// What the group passes down to its children: without `theme`, the proxy leaves
// out the `'*'` and `app.config.ui.defaultVariants` defaults, which each child
// applies itself, so a child's own `<UTheme :props>` key still beats them
const providedProps = useComponentProps('fieldGroup', _props)

const appConfig = useAppConfig() as FieldGroup['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, appConfig.ui?.fieldGroup)({ orientation: props.orientation }))

provide(fieldGroupInjectionKey, computed(() => ({
  orientation: props.orientation,
  size: providedProps.size
})))
</script>

<template>
  <Primitive :as="props.as" :data-orientation="props.orientation" data-slot="field-group" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot />
  </Primitive>
</template>
