<template>
  <kbd :class="kbdClass" v-bind="attrs">
    <slot>{{ value }}</slot>
  </kbd>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
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
    value: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: () => appConfig.ui.kbd.default.size,
      validator (value: string) {
        return Object.keys(appConfig.ui.kbd.size).includes(value)
      }
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.kbd>>,
      default: () => ({})
    }
  },
  setup (props, { attrs }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.kbd>>(() => defuTwMerge({}, props.ui, appConfig.ui.kbd))

    const kbdClass = computed(() => {
      return twMerge(twJoin(
        ui.value.base,
        ui.value.size[props.size],
        ui.value.padding,
        ui.value.rounded,
        ui.value.font,
        ui.value.background,
        ui.value.ring
      ), attrs.class as string)
    })

    return {
      attrs: computed(() => omit(attrs, ['class'])),
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      kbdClass
    }
  }
})
</script>
