<template>
  <component
    :is="$attrs.onSubmit ? 'form' : as"
    :class="cardClass"
    v-bind="attrs"
  >
    <div v-if="$slots.header" :class="[ui.header.base, ui.header.padding, ui.header.background]">
      <slot name="header" />
    </div>
    <div :class="[ui.body.base, ui.body.padding, ui.body.background]">
      <slot />
    </div>
    <div v-if="$slots.footer" :class="[ui.footer.base, ui.footer.padding, ui.footer.background]">
      <slot name="footer" />
    </div>
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
import { card } from '#ui/ui.config'

const config = mergeConfig<typeof card>(appConfig.ui.strategy, appConfig.ui.card, card)

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
    const { ui, attrs, attrsClass } = useUI('card', props.ui, config)

    const cardClass = computed(() => {
      return twMerge(twJoin(
        ui.value.base,
        ui.value.rounded,
        ui.value.divide,
        ui.value.ring,
        ui.value.shadow,
        ui.value.background
      ), attrsClass)
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      cardClass
    }
  }
})
</script>
