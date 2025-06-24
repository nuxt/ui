<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/timeline'
import type { AvatarProps } from '../types'
import type { DynamicSlots, ComponentConfig } from '../types/utils'

type Timeline = ComponentConfig<typeof theme, AppConfig, 'timeline'>

export interface TimelineItem {
  date?: string
  title?: string
  description?: string
  icon?: string
  avatar?: AvatarProps
  value?: string | number
  slot?: string
  class?: any
  ui?: Pick<Timeline['slots'], 'item' | 'container' | 'indicator' | 'separator' | 'wrapper' | 'date' | 'title' | 'description'>
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
   * @defaultValue 'vertical'
   */
  orientation?: Timeline['variants']['orientation']
  defaultValue?: string | number
  reverse?: boolean
  class?: any
  ui?: Timeline['slots']
}

type SlotProps<T extends TimelineItem> = (props: { item: T }) => any

export type TimelineSlots<T extends TimelineItem = TimelineItem> = {
  indicator: SlotProps<T>
  date: SlotProps<T>
  title: SlotProps<T>
  description: SlotProps<T>
} & DynamicSlots<T, 'indicator' | 'date' | 'title' | 'description', { item: T }>

</script>

<script setup lang="ts" generic="T extends TimelineItem">
import { computed } from 'vue'
import { Primitive, Separator } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import UAvatar from './Avatar.vue'

const props = withDefaults(defineProps<TimelineProps<T>>(), {
  orientation: 'vertical'
})
const slots = defineSlots<TimelineSlots<T>>()

const modelValue = defineModel<string | number>()

const appConfig = useAppConfig() as Timeline['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.timeline || {}) })({
  orientation: props.orientation,
  size: props.size,
  color: props.color,
  reverse: props.reverse
}))

const currentStepIndex = computed(() => {
  const value = modelValue.value ?? props.defaultValue

  if (typeof value === 'string') {
    return props.items.findIndex(item => item.value === value) ?? -1
  }

  if (props.reverse) {
    return value != null ? props.items.length - 1 - value : -1
  } else {
    return value ?? -1
  }
})

function getItemState(index: number): 'active' | 'completed' | undefined {
  if (currentStepIndex.value === -1) return undefined
  if (index === currentStepIndex.value) return 'active'

  if (props.reverse) {
    return index > currentStepIndex.value ? 'completed' : undefined
  } else {
    return index < currentStepIndex.value ? 'completed' : undefined
  }
}
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div
      v-for="(item, index) in items"
      :key="item.value ?? index"
      :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class] })"
      :data-state="getItemState(index)"
    >
      <div :class="ui.container({ class: [props.ui?.container, item.ui?.container] })">
        <UAvatar :size="size" :icon="item.icon" v-bind="typeof item.avatar === 'object' ? item.avatar : {}" :class="ui.indicator({ class: [props.ui?.indicator, item.ui?.indicator] })" :ui="{ icon: 'text-inherit', fallback: 'text-inherit' }">
          <slot :name="((item.slot ? `${item.slot}-indicator` : 'indicator') as keyof TimelineSlots<T>)" :item="(item as Extract<T, { slot: string; }>)" />
        </UAvatar>

        <Separator
          v-if="index < items.length - 1"
          :class="ui.separator({ class: [props.ui?.separator, item.ui?.separator] })"
          :orientation="props.orientation"
        />
      </div>

      <div :class="ui.wrapper({ class: [props.ui?.wrapper, item.ui?.wrapper] })">
        <div v-if="item.date" :class="ui.date({ class: [props.ui?.date, item.ui?.date] })">
          <slot :name="((item.slot ? `${item.slot}-date` : 'date') as keyof TimelineSlots<T>)" :item="(item as Extract<T, { slot: string; }>)">
            {{ item.date }}
          </slot>
        </div>
        <div v-if="item.title || !!slots.title" :class="ui.title({ class: [props.ui?.title, item.ui?.title] })">
          <slot :name="((item.slot ? `${item.slot}-title` : 'title') as keyof TimelineSlots<T>)" :item="(item as Extract<T, { slot: string; }>)">
            {{ item.title }}
          </slot>
        </div>
        <div v-if="item.description || !!slots.description" :class="ui.description({ class: [props.ui?.description, item.ui?.description] })">
          <slot :name="((item.slot ? `${item.slot}-description` : 'description') as keyof TimelineSlots<T>)" :item="(item as Extract<T, { slot: string; }>)">
            {{ item.description }}
          </slot>
        </div>
      </div>
    </div>
  </Primitive>
</template>
