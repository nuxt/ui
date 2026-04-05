<script lang="ts">
import type { ShallowRef } from 'vue'
import type { DropdownMenuItem, TooltipProps } from '../types'
import type { EditorToolbarItem } from './EditorToolbar.vue'

export interface EditorToolbarItemRendererProps {
  item: EditorToolbarItem
  state: ShallowRef<{ active: boolean, disabled: boolean }>
  buttonProps: ShallowRef<Record<string, any>>
  dropdownItems: ShallowRef<DropdownMenuItem[][]>
  dropdownProps?: ShallowRef<Record<string, any> | undefined>
  tooltip?: TooltipProps
  onClick: (e: MouseEvent, item: EditorToolbarItem) => void
}
</script>

<script setup lang="ts">
import UButton from './Button.vue'
import UDropdownMenu from './DropdownMenu.vue'
import UTooltip from './Tooltip.vue'

defineProps<EditorToolbarItemRendererProps>()
</script>

<template>
  <UDropdownMenu
    v-if="('items' in item && item.items?.length)"
    v-bind="dropdownProps?.value"
    :items="dropdownItems.value"
  >
    <UTooltip v-if="tooltip" :disabled="state.value.disabled" v-bind="{ ...(tooltip || {}) }">
      <UButton :active="state.value.active" :disabled="state.value.disabled" v-bind="buttonProps.value" @click="onClick($event, item)" />
    </UTooltip>

    <UButton v-else :active="state.value.active" :disabled="state.value.disabled" v-bind="buttonProps.value" @click="onClick($event, item)" />
  </UDropdownMenu>

  <UTooltip v-else-if="tooltip" :disabled="state.value.disabled" v-bind="{ ...(tooltip || {}) }">
    <UButton
      :active="state.value.active"
      :disabled="state.value.disabled"
      v-bind="buttonProps.value"
      @click="onClick($event, item)"
    />
  </UTooltip>

  <UButton
    v-else
    :active="state.value.active"
    :disabled="state.value.disabled"
    v-bind="buttonProps.value"
    @click="onClick($event, item)"
  />
</template>
