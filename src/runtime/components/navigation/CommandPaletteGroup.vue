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
          <div class="flex items-center flex-1 gap-3 min-w-0">
            <Icon v-if="command.icon" :name="command.icon" :class="['h-5 w-5 flex-shrink-0 text-opacity-40', active && 'text-opacity-100', command.iconClass || 'text-gray-900 dark:text-gray-50']" aria-hidden="true" />
            <Avatar
              v-else-if="command.avatar"
              v-bind="{ size: 'xxs', ...command.avatar }"
              class="flex-shrink-0"
            />
            <span v-else-if="command.chip" class="flex-shrink-0 w-2 h-2 mx-1.5 rounded-full" :style="{ background: `#${command.chip}` }" />

            <div class="flex items-center flex-1 min-w-0 gap-1.5" :class="{ 'opacity-50': command.disabled }">
              <slot :name="`${group.key}-command`" :group="group" :command="command">
                <span v-if="command.prefix" class="u-text-gray-400">{{ command.prefix }}</span>
                <span class="truncate">{{ command[commandAttribute] }}</span>
                <span v-if="command.suffix" class="u-text-gray-400">{{ command.suffix }}</span>
              </slot>
            </div>
          </div>

          <Icon v-if="selected" name="heroicons-outline:check" class="h-5 w-5 absolute right-2 u-text-gray-900" aria-hidden="true" />
          <span v-else-if="active" class="flex-none u-text-gray-500">
            <slot :name="`${group.key}-active`" :group="group" :command="command">{{ group.active }}</slot>
          </span>
          <slot v-else :name="`${group.key}-inactive`" :group="group" :command="command">
            <span v-if="command.shortcuts?.length" class="flex-none text-xs font-semibold u-text-gray-500">
              <kbd v-for="shortcut of command.shortcuts" :key="shortcut" class="font-sans">{{ shortcut }}</kbd>
            </span>
            <span v-else-if="!command.disabled && group.inactive" class="flex-none u-text-gray-500">{{ group.inactive }}</span>
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
</script>

<script lang="ts">
export default { name: 'UCommandPaletteGroup' }
</script>
