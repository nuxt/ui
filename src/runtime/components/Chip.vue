<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { PrimitiveProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/chip'

const appConfig = _appConfig as AppConfig & { ui: { chip: Partial<typeof theme> } }

const chip = tv({ extend: tv(theme), ...(appConfig.ui?.chip || {}) })

type ChipVariants = VariantProps<typeof chip>

export interface ChipProps extends Omit<PrimitiveProps, 'asChild'> {
  text?: string | number
  inset?: boolean
  color?: ChipVariants['color']
  size?: ChipVariants['size']
  position?: ChipVariants['position']
  class?: any
  ui?: Partial<typeof theme.slots>
}

export interface ChipSlots {
  default(): any
  content(): any
}
</script>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { Primitive } from 'radix-vue'
import { useAvatarGroup } from '#imports'

const show = defineModel<boolean>('show', { default: true })
const props = withDefaults(defineProps<ChipProps>(), { as: 'div' })
defineSlots<ChipSlots>()

const { size } = useAvatarGroup(props)

const ui = computed(() => tv({ extend: chip, slots: props.ui })({
  color: props.color,
  size: size.value,
  position: props.position,
  inset: props.inset
}))

provide('avatar-size', size)
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: props.class })">
    <slot />

    <span v-if="show" :class="ui.base()">
      <slot name="content">
        {{ text }}
      </slot>
    </span>
  </Primitive>
</template>
