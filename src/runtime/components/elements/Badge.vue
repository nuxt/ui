<template>
  <span :class="badgeClass" v-bind="attrs">
    <slot>{{ label }}</slot>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { omit } from 'lodash-es'
import { twMerge, twJoin } from 'tailwind-merge'
import { defuTwMerge } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  inheritAttrs: false,
  props: {
    size: {
      type: String,
      default: () => appConfig.ui.badge.default.size,
      validator (value: string) {
        return Object.keys(appConfig.ui.badge.size).includes(value)
      }
    },
    color: {
      type: String,
      default: () => appConfig.ui.badge.default.color,
      validator (value: string) {
        return [...appConfig.ui.colors, ...Object.keys(appConfig.ui.badge.color)].includes(value)
      }
    },
    variant: {
      type: String,
      default: () => appConfig.ui.badge.default.variant,
      validator (value: string) {
        return [
          ...Object.keys(appConfig.ui.badge.variant),
          ...Object.values(appConfig.ui.badge.color).flatMap(value => Object.keys(value))
        ].includes(value)
      }
    },
    label: {
      type: [String, Number],
      default: null
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.badge>>,
      default: () => ({})
    }
  },
  setup (props, { attrs }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.badge>>(() => defuTwMerge({}, props.ui, appConfig.ui.badge))

    const badgeClass = computed(() => {
      const variant = ui.value.color?.[props.color as string]?.[props.variant as string] || ui.value.variant[props.variant]

      return twMerge(twJoin(
        ui.value.base,
        ui.value.font,
        ui.value.rounded,
        ui.value.size[props.size],
        variant?.replaceAll('{color}', props.color)
      ), attrs.class as string)
    })

    return {
      attrs: computed(() => omit(attrs, ['class'])),
      badgeClass
    }
  }
})
</script>
