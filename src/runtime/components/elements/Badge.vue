<template>
  <span :class="badgeClass">
    <slot>{{ label }}</slot>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { classNames } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
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
        console.log('Object.keys(appConfig.ui.badge.color)', Object.keys(appConfig.ui.badge.color))
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
      type: String,
      default: null
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.badge>>,
      default: () => appConfig.ui.badge
    }
  },
  setup (props) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.badge>>(() => defu({}, props.ui, appConfig.ui.badge))

    const badgeClass = computed(() => {
      const variant = ui.value.color?.[props.color as string]?.[props.variant as string] || ui.value.variant[props.variant]

      return classNames(
        ui.value.base,
        ui.value.font,
        ui.value.rounded,
        ui.value.size[props.size],
        variant?.replaceAll('{color}', props.color)
      )
    })

    return {
      badgeClass
    }
  }
})
</script>
