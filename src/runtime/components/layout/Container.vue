<template>
  <component :is="as" :class="containerClass" v-bind="attrs">
    <slot />
  </component>
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
import { container } from '#ui/ui.config'

const config = mergeConfig<typeof container>(appConfig.ui.strategy, appConfig.ui.container, container)

export default defineComponent({
  inheritAttrs: false,
  props: {
    as: {
      type: String,
      default: 'div'
    },
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  setup (props) {
    const { ui, attrs, attrsClass } = useUI('container', props.ui, config)

    const containerClass = computed(() => {
      return twMerge(twJoin(
        ui.value.base,
        ui.value.padding,
        ui.value.constrained
      ), attrsClass)
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      containerClass
    }
  }
})
</script>
