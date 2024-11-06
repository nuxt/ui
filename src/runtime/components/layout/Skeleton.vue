<template>
  <component :is="as" :class="skeletonClass" v-bind="attrs" />
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { DeepPartial, Strategy } from '../../types/index'
// @ts-expect-error
import appConfig from '#build/app.config'
import { skeleton } from '#ui/ui.config'

const config = mergeConfig<typeof skeleton>(appConfig.ui.strategy, appConfig.ui.skeleton, skeleton)

export default defineComponent({
  inheritAttrs: false,
  props: {
    as: {
      type: String,
      default: 'div'
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
    const { ui, attrs } = useUI('skeleton', toRef(props, 'ui'), config)

    const skeletonClass = computed(() => {
      return twMerge(twJoin(
        ui.value.base,
        ui.value.background,
        ui.value.rounded
      ), props.class)
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
