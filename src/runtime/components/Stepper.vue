<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { StepperRootProps, StepperRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/stepper'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'
import type { DynamicSlots } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { stepper: Partial<typeof theme> } }

const stepper = tv({ extend: tv(theme), ...(appConfig.ui?.stepper || {}) })

type StepperVariants = VariantProps<typeof stepper>

export interface StepperItem {
  slot?: string
  value?: string
  title?: string
  description?: string
  icon?: string
  content?: string
  disabled?: boolean
}

export interface StepperProps<T extends StepperItem> extends Pick<StepperRootProps, 'linear'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  items: T[]
  size?: StepperVariants['size']
  color?: StepperVariants['color']
  orientation?: StepperVariants['orientation']
  /**
   * The value of the step that should be active when initially rendered. Use when you do not need to control the state of the steps.
   */
  defaultValue?: string | number
  disabled?: boolean
  ui?: Partial<typeof stepper.slots>
  class?: any
}

export type StepperEmits<T> = Omit<StepperRootEmits, 'update:modelValue'> & {
  next: [payload: T]
  prev: [payload: T]
}

type SlotProps<T extends StepperItem> = (props: { item: T }) => any

export type StepperSlots<T extends StepperItem> = {
  indicator: SlotProps<T>
  title: SlotProps<T>
  description: SlotProps<T>
  content: SlotProps<T>
} & DynamicSlots<T, SlotProps<T>>

extendDevtoolsMeta({ example: 'StepperExample' })
</script>

<script setup lang="ts" generic="T extends StepperItem">
import { computed } from 'vue'
import { StepperRoot, StepperItem, StepperTrigger, StepperIndicator, StepperSeparator, StepperTitle, StepperDescription, useForwardProps } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import UIcon from './Icon.vue'

const props = withDefaults(defineProps<StepperProps<T>>(), {
  linear: true
})
const emits = defineEmits<StepperEmits<T>>()
const slots = defineSlots<StepperSlots<T>>()

const modelValue = defineModel<string | number>()

const rootProps = useForwardProps(reactivePick(props, 'as', 'orientation', 'linear'))

const ui = computed(() => stepper({
  orientation: props.orientation,
  size: props.size,
  color: props.color
}))

const currentStepIndex = computed({
  get() {
    const value = modelValue.value ?? props.defaultValue

    return ((typeof value === 'string')
      ? props.items.findIndex(item => item.value === value)
      : value) ?? 0
  },
  set(value: number) {
    modelValue.value = props.items?.[value]?.value ?? value
  }
})

const currentStep = computed(() => props.items?.[currentStepIndex.value] as T)
const hasNext = computed(() => currentStepIndex.value < props.items?.length - 1)
const hasPrev = computed(() => currentStepIndex.value > 0)

defineExpose({
  next() {
    if (hasNext.value) {
      currentStepIndex.value += 1
      emits('next', currentStep.value)
    }
  },
  prev() {
    if (hasPrev.value) {
      currentStepIndex.value -= 1
      emits('prev', currentStep.value)
    }
  },
  hasNext,
  hasPrev
})
</script>

<template>
  <StepperRoot v-bind="rootProps" v-model="currentStepIndex" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <div :class="ui.header({ class: props.ui?.header })">
      <StepperItem
        v-for="(item, count) in items"
        :key="item.value ?? count"
        :step="count"
        :disabled="item.disabled || props.disabled"
        :class="ui.item({ class: props.ui?.item })"
      >
        <div :class="ui.container({ class: props.ui?.container })">
          <StepperTrigger :class="ui.trigger({ class: props.ui?.trigger })">
            <StepperIndicator :class="ui.indicator({ class: props.ui?.indicator })">
              <slot name="indicator" :item="item">
                <UIcon v-if="item.icon" :name="item.icon" :class="ui.icon({ class: props.ui?.indicator })" />
                <template v-else>
                  {{ count + 1 }}
                </template>
              </slot>
            </StepperIndicator>
          </StepperTrigger>

          <StepperSeparator
            v-if="count < items.length - 1"
            :class="ui.separator({ class: props.ui?.separator })"
          />
        </div>

        <div :class="ui.wrapper({ class: props.ui?.wrapper })">
          <StepperTitle :class="ui.title({ class: props.ui?.title })">
            <slot name="title" :item="currentStep">
              {{ item.title }}
            </slot>
          </StepperTitle>
          <StepperDescription :class="ui.description({ class: props.ui?.description })">
            <slot name="description" :item="currentStep">
              {{ item.description }}
            </slot>
          </StepperDescription>
        </div>
      </StepperItem>
    </div>

    <div v-if="currentStep?.content || !!slots.content || (currentStep?.slot && !!slots[currentStep.slot]) || (currentStep?.value && !!slots[currentStep.value])" :class="ui.content({ class: props.ui?.description })">
      <slot
        :name="!!slots[currentStep?.slot ?? currentStep.value] ? currentStep.slot ?? currentStep.value : 'content'"
        :item="currentStep"
      >
        {{ currentStep?.content }}
      </slot>
    </div>
  </StepperRoot>
</template>
