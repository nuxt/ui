<template>
  <li class="p-2">
    <h2 v-if="group[groupAttribute]" class="px-3 my-2 text-xs font-semibold u-text-gray-900">
      {{ group[groupAttribute] }}
    </h2>

    <ul class="text-sm u-text-gray-700">
      <ComboboxOption
        v-for="(command, index) of group.commands"
        :key="`${group.key}-${index}`"
        v-slot="{ active, selected }"
        :value="command"
        :disabled="command.disabled"
        as="template"
      >
        <li :class="['flex justify-between select-none items-center rounded-md px-3 py-2 gap-3 relative', active && 'bg-gray-100 dark:bg-gray-800 u-text-gray-900', command.disabled ? 'cursor-not-allowed' : 'cursor-pointer']">
          <div class="flex items-center gap-2 min-w-0">
            <Icon v-if="command.icon" :name="command.icon" :class="['h-4 w-4 flex-shrink-0', active ? 'text-opacity-100 dark:text-opacity-100' : 'text-opacity-40 dark:text-opacity-40', command.iconClass || 'text-gray-900 dark:text-gray-50']" aria-hidden="true" />
            <Avatar
              v-else-if="command.avatar"
              v-bind="{ size: 'xxxs', ...command.avatar }"
              class="flex-shrink-0"
            />
            <span v-else-if="command.chip" class="flex-shrink-0 w-2 h-2 mx-1 rounded-full" :style="{ background: `#${command.chip}` }" />

            <div class="flex items-center gap-1.5 min-w-0" :class="{ 'opacity-50': command.disabled }">
              <slot :name="`${group.key}-command`" :group="group" :command="command">
                <span v-if="command.prefix" class="u-text-gray-400">{{ command.prefix }}</span>
                <span v-if="command.matches?.length" class="truncate" :class="{ 'flex-none': command.suffix }" v-html="highlight(command.matches[0])" />
                <span v-else class="truncate" :class="{ 'flex-none': command.suffix }">{{ command[commandAttribute] }}</span>
                <span v-if="command.suffix" class="u-text-gray-400 truncate">{{ command.suffix }}</span>
              </slot>
            </div>
          </div>

          <Icon v-if="selected" name="heroicons-outline:check" class="h-5 w-5 u-text-gray-900 flex-shrink-0" aria-hidden="true" />
          <slot v-else-if="active && (group.active || $slots[`${group.key}-active`])" :name="`${group.key}-active`" :group="group" :command="command">
            <span v-if="group.active" class="flex-shrink-0 u-text-gray-500">{{ group.active }}</span>
          </slot>
          <slot v-else :name="`${group.key}-inactive`" :group="group" :command="command">
            <span v-if="command.shortcuts?.length" class="flex-shrink-0 text-xs font-semibold u-text-gray-500">
              <kbd v-for="shortcut of command.shortcuts" :key="shortcut" class="font-sans">{{ shortcut }}</kbd>
            </span>
            <span v-else-if="!command.disabled && group.inactive" class="flex-shrink-0 u-text-gray-500">{{ group.inactive }}</span>
          </slot>
        </li>
      </ComboboxOption>
    </ul>
  </li>
</template>

<script setup lang="ts">
import { ComboboxOption } from '@headlessui/vue'
import type { PropType } from 'vue'
import Icon from '../elements/Icon.vue'
import Avatar from '../elements/Avatar.vue'
import type { Group } from '../../types/command-palette'

defineProps({
  group: {
    type: Object as PropType<Group>,
    required: true
  },
  groupAttribute: {
    type: String,
    required: true
  },
  commandAttribute: {
    type: String,
    required: true
  }
})

function highlight ({ indices, value }, i = 1) {
  const pair = indices[indices.length - i]
  if (!pair) {
    return value
  }

  return `${highlight({ indices, value: value.substring(0, pair[0]) }, i + 1)}<mark>${value.substring(pair[0], pair[1] + 1)}</mark>${value.substring(pair[1] + 1)}`
}
</script>

<script lang="ts">
export default { name: 'UCommandPaletteGroup' }
</script>
