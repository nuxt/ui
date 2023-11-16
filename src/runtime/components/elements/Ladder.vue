<template>
  <ol :class="ladderClass" v-bind="attrs">
    <template v-for="(step, key) in computedSteps" :key="key">
      <li :class="ladderStepContainerClass">
        <div :class="ladderStepClass">
          <div :class="ladderStepIndicatorClass">
            <div v-if="hasSeparators" :class="ladderStepSeparatorsWrapperClass">
              <div :class="[ladderStepSeparatorClass, key < 1 ? 'invisible' : '']" />
              <div :class="[ladderStepSeparatorClass, key > computedSteps.length - 2 ? 'invisible' : '']" />
            </div>
            <div :class="ladderStepIconWrapperClass">
              <component
                :is="step.step.click || step.step.to ? 'UButton' : 'div'"
                :class="[ladderStepIconClass, step.isActive ? ladderStepActiveIconClass : ladderStepInactiveIconClass]"
                type="button"
                variant="ghost"
                v-bind="omit(step.step, ['label', 'click', 'icon'])"
                @click="step.step.click"
              >
                <UIcon v-if="step.step.icon" :name="step.step.icon" />
                <div v-else>
                  {{ key + 1 }}
                </div>
              </component>
            </div>
          </div>

          <div :class="[ladderStepLabelClass, step.isActive ? ladderStepActiveLabelClass : ladderStepInactiveLabelClass]">
            {{ step.step.label }}
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
    size: {
      type: String as PropType<LadderSize>,
      default: () => config.default.size,
      validator (value: string) {
        return Object.keys(config.label.size).includes(value)
      }
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

    const ladderClass = computed(() => {
      return twJoin(
        ui.value.base
      )
    })

    const ladderStepContainerClass = computed(() => {
      return twJoin(
        ui.value.container
      )
    })

    const ladderStepClass = computed(() => {
      return twJoin(
        ui.value.step
      )
    })

    const ladderStepIndicatorClass = computed(() => {
      return twJoin(
        ui.value.indicator
      )
    })

    const ladderStepSeparatorsWrapperClass = computed(() => {
      return twJoin(
        ui.value.separator.wrapper
      )
    })

    const ladderStepSeparatorClass = computed(() => {
      return twJoin(
        ui.value.separator.base,
        ui.value.separator.color.replaceAll('{color}', props.inactiveColor),
        ui.value.separator.size[props.size]
      )
    })

    const ladderStepIconWrapperClass = computed(() => {
      return twJoin(
        ui.value.icon.wrapper
      )
    })

    const ladderStepIconClass = computed(() => {
      return twJoin(
        ui.value.icon.base,
        ui.value.icon.rounded,
        ui.value.icon.shadow,
        ui.value.icon.size[props.size]
      )
    })

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

    const ladderStepLabelClass = computed(() => {
      return twJoin(
        ui.value.label.base,
        ui.value.label.size[props.size]
      )
    })

    const ladderStepActiveLabelClass = computed(() => {
      return twJoin(
        ui.value.label.active.replaceAll('{color}', props.color)
      )
    })

    const ladderStepInactiveLabelClass = computed(() => {
      return twJoin(
        ui.value.label.inactive.replaceAll('{color}', props.inactiveColor)
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
      hasSeparators,
      ladderClass,
      ladderStepContainerClass,
      ladderStepClass,
      ladderStepIndicatorClass,
      ladderStepSeparatorsWrapperClass,
      ladderStepSeparatorClass,
      ladderStepIconWrapperClass,
      ladderStepIconClass,
      ladderStepActiveIconClass,
      ladderStepInactiveIconClass,
      ladderStepLabelClass,
      ladderStepActiveLabelClass,
      ladderStepInactiveLabelClass,
      computedSteps,
      omit
    }
  }
})
</script>
