<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/button-group'
import type { ButtonProps } from './Button.vue'

const appConfig = _appConfig as AppConfig & { ui: { buttonGroup: Partial<typeof theme> } }

const buttonGroup = tv({ extend: tv(theme), ...(appConfig.ui?.buttonGroup) })

type ButtonGroupVariants = VariantProps<typeof buttonGroup>

export interface ButtonGroupProps {
  size?: ButtonProps['size']
  orientation?: ButtonGroupVariants['orientation']
  class?: any
  ui?: Partial<typeof buttonGroup.slots>
}

export interface ButtonGroupSlots {
  default(): any
}
</script>

<script setup lang="ts">
import { provide, computed } from 'vue'
import { buttonGroupInjectionKey } from '#imports'

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  orientation: 'horizontal'
})
defineSlots<ButtonGroupSlots>()

const ui = computed(() => tv({ extend: buttonGroup, slots: props.ui })({
  orientation: props.orientation
}))

provide(buttonGroupInjectionKey, computed(() => ({
  orientation: props.orientation,
  size: props.size
})))
</script>

<template>
  <div :class="ui.base({ class: props.class })">
    <slot />
  </div>
</template>
