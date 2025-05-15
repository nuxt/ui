<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/timeline'
import type { ComponentConfig } from '../types/utils'

type Timeline = ComponentConfig<typeof theme, AppConfig, 'timeline'>

export interface TimelineItem {
  title?: string
  content?: string
  icon?: string
  class?: string
  ui?: Pick<Timeline['slots'], 'item' | 'itemIcon' | 'itemSeparator'>
}

export interface TimelineProps {
  as?: any
  items?: TimelineItem[]
  orientation?: 'horizontal' | 'vertical'
  class?: any
  ui?: Timeline['slots']
}

export interface TimelineEmits {}

export interface TimelineSlots {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<TimelineProps>(), {
  as: 'div',
  orientation: 'vertical'
})
const emits = defineEmits<TimelineEmits>()
const slots = defineSlots<TimelineSlots>()

const appConfig = useAppConfig() as Timeline['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.timeline || {}) })())
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-for="(item, index) in items" :key="index" :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class] })">
      <USeparator :class="ui.itemSeparator({ class: [props.ui?.itemSeparator, item.ui?.itemSeparator] })" decorative :orientation="orientation" />
      <div>
        <h3>{{ item.title }}</h3>
        <div>
          {{ item.content }}
        </div>
      </div>
    </div>
  </Primitive>
</template>
