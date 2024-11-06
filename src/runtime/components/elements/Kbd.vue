<template>
  <kbd :class="kbdClass" v-bind="attrs">
    <slot>{{ value }}</slot>
  </kbd>
</template>

<script lang="ts">
import { toRef, defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { DeepPartial, KbdSize, Strategy } from '../../types/index'
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
      type: String as PropType<KbdSize>,
      default: () => config.default.size,
      validator(value: string) {
        return Object.keys(config.size).includes(value)
      }
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  setup(props) {
    const { ui, attrs } = useUI('kbd', toRef(props, 'ui'), config)

    const kbdClass = computed(() => {
      return twMerge(twJoin(
        ui.value.base,
        ui.value.size[props.size],
        ui.value.padding,
        ui.value.rounded,
        ui.value.font,
        ui.value.background,
        ui.value.ring
      ), props.class)
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
