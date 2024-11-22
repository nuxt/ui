<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { StepperRootProps, StepperRootEmits } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/stepper'
import type { DynamicSlots } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { stepper: Partial<typeof theme> } }

const stepper = tv({ extend: tv(theme), ...(appConfig.ui?.stepper || {}) })

type _StepperVariants = VariantProps<typeof stepper>

export interface StepperItem {
  slot?: string
  title?: string
  description?: string
  icon: string
  content: string
}
export interface StepperProps<T extends StepperItem> extends StepperRootProps {
  items: Array<T>
  class?: any
  ui?: Partial<typeof stepper.slots>
}

export interface StepperEmits extends StepperRootEmits {}

type SlotProps<T extends StepperItem> = (props: { item: T }) => any

export type StepperSlots<T extends StepperItem> = {} & DynamicSlots<T, SlotProps<T>>
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

// eslint-disable-next-line vue/no-dupe-keys
const ui = stepper()

const currentStepIndex = ref(0)
const currentStep = computed(() => props.items?.[currentStepIndex.value] ?? props.items?.[0])

const modelValue = defineModel<string>({
  get: () => currentStep.value.slot,
  set(value: number) {
    return props.items?.[value]?.slot
  }
})
</script>

<template>
  <StepperRoot v-bind="rootProps" v-model="currentStepIndex" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <div :class="ui.header({ class: props.ui?.header })">
      <StepperItem v-for="item, count in items" :key="item.slot" :step="count" :class="ui.item({ class: props.ui?.item })">
        <StepperTrigger :class="ui.trigger({ class: props.ui?.trigger })">
          <StepperIndicator :class="ui.indicator({ class: props.ui?.indicator })">
            <UIcon v-if="item.icon" :name="item.icon" />
            <p v-else>
              {{ count + 1 }}
            </p>
          </StepperIndicator>
        </StepperTrigger>

        <StepperSeparator
          v-if="item.slot !== items[items.length - 1]?.slot"
          :class="ui.separator({ class: props.ui?.separator })"
        />

        <div>
          <StepperTitle
            :class="ui.title({ class: props.ui?.title })"
          >
            {{ item.title }}
          </StepperTitle>
          <StepperDescription
            :class="ui.description({ class: props.ui?.description })"
          >
            {{ item.description }}
          </StepperDescription>
        </div>
      </StepperItem>
    </div>
    <slot :name="modelValue || 'content'" :item="currentStep">
      {{ currentStep.content }}
    </slot>
  </StepperRoot>
</template>
