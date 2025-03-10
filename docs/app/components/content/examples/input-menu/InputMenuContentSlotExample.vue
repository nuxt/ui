<script setup lang="ts">
import { ComboboxGroup, ComboboxLabel, ComboboxItem, ComboboxSeparator } from 'reka-ui'

const items = ref([
  { label: 'bug', color: 'error' },
  { label: 'feature', color: 'success' },
  { label: 'enhancement', color: 'info' }
])
const value = ref(items.value[0])
</script>

<template>
  <UInputMenu
    v-model="value"
    :items="items"
    :ui="{
      group: 'flex flex-wrap justify-evenly',
      item: 'w-auto'
    }"
  >
    <template #content="{ props, ui, groups }">
      <ComboboxGroup v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`" :class="ui.group({ class: props.ui?.group })">
        <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
          <ComboboxLabel v-if="item?.type === 'label'" :class="ui.label({ class: props.ui?.label })">
            {{ get(item, props.labelKey as string) }}
          </ComboboxLabel>

          <ComboboxSeparator v-else-if="item?.type === 'separator'" :class="ui.separator({ class: props.ui?.separator })" />

          <ComboboxItem
            v-else
            :class="ui.item({ class: props.ui?.item })"
            :disabled="item.disabled"
            :value="valueKey && typeof item === 'object' ? get(item, props.valueKey as string) : item"
            @select="item.onSelect"
          >
            <UBadge :color="item.color">
              {{ item.label }}
            </UBadge>
          </ComboboxItem>
        </template>
      </ComboboxGroup>
    </template>
  </UInputMenu>
</template>
