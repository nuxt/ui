<template>
  <component
    :is="$attrs.onSubmit ? 'form' : as"
    :class="cardClass"
    v-bind="attrs"
  >
    <div v-if="$slots.header" :class="[_ui.header.base, _ui.header.padding, _ui.header.background]">
      <slot name="header" />
    </div>
    <div v-if="$slots.default" :class="[_ui.body.base, _ui.body.padding, _ui.body.background]">
      <slot />
    </div>
    <div v-if="$slots.footer" :class="[_ui.footer.base, _ui.footer.padding, _ui.footer.background]">
      <slot name="footer" />
    </div>
  </component>
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { card } from '#ui/ui.config'

const config = mergeConfig<typeof card>(appConfig.ui.strategy, appConfig.ui.card, card)

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
      type: Object as PropType<Partial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  setup (props) {
    const { ui, attrs } = useUI('card', toRef(props, 'ui'), config)

    const cardClass = computed(() => {
      return twMerge(twJoin(
        ui.value.base,
        ui.value.rounded,
        ui.value.divide,
        ui.value.ring,
        ui.value.shadow,
        ui.value.background
      ), props.class)
    })

    return {
      _ui: ui,
      attrs,
      cardClass
    }
  }
})
</script>
