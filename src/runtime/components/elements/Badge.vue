<template>
  <span :class="badgeClass" v-bind="attrs">
    <slot>{{ label }}</slot>
  </span>
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { NestedKeyOf, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { badge } from '#ui/ui.config'
import colors from '#ui-colors'

const config = mergeConfig<typeof badge>(appConfig.ui.strategy, appConfig.ui.badge, badge)

export default defineComponent({
  inheritAttrs: false,
  props: {
    size: {
      type: String as PropType<keyof typeof config.size>,
      default: () => config.default.size,
      validator (value: string) {
        return Object.keys(config.size).includes(value)
      }
    },
    color: {
      type: String as PropType<keyof typeof config.color | typeof colors[number]>,
      default: () => config.default.color,
      validator (value: string) {
        return [...appConfig.ui.colors, ...Object.keys(config.color)].includes(value)
      }
    },
    variant: {
      type: String as PropType<keyof typeof config.variant | NestedKeyOf<typeof config.color>>,
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
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: undefined
    },
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  setup (props) {
    const { ui, attrs } = useUI('badge', toRef(props, 'ui'), config)

    const badgeClass = computed(() => {
      const variant = ui.value.color?.[props.color as string]?.[props.variant as string] || ui.value.variant[props.variant]

      return twMerge(twJoin(
        ui.value.base,
        ui.value.font,
        ui.value.rounded,
        ui.value.size[props.size],
        variant?.replaceAll('{color}', props.color)
      ), props.class)
    })

    return {
      attrs,
      badgeClass
    }
  }
})
</script>
