<template>
  <ol :class="ui.base" v-bind="attrs">
    <template v-for="(wrapper, key) in computedSteps" :key="key">
      <li :class="ui.container">
        <div :class="ui.step">
          <div :class="ui.indicator">
            <div v-if="hasSeparators" :class="ui.separator.wrapper">
              <div :class="[ui.separator.base, ui.separator.color, key < 1 ? 'invisible' : '']" />
              <div :class="[ui.separator.base, ui.separator.color, key > computedSteps.length - 2 ? 'invisible' : '']" class="ml-10" />
            </div>
            <div :class="ui.icon.wrapper">
              <component
                :is="wrapper.step.click || wrapper.step.to ? 'UButton' : 'div'"
                :class="[ui.icon.base, ui.icon.rounded, ui.icon.shadow, ui.icon.size, ui.icon.ring, getIconClass(wrapper)]"
                type="button"
                variant="ghost"
                v-bind="omit(wrapper.step, ['label', 'click', 'icon'])"
                @click="wrapper.step.click"
              >
                <UIcon v-if="wrapper.step.icon" :name="wrapper.step.icon" />
                <div v-else>
                  {{ key + 1 }}
                </div>
              </component>
            </div>
          </div>

          <div :class="[ui.label.base, ui.label.size, getLabelClass(wrapper)]">
            {{ wrapper.step.label }}
          </div>
        </div>
      </li>
    </template>
  </ol>
</template>

<script lang="ts">
import { computed, defineComponent, toRef } from 'vue'
import type { ComputedRef, PropType } from 'vue'
import { twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { mergeConfig, omit } from '../../utils'
import { Strategy, LadderSize, LadderStep, LadderStepWrapper, LadderStepColor } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { ladder } from '#ui/ui.config'
import UButton from './Link.vue'

const config = mergeConfig<typeof ladder>(appConfig.ui.strategy, appConfig.ui.ladder, ladder)

export default defineComponent({
  components: {
    UButton
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    steps: {
      type: Array as PropType<String[] | LadderStep[]>,
      default: () => []
    },
    separators: {
      type: Boolean,
      default: true
    },
    color: {
      type: String as PropType<LadderStepColor>,
      default: () => config.default.color,
      validator (value: string) {
        return [...appConfig.ui.colors, 'gray'].includes(value)
      }
    },
    inactiveColor: {
      type: String as PropType<LadderStepColor>,
      default: () => config.default.inactiveColor,
      validator (value: string) {
        return [...appConfig.ui.colors, 'gray'].includes(value)
      }
    },
    click: {
      type: Boolean,
      default: false
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: undefined
    },
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const { ui, attrs } = useUI('ladder', toRef(props, 'ui'), config, toRef(props, 'class'))

    const hasSeparators = computed(() => props.separators)

    function getIconClass (wrapper: LadderStepWrapper) {
      const color = {
        key: 'inactive',
        name: wrapper.step.inactiveColor ?? props.inactiveColor
      }

      if (wrapper.isActive) {
        color.key = 'active'
        color.name = wrapper.step.color ?? props.color
      }

      return twJoin(
        ui.value.icon[color.key].background.replaceAll('{color}', color.name),
        ui.value.icon[color.key].ring.replaceAll('{color}', color.name),
        ui.value.icon[color.key].color.replaceAll('{color}', color.name),
        ui.value.icon[color.key].shadow
      )
    }

    function getLabelClass (wrapper: LadderStepWrapper) {
      const color = {
        key: 'inactive',
        name: wrapper.step.inactiveColor ?? props.inactiveColor
      }

      if (wrapper.isActive) {
        color.key = 'active'
        color.name = wrapper.step.color ?? props.color
      }

      return twJoin(
        ui.value.label[color.key].replaceAll('{color}', color.name)
      )
    }

    const ladderStepActiveIconClass = computed(() => {
      return twJoin(
        ui.value.icon.active.background.replaceAll('{color}', props.color),
        ui.value.icon.active.ring.replaceAll('{color}', props.color),
        ui.value.icon.active.color.replaceAll('{color}', props.color),
        ui.value.icon.active.shadow
      )
    })

    const ladderStepInactiveIconClass = computed(() => {
      return twJoin(
        ui.value.icon.inactive.background.replaceAll('{color}', props.inactiveColor),
        ui.value.icon.inactive.ring.replaceAll('{color}', props.inactiveColor),
        ui.value.icon.inactive.color.replaceAll('{color}', props.inactiveColor),
        ui.value.icon.inactive.shadow
      )
    })

    const computedSteps: ComputedRef<LadderStepWrapper[]> = computed(() => {
      return props.steps.map((receivedStep, index: number) => {
        const step = typeof receivedStep === 'string' ? { label: receivedStep } : receivedStep

        const isActive = index === props.modelValue

        if (isActive) {
          step.click = false
        } else if (props.click || step.click === true) {
          step.click = () => emit('update:modelValue', index)
        }

        return { step, isActive }
      })
    })

    return {
      attrs,
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      hasSeparators,
      getIconClass,
      getLabelClass,
      ladderStepActiveIconClass,
      ladderStepInactiveIconClass,
      computedSteps,
      omit
    }
  }
})
</script>
