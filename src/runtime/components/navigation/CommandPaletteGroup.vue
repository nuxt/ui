<template>
  <li class="p-2">
    <h2 v-if="group.label" class="px-3 my-2 text-xs font-semibold u-text-gray-900">
      {{ group.label }}
    </h2>

    <ul class="text-sm u-text-gray-700">
      <ComboboxOption
        v-for="(command, index) of group.commands"
        :key="`${group.key}-${index}`"
        v-slot="{ active }"
        :value="command"
        :disabled="command.disabled"
        as="template"
      >
        <li :class="['flex justify-between select-none items-center rounded-md px-3 py-2 u-text-gray-400', active && 'bg-gray-100 dark:bg-gray-800 u-text-gray-900', command.disabled ? 'cursor-not-allowed' : 'cursor-pointer']">
          <div class="flex items-center flex-1 min-w-0 gap-3">
            <UIcon v-if="command.icon" :name="command.icon" :class="['h-4 w-4', command.iconColor, command.iconClass]" class="flex-shrink-0" aria-hidden="true" />
            <UAvatar v-else-if="command.avatar" :src="command.avatar" :alt="command.label" :rounded="false" size="xxxs" />
            <div class="flex items-center flex-1 w-full truncate u-text-gray-400" :class="{ 'opacity-50': command.disabled }">
              <span class="u-text-gray-700">{{ command.label }}</span>
            </div>
          </div>
        </li>
      </ComboboxOption>
    </ul>
  </li>
</template>

<script setup lang="ts">
import { ComboboxOption } from '@headlessui/vue'
import type { PropType } from 'vue'
import type { ComputedGroup } from '../../types/command-palette'

defineProps({
  group: {
    type: Object as PropType<ComputedGroup>,
    required: true
  }
})
</script>

<script lang="ts">
export default { name: 'UCommandPaletteGroup' }
</script>
