<template>
  <div :class="skeletonClass" v-bind="attrs" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { skeleton } from '#ui/ui.config'

const config = mergeConfig<typeof skeleton>(appConfig.ui.strategy, appConfig.ui.skeleton, skeleton)

export default defineComponent({
  inheritAttrs: false,
  props: {
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  setup (props) {
    const { ui, attrs, attrsClass } = useUI('skeleton', props.ui, config)

    const skeletonClass = computed(() => {
      return twMerge(twJoin(
        ui.value.base,
        ui.value.background,
        ui.value.rounded
      ), attrsClass)
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      skeletonClass
    }
  }
})
</script>
