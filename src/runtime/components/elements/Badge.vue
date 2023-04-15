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

const appConfig = useAppConfig()

export default defineComponent({
  props: {
    size: {
      type: String,
      default: 'md',
      validator (value: string) {
        return Object.keys(appConfig.ui.badge.size).includes(value)
      }
    },
    variant: {
      type: String,
      default: 'primary',
      validator (value: string) {
        return Object.keys(appConfig.ui.badge.variant).includes(value)
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
    const ui = computed<Partial<typeof appConfig.ui.badge>>(() => defu({}, props.ui, appConfig.ui.badge))

    const badgeClass = computed(() => {
      return classNames(
        ui.value.base,
        ui.value.rounded,
        ui.value.size[props.size],
        ui.value.variant[props.variant]
      )
    })

    return {
      badgeClass
    }
  }
})

</script>
