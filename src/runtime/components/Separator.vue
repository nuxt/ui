<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { SeparatorProps as _SeparatorProps } from 'radix-vue'
import type { AvatarProps } from '#ui/types'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/separator'

const appConfig = _appConfig as AppConfig & { ui: { separator: Partial<typeof theme> } }

const separator = tv({ extend: tv(theme), ...(appConfig.ui?.separator || {}) })

type SeparatorVariants = VariantProps<typeof separator>

export interface SeparatorProps extends Omit<_SeparatorProps, 'asChild' | 'orientation'> {
  /** Display a label in the middle. */
  label?: string
  /** Display an icon in the middle. */
  icon?: string
  /** Display an avatar in the middle. */
  avatar?: AvatarProps
  color?: SeparatorVariants['color']
  size?: SeparatorVariants['size']
  type?: SeparatorVariants['type']
  /**
   * The orientation of the separator.
   * @defaultValue `'horizontal'`
   */
  orientation?: _SeparatorProps['orientation']
  class?: any
  ui?: Partial<typeof separator.slots>
}

export interface SeparatorSlots {
  default(): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Separator, useForwardProps } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { UAvatar, UIcon } from '#components'

const props = withDefaults(defineProps<SeparatorProps>(), {
  as: 'div',
  orientation: 'horizontal'
})
const slots = defineSlots<SeparatorSlots>()

const rootProps = useForwardProps(reactivePick(props, 'as', 'decorative', 'orientation'))

const ui = computed(() => tv({ extend: separator, slots: props.ui })({
  color: props.color,
  orientation: props.orientation,
  size: props.size,
  type: props.type
}))
</script>

<template>
  <Separator v-bind="rootProps" :class="ui.root({ class: props.class })">
    <div :class="ui.border()" />

    <template v-if="label || icon || avatar || !!slots.default">
      <div :class="ui.container()">
        <slot>
          <span v-if="label" :class="ui.label()">{{ label }}</span>
          <UIcon v-else-if="icon" :name="icon" :class="ui.icon()" />
          <UAvatar v-else-if="avatar" size="2xs" v-bind="avatar" :class="ui.avatar()" />
        </slot>
      </div>

      <div :class="ui.border()" />
    </template>
  </Separator>
</template>
