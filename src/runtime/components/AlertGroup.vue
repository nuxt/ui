<script lang="ts">
import theme from '#build/ui/alert-group'
import type { AppConfig } from '@nuxt/schema'
import type { AlertProps } from '@nuxt/ui'
import type { ComponentConfig } from '../types/tv'

type AlertGroup = ComponentConfig<typeof theme, AppConfig, 'alertGroup'>

export interface AlertGroupProps {
  items: AlertProps[]
  /**
   * @defaultValue false
   */
  expand?: boolean
  /**
   * @defaultValue 5
   */
  max?: number
  class?: any
  ui?: AlertGroup['slots']
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<AlertGroupProps>(), {
  expand: false,
  max: 5
})

const appConfig = useAppConfig() as AlertGroup['AppConfig']
const uiProp = useComponentUI('alertGroup', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.alertGroup || {}) })({}))

const hovered = ref(false)
const expanded = computed(() => props.expand || hovered.value)
</script>

<template>
  <div
    :data-expanded="expanded"
    data-slot="root"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @focusin="hovered = true"
    @focusout="hovered = false"
  >
    <UAlert
      v-for="(item, index) in props.items"
      :key="`alert-${index}`"
      v-bind="item"
      :tabindex="0"
      :data-expanded="expanded"
      :data-front="index === 0"
      :class="ui.items({ class: [uiProp?.items, props.class] })"
      :style="{
        width: expanded ? '100%' : `${Math.max(0, 100 - index * 3)}%`,
        marginTop: expanded || index === 0 ? '0' : (index >= props.max ? '-51px' : '-33px'),
        zIndex: props.items.length - index,
        maxHeight: !expanded && index !== 0 ? '51px' : undefined
      }"
    />
  </div>
</template>
