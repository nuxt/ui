<template>
  <component :is="as" :class="containerClass" v-bind="attrs">
    <slot />
  </component>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { omit } from '../../utils/lodash'
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
    as: {
      type: String,
      default: 'div'
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.container>>,
      default: () => ({})
    }
  },
  setup (props, { attrs }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.container>>(() => defuTwMerge({}, props.ui, appConfig.ui.container))

    const containerClass = computed(() => {
      return twMerge(twJoin(
        ui.value.base,
        ui.value.padding,
        ui.value.constrained
      ), attrs.class as string)
    })

    return {
      attrs: computed(() => omit(attrs, ['class'])),
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      containerClass
    }
  }
})
</script>
