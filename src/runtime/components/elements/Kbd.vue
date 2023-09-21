<template>
  <kbd :class="kbdClass" v-bind="attrs">
    <slot>{{ value }}</slot>
  </kbd>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { kbd } from '#ui/ui.config'

const config = mergeConfig<typeof kbd>(appConfig.ui.strategy, appConfig.ui.kbd, kbd)

export default defineComponent({
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: null
    },
    size: {
      type: String as PropType<keyof typeof config.size>,
      default: () => config.default.size,
      validator (value: string) {
        return Object.keys(config.size).includes(value)
      }
    },
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  setup (props) {
    const { ui, attrs, attrsClass } = useUI('ui.kbd', props.ui, config)

    const kbdClass = computed(() => {
      return twMerge(twJoin(
        ui.value.base,
        ui.value.size[props.size],
        ui.value.padding,
        ui.value.rounded,
        ui.value.font,
        ui.value.background,
        ui.value.ring
      ), attrsClass)
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      kbdClass
    }
  }
})
</script>
