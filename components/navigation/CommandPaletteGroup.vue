<template>
  <li class="p-2">
    <h2 v-if="group.label" class="px-3 my-2 text-xs font-semibold u-text-gray-900">
      {{ group.label }}
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
        <li :class="['flex justify-between select-none items-center rounded-md px-3 py-2 u-text-gray-400 gap-3 relative', active && 'bg-gray-100 dark:bg-gray-800 u-text-gray-900', command.disabled ? 'cursor-not-allowed' : 'cursor-pointer']">
          <div class="flex items-center flex-1 gap-3 min-w-0">
            <UIcon v-if="command.icon" :name="command.icon" :class="['h-4 w-4', command.iconClass]" class="flex-shrink-0" aria-hidden="true" />
            <UAvatar
              v-else-if="command.avatar"
              :src="command.avatar"
              :alt="command.label"
              :rounded="false"
              size="xxxs"
              class="flex-shrink-0"
            />
            <span v-else-if="command.chip" class="flex-shrink-0 w-2 h-2 rounded-full" :style="{ background: `#${command.chip}` }" />

            <div class="flex items-center flex-1 min-w-0 u-text-gray-400 gap-1.5" :class="{ 'opacity-50': command.disabled }">
              <span v-if="command.prefix">{{ command.prefix }}</span>
              <span class="u-text-gray-700 truncate">{{ command.label }}</span>
            </div>
          </div>

          <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-2 u-text-gray-900">
            <UIcon name="heroicons-outline:check" class="h-5 w-5" aria-hidden="true" />
          </span>
          <span v-else-if="active && command.suffix" class="flex-none u-text-gray-500">{{ command.suffix }}</span>
          <span v-else-if="command.shortcuts?.length" class="flex-none text-xs font-semibold u-text-gray-500">
            <kbd v-for="shortcut of command.shortcuts" :key="shortcut" class="font-sans">{{ shortcut }}</kbd>
          </span>
        </li>
      </ComboboxOption>
    </ul>
  </li>
</template>

<script setup lang="ts">
import { ComboboxOption } from '@headlessui/vue'
import type { PropType } from 'vue'
import type { Group } from '../../types/command-palette'

defineProps({
  group: {
    type: Object as PropType<Group>,
    required: true
  }
})
</script>

<script lang="ts">
export default { name: 'UCommandPaletteGroup' }
</script>
