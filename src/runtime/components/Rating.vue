<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/rating'
import type { ComponentConfig } from '../types/utils'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { reactivePick } from '@vueuse/core'

type Rating = ComponentConfig<typeof theme, AppConfig, 'rating'>

export interface RatingProps extends PrimitiveProps {
  max?: number
  id?: string
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
  icon?: string
  class?: any
  ui?: Rating['slots']
}

export interface RatingEmits {}

export interface RatingSlots {}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppConfig, useLocale } from '#imports'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<RatingProps>(), {
  max: 5
})

const modelValue = defineModel<number>({ default: 0 })
const hoveredValue = ref(0)

const appConfig = useAppConfig() as Rating['AppConfig']
const { dir } = useLocale()

const rootProps = reactivePick(props, ['class', 'as', 'asChild'])

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.rating || {}) })({ orientation: props.orientation }))
</script>

<template>
  <Primitive
    v-bind="rootProps"
    :id="id"
    :class="ui.root()"
    role="radiogroup"
    :dir="dir"
    :aria-orientation="orientation"
    @mouseleave="hoveredValue = 0"
  >
    <UIcon
      v-for="i in max"
      :key="i"
      :icon
      :name="icon || 'i-lucide-star'"
      :data-state="hoveredValue > 0 && i <= hoveredValue || hoveredValue === 0 && i <= modelValue ? 'active' : undefined"
      :class="ui.icon()"
      :aria-labeledby="id"
      :aria-checked="i <= modelValue"
      :aria-disabled="disabled"
      :aria-label="`${i} stars`"
      @mouseenter="hoveredValue = i"
      @click="modelValue = i"
    />
  </Primitive>
</template>
