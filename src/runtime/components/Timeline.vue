<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/timeline'
import type { DynamicSlots, ComponentConfig } from '../types/utils'

type Timeline = ComponentConfig<typeof theme, AppConfig, 'timeline'>

export interface TimelineItem {
  slot?: string
  value?: string | number
  title?: string
  description?: string
  /**
   * @IconifyIcon
   */
  icon?: string
  content?: string
  disabled?: boolean
  class?: any
  ui?: Pick<Timeline['slots'], 'item' | 'container' | 'trigger' | 'indicator' | 'icon' | 'separator' | 'wrapper' | 'title' | 'description'>
  [key: string]: any
}

export interface TimelineProps<T extends TimelineItem = TimelineItem> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  items: T[]
  /**
   * @defaultValue 'md'
   */
  size?: Timeline['variants']['size']
  /**
   * @defaultValue 'primary'
   */
  color?: Timeline['variants']['color']
  /**
   * The orientation of the Timeline.
   * @defaultValue 'horizontal'
   */
  orientation?: Timeline['variants']['orientation']
  disabled?: boolean
  class?: any
  ui?: Timeline['slots']
}

type SlotProps<T extends TimelineItem> = (props: { item: T }) => any

export type TimelineSlots<T extends TimelineItem = TimelineItem> = {
  indicator: SlotProps<T>
  title: SlotProps<T>
  description: SlotProps<T>
} & DynamicSlots<T>
</script>

<script setup lang="ts" generic="T extends TimelineItem">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

const props = withDefaults(defineProps<TimelineProps<T>>(), {
  orientation: 'vertical',
  linear: true
})

const modelValue = defineModel<string | number>()

const appConfig = useAppConfig() as Timeline['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.timeline || {}) })({
  orientation: props.orientation,
  size: props.size,
  color: props.color
}))

const currentStepIndex = computed({
  get() {
    const value = modelValue.value

    return ((typeof value === 'string')
      ? props.items.findIndex(item => item.value === value)
      : value) ?? 0
  },
  set(value: number) {
    modelValue.value = props.items?.[value]?.value ?? value
  }
})
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div :class="ui.header({ class: props.ui?.header })">
      <div
        v-for="(item, count) in items"
        :key="item.value ?? count"
        :step="count"
        :disabled="item.disabled || props.disabled"
        :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class] })"
        :data-state="count < currentStepIndex ? 'completed' : count  === currentStepIndex ? 'active' : undefined"
      >
        <div :class="ui.container({ class: [props.ui?.container, item.ui?.container] })">
          <div :class="ui.trigger({ class: [props.ui?.trigger, item.ui?.trigger] })">
            <div :class="ui.indicator({ class: [props.ui?.indicator, item.ui?.indicator] })">
              <slot name="indicator" :item="item">
                <UIcon v-if="item.icon" :name="item.icon" :class="ui.icon({ class: [props.ui?.icon, item.ui?.icon] })" />
                <template v-else>
                  {{ count + 1 }}
                </template>
              </slot>
            </div>
          </div>

          <USeparator
            v-if="count < items.length - 1"
            :class="ui.separator({ class: [props.ui?.separator, item.ui?.separator] })"
            :orientation="props.orientation"
          />
        </div>

        <div :class="ui.wrapper({ class: [props.ui?.wrapper, item.ui?.wrapper] })">
          <h3 as="div" :class="ui.title({ class: [props.ui?.title, item.ui?.title] })">
            <slot name="title" :item="item">
              {{ item.title }}
            </slot>
          </h3>
          <div :class="ui.description({ class: [props.ui?.description, item.ui?.description] })">
            <slot name="description" :item="item">
              {{ item.description }}
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Primitive>
</template>
