<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <slot />

    <span v-if="show" :class="chipClass">
      <slot name="content">
        {{ text }}
      </slot>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, toRef } from 'vue'
import type { PropType } from 'vue'
import { twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { ChipSize, ChipColor, ChipPosition, Strategy, DeepPartial } from '../../types/index'
// @ts-expect-error
import appConfig from '#build/app.config'
import { chip } from '#ui/ui.config'

const config = mergeConfig<typeof chip>(appConfig.ui.strategy, appConfig.ui.chip, chip)

export default defineComponent({
  inheritAttrs: false,
  props: {
    size: {
      type: String as PropType<ChipSize>,
      default: () => config.default.size,
      validator(value: string) {
        return Object.keys(config.size).includes(value)
      }
    },
    color: {
      type: String as PropType<ChipColor>,
      default: () => config.default.color,
      validator(value: string) {
        return ['gray', ...appConfig.ui.colors].includes(value)
      }
    },
    position: {
      type: String as PropType<ChipPosition>,
      default: () => config.default.position,
      validator(value: string) {
        return Object.keys(config.position).includes(value)
      }
    },
    text: {
      type: [String, Number],
      default: null
    },
    inset: {
      type: Boolean,
      default: () => config.default.inset
    },
    show: {
      type: Boolean,
      default: true
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
    const { ui, attrs } = useUI('chip', toRef(props, 'ui'), config, toRef(props, 'class'))

    const chipClass = computed(() => {
      return twJoin(
        ui.value.base,
        ui.value.size[props.size],
        ui.value.position[props.position],
        props.inset ? null : ui.value.translate[props.position],
        ui.value.background.replaceAll('{color}', props.color)
      )
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      chipClass
    }
  }
})
</script>
