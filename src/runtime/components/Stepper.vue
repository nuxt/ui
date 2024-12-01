<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { StepperRootProps, StepperRootEmits } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/stepper'
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
}

export interface StepperProps<T extends StepperItem> extends Omit<StepperRootProps, 'defaultValue' | 'modelValue'> {
  items: Array<T>
  class?: any
  size?: StepperVariants['size']
  color?: StepperVariants['color']
  ui?: Partial<typeof stepper.slots>
  defaultValue?: string | number
}

export type StepperEmits<T> = Omit<StepperRootEmits, 'update:modelValue'> & {
  next: [payload: T]
  previous: [payload: T]
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
import { StepperRoot, StepperItem, StepperTrigger, StepperIndicator, StepperSeparator, StepperTitle, StepperDescription } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import UIcon from './Icon.vue'

const props = defineProps<StepperProps<T>>()
const emits = defineEmits<StepperEmits<T>>()
defineSlots<StepperSlots<T>>()

const rootProps = reactivePick(props, 'linear', 'dir', 'items', 'as', 'asChild')

const ui = computed(() => stepper({
  orientation: props.orientation,
  size: props.size,
  color: props.color
}))

const modelValue = defineModel<string | number>()

const currentStepIndex = computed({
  get: () =>
    ((typeof modelValue.value === 'string')
      ? props.items.findIndex(item => item.value === modelValue.value)
      : modelValue.value)
    ?? 0,

  set(value: number) {
    modelValue.value = props.items?.[value]?.value ?? value
  }
})

const currentStep = computed(() => props.items?.[currentStepIndex.value] as T)
const hasNext = computed(() => currentStepIndex.value < props.items?.length - 1)
const hasPrevious = computed(() => currentStepIndex.value > 0)

defineExpose({
  next() {
    if (hasNext.value) {
      currentStepIndex.value += 1
      emits('next', currentStep.value)
    }
  },
  previous() {
    if (hasPrevious.value) {
      currentStepIndex.value -= 1
      emits('previous', currentStep.value)
    }
  },
  hasNext,
  hasPrevious
})
</script>

<template>
  <StepperRoot v-bind="rootProps" v-model="currentStepIndex" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <div :class="ui.header({ class: props.ui?.header })">
      <StepperItem v-for="item, count in items" :key="item.value ?? count" :step="count" :class="ui.item({ class: props.ui?.item })">
        <div class="relative">
          <StepperTrigger :class="ui.trigger({ class: props.ui?.trigger })">
            <StepperIndicator :class="ui.indicator({ class: props.ui?.indicator })">
              <slot name="indicator" :item="currentStep">
                <UIcon v-if="item.icon" :name="item.icon" :class="ui.icon({ class: props.ui?.indicator })" />
                <p v-else>
                  {{ count + 1 }}
                </p>
              </slot>
            </StepperIndicator>
          </StepperTrigger>

          <StepperSeparator
            v-if="count < items.length - 1"
            :class="ui.separator({ class: props.ui?.separator })"
          />
        </div>

        <div>
          <StepperTitle :class="ui.title({ class: props.ui?.title })">
            <slot name="title" :item="currentStep">
              {{ item.title }}
            </slot>
          </StepperTitle>
          <StepperDescription
            :class="ui.description({ class: props.ui?.description })"
          >
            <slot name="description" :item="currentStep">
              {{ item.description }}
            </slot>
          </StepperDescription>
        </div>
      </StepperItem>
    </div>

    <div :class="ui.content({ class: props.ui?.description })">
      <slot
        :name="$slots[currentStep?.slot ?? currentStep.value] ? currentStep.slot ?? currentStep.value : 'content'"
        :item="currentStep"
      >
        {{ currentStep?.content }}
      </slot>
    </div>
  </StepperRoot>
</template>
