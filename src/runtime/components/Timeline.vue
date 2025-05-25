<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/timeline'
import type { ComponentConfig, DynamicSlots } from '../types/utils'
import type { AvatarProps } from './Avatar.vue'

type Timeline = ComponentConfig<typeof theme, AppConfig, 'timeline'>

export interface TimelineItem {
  value?: string | number
  title?: string
  description?: string
  icon?: string
  avatar?: AvatarProps
  slot?: string
  class?: any
  ui?: Pick<Timeline['slots'], 'item' | 'itemContainer' | 'itemIndicatorWrapper' | 'itemIndicator' | 'itemIcon' | 'itemLeadingAvatar' | 'itemLeadingAvatarSize' | 'itemSeparator' | 'itemWrapper' | 'itemTitle' | 'itemDescription'>
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
  activeValue?: string | number
  class?: any
  ui?: Timeline['slots']
}

type SlotProps<T extends TimelineItem> = (props: { item: T }) => any

export type TimelineSlots<T extends TimelineItem = TimelineItem> = {
  indicator: SlotProps<T>
  title: SlotProps<T>
  description: SlotProps<T>
} & DynamicSlots<T, 'indicator' | 'title' | 'description', { item: T }>
</script>

<script setup lang="ts" generic="T extends TimelineItem">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import { Primitive, Separator } from 'reka-ui'

const props = withDefaults(defineProps<TimelineProps<T>>(), {
  orientation: 'vertical'
})

const appConfig = useAppConfig() as Timeline['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.timeline || {}) })({
  orientation: props.orientation,
  size: props.size,
  color: props.color
}))

const currentStepIndex = computed(
  () => ((typeof props.activeValue === 'string')
    ? props.items.findIndex(item => item.value === props.activeValue)
    : props.activeValue) ?? -1
)
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div :class="ui.header({ class: props.ui?.header })">
      <div
        v-for="(item, count) in items"
        :key="item.value ?? count"
        :step="count"
        :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class] })"
        :data-state="count < currentStepIndex ? 'completed' : count === currentStepIndex ? 'active' : undefined"
      >
        <div :class="ui.itemContainer({ class: [props.ui?.itemContainer, item.ui?.itemContainer] })">
          <div :class="ui.itemIndicatorWrapper({ class: [props.ui?.itemIndicatorWrapper, item.ui?.itemIndicatorWrapper] })">
            <div :class="ui.itemIndicator({ class: [props.ui?.itemIndicator, item.ui?.itemIndicator] })">
              <slot :name="item.slot ? `${item.slot}-indicator` : 'indicator'" :item="item">
                <UIcon v-if="item.icon" :name="item.icon" :class="ui.itemIcon({ class: [props.ui?.itemIcon, item.ui?.itemIcon] })" />
                <UAvatar v-else-if="item.avatar" :size="(item.ui?.itemLeadingAvatarSize || props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size']" :class="ui.itemLeadingAvatar({ class: [props.ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })" v-bind="item.avatar" />
                <template v-else>
                  {{ count + 1 }}
                </template>
              </slot>
            </div>
          </div>

          <Separator
            v-if="count < items.length - 1"
            :class="ui.itemSeparator({ class: [props.ui?.itemSeparator, item.ui?.itemSeparator] })"
            :orientation="props.orientation"
          />
        </div>

        <div :class="ui.itemWrapper({ class: [props.ui?.itemWrapper, item.ui?.itemWrapper] })">
          <div :class="ui.itemTitle({ class: [props.ui?.itemTitle, item.ui?.itemTitle] })">
            <slot :name="item.slot ? `${item.slot}-title` : 'title'" :item="item">
              {{ item.title }}
            </slot>
          </div>
          <div :class="ui.itemDescription({ class: [props.ui?.itemDescription, item.ui?.itemDescription] })">
            <slot :name="item.slot ? `${item.slot}-description` : 'description'" :item="item">
              {{ item.description }}
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Primitive>
</template>
