<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { StepperRootProps, StepperRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/stepper'
import type { IconProps } from '../types'
import type { DynamicSlots } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type Stepper = ComponentConfig<typeof theme, AppConfig, 'stepper'>

export interface StepperItem {
  slot?: string
  value?: string | number
  title?: string
  description?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  content?: string
  disabled?: boolean
  class?: any
  ui?: Pick<Stepper['slots'], 'item' | 'container' | 'trigger' | 'indicator' | 'icon' | 'separator' | 'wrapper' | 'title' | 'description'>
  [key: string]: any
}

export interface StepperProps<T extends StepperItem = StepperItem> extends Pick<StepperRootProps, 'linear'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  items: T[]
  /**
   * @defaultValue 'md'
   */
  size?: Stepper['variants']['size']
  /**
   * @defaultValue 'primary'
   */
  color?: Stepper['variants']['color']
  /**
   * The orientation of the stepper.
   * @defaultValue 'horizontal'
   */
  orientation?: Stepper['variants']['orientation']
  /**
   * The value of the step that should be active when initially rendered. Use when you do not need to control the state of the steps.
   */
  defaultValue?: string | number
  disabled?: boolean
  class?: any
  ui?: Stepper['slots']
}

export type StepperEmits<T extends StepperItem = StepperItem> = Omit<StepperRootEmits, 'update:modelValue'> & {
  next: [value: T]
  prev: [value: T]
}

type SlotProps<T extends StepperItem> = (props: { item: T }) => any

export type StepperSlots<T extends StepperItem = StepperItem> = {
  indicator(props: { item: T, ui: Stepper['ui'] }): any
  title: SlotProps<T>
  description: SlotProps<T>
  content: SlotProps<T>
} & DynamicSlots<T>

</script>

<script setup lang="ts" generic="T extends StepperItem">
import { computed } from 'vue'
import { StepperRoot, StepperItem, StepperTrigger, StepperIndicator, StepperSeparator, StepperTitle, StepperDescription, useForwardProps } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig, useComponentUI } from '#imports'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

const props = withDefaults(defineProps<StepperProps<T>>(), {
  orientation: 'horizontal',
  linear: true
})
const emits = defineEmits<StepperEmits<T>>()
const slots = defineSlots<StepperSlots<T>>()

const modelValue = defineModel<string | number>()

const appConfig = useAppConfig() as Stepper['AppConfig']
const uiProp = useComponentUI('stepper', props)

const rootProps = useForwardProps(reactivePick(props, 'as', 'orientation', 'linear'))

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.stepper || {}) })({
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

const currentStep = computed(() => props.items?.[currentStepIndex.value])
const hasNext = computed(() => currentStepIndex.value < props.items?.length - 1)
const hasPrev = computed(() => currentStepIndex.value > 0)

defineExpose({
  next() {
    if (hasNext.value) {
      currentStepIndex.value += 1
      emits('next', currentStep.value as T)
    }
  },
  prev() {
    if (hasPrev.value) {
      currentStepIndex.value -= 1
      emits('prev', currentStep.value as T)
    }
  },
  hasNext,
  hasPrev
})
</script>

<template>
  <StepperRoot v-bind="rootProps" v-model="currentStepIndex" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div data-slot="header" :class="ui.header({ class: uiProp?.header })">
      <StepperItem
        v-for="(item, count) in items"
        :key="item.value ?? count"
        :step="count"
        :disabled="item.disabled || props.disabled"
        data-slot="item"
        :class="ui.item({ class: [uiProp?.item, item.ui?.item, item.class] })"
      >
        <div data-slot="container" :class="ui.container({ class: [uiProp?.container, item.ui?.container] })">
          <StepperTrigger data-slot="trigger" :class="ui.trigger({ class: [uiProp?.trigger, item.ui?.trigger] })">
            <StepperIndicator data-slot="indicator" :class="ui.indicator({ class: [uiProp?.indicator, item.ui?.indicator] })">
              <slot name="indicator" :item="item" :ui="ui">
                <UIcon v-if="item.icon" :name="item.icon" data-slot="icon" :class="ui.icon({ class: [uiProp?.icon, item.ui?.icon] })" />
                <template v-else>
                  {{ count + 1 }}
                </template>
              </slot>
            </StepperIndicator>
          </StepperTrigger>

          <StepperSeparator
            v-if="count < items.length - 1"
            data-slot="separator"
            :class="ui.separator({ class: [uiProp?.separator, item.ui?.separator] })"
          />
        </div>

        <div data-slot="wrapper" :class="ui.wrapper({ class: [uiProp?.wrapper, item.ui?.wrapper] })">
          <StepperTitle as="div" data-slot="title" :class="ui.title({ class: [uiProp?.title, item.ui?.title] })">
            <slot name="title" :item="item">
              {{ item.title }}
            </slot>
          </StepperTitle>
          <StepperDescription as="div" data-slot="description" :class="ui.description({ class: [uiProp?.description, item.ui?.description] })">
            <slot name="description" :item="item">
              {{ item.description }}
            </slot>
          </StepperDescription>
        </div>
      </StepperItem>
    </div>

    <div v-if="currentStep?.content || !!slots.content || currentStep?.slot" data-slot="content" :class="ui.content({ class: uiProp?.content })">
      <slot
        :name="((currentStep?.slot || 'content') as keyof StepperSlots<T>)"
        :item="(currentStep as Extract<T, { slot: string }>)"
      >
        {{ currentStep?.content }}
      </slot>
    </div>
  </StepperRoot>
</template>
