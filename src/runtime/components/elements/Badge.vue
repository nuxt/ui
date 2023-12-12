<template>
  <span :class="badgeClass" v-bind="attrs">
    <slot name="leading">
      <UIcon v-if="isLeading && leadingIcon" :name="leadingIcon" aria-hidden="true" @click.stop="handleLeadingIconClick" />
    </slot>
    <slot>{{ label }}</slot>
    <slot name="trailing">
      <UIcon v-if="isTrailing && trailingIcon" :name="trailingIcon" aria-hidden="true" @click.stop="handleTrailingIconClick" />
    </slot>
  </span>
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { BadgeColor, BadgeSize, BadgeVariant, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { badge } from '#ui/ui.config'

const config = mergeConfig<typeof badge>(appConfig.ui.strategy, appConfig.ui.badge, badge)

export default defineComponent({
  inheritAttrs: false,
  props: {
    size: {
      type: String as PropType<BadgeSize>,
      default: () => config.default.size,
      validator (value: string) {
        return Object.keys(config.size).includes(value)
      }
    },
    color: {
      type: String as PropType<BadgeColor>,
      default: () => config.default.color,
      validator (value: string) {
        return [...appConfig.ui.colors, ...Object.keys(config.color)].includes(value)
      }
    },
    variant: {
      type: String as PropType<BadgeVariant>,
      default: () => config.default.variant,
      validator (value: string) {
        return [
          ...Object.keys(config.variant),
          ...Object.values(config.color).flatMap(value => Object.keys(value))
        ].includes(value)
      }
    },
    label: {
      type: [String, Number],
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    leadingIcon: {
      type: String,
      default: null
    },
    trailingIcon: {
      type: String,
      default: null
    },
    leading: {
      type: Boolean,
      default: false
    },
    trailing: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: undefined
    },
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  emits: ['onLeadingIconClick', 'onTrailingIconClick'],
  setup (props, { emit }) {
    const { ui, attrs } = useUI('badge', toRef(props, 'ui'), config)

    const isLeading = computed(() => {
      return (props.icon && props.leading) || (props.icon && !props.trailing) || props.leadingIcon
    })

    const isTrailing = computed(() => {
      return (props.icon && props.trailing) || props.trailingIcon
    })

    const badgeClass = computed(() => {
      const variant = ui.value.color?.[props.color as string]?.[props.variant as string] || ui.value.variant[props.variant]
      const disabled = props.disabled ? config.disabled : ''
      return twMerge(twJoin(
        ui.value.base,
        ui.value.font,
        ui.value.rounded,
        ui.value.size[props.size],
        variant?.replaceAll('{color}', props.color),
        disabled
      ), props.class)
    })

    const handleLeadingIconClick = e => emit('onLeadingIconClick', e)
    const handleTrailingIconClick = e => emit('onTrailingIconClick', e)
   

    return {
      attrs,
      badgeClass,
      isLeading,
      isTrailing,
      handleLeadingIconClick,
      handleTrailingIconClick

    }
  }
})
</script>
