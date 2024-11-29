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
  title?: string
  description?: string
  icon: string
  content: string
}
export interface StepperProps<T extends StepperItem> extends Omit<StepperRootProps, 'defaultValue'> {
  items: Array<T>
  class?: any
  size?: StepperVariants['size']
  color?: StepperVariants['color']
  ui?: Partial<typeof stepper.slots>
  defaultValue?: string
}

export type StepperEmits<T> = StepperRootEmits & {
  next: [payload: T]
  previous: [payload: T]
}

type SlotProps<T extends StepperItem> = (props: { item: T }) => any

export type StepperSlots<T extends StepperItem> = {} & DynamicSlots<T, SlotProps<T>>

extendDevtoolsMeta({ example: 'StepperExample' })
</script>

<script setup lang="ts" generic="T extends StepperItem">
import { computed, ref } from 'vue'
import { StepperRoot, StepperItem, StepperTrigger, StepperIndicator, StepperSeparator, StepperTitle, StepperDescription, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import UIcon from './Icon.vue'

const props = defineProps<StepperProps<T>>()
const emits = defineEmits<StepperEmits>()
defineSlots<StepperSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props), emits)

const ui = computed(() => stepper({
  orientation: props.orientation,
  size: props.size,
  color: props.color
}))

const currentStepIndex = ref(props.items.findIndex(item => item.slot === props.defaultValue) ?? 0)
const currentStep = computed(() => props.items?.[currentStepIndex.value] ?? props.items?.[0])

const modelValue = defineModel<string>({
  get: () => currentStep.value.slot,
  set(value: number) {
    return props.items?.[value]?.slot
  }
})

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
      <StepperItem v-for="item, count in items" :key="item.slot" :step="count" :class="ui.item({ class: props.ui?.item })">
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
            v-if="item.slot !== items[items.length - 1]?.slot"
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
        :name="$slots[modelValue] ? modelValue : 'content'"
        :item="currentStep"
      >
        {{ currentStep.content }}
      </slot>
    </div>
  </StepperRoot>
</template>
