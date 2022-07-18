<template>
  <Combobox
    :model-value="modelValue"
    :multiple="multiple"
    :nullable="nullable"
    @update:model-value="onSelect"
  >
    <div class="flex flex-col flex-1 min-h-0 divide-y divide-gray-100 dark:divide-gray-800">
      <div class="relative flex items-center">
        <UIcon :name="inputIcon" class="pointer-events-none absolute top-3.5 left-5 h-5 w-5 u-text-gray-400" aria-hidden="true" />
        <ComboboxInput
          ref="comboboxInput"
          :value="query"
          class="w-full h-12 pr-4 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 pl-[3.25rem] u-text-gray-900 focus:ring-0 sm:text-sm"
          :placeholder="inputPlaceholder"
          autocomplete="off"
          @change="query = $event.target.value"
        />

        <UButton v-if="closeIcon" :icon="closeIcon" variant="transparent" class="absolute right-3" @click="onClear" />
      </div>

      <ComboboxOptions v-if="groups.length" static hold class="relative flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 scroll-py-2">
        <CommandPaletteGroup v-for="group of groups" :key="group.key" :group="group" />
      </ComboboxOptions>

      <div v-else class="flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14">
        <UIcon :name="emptyIcon" class="w-6 h-6 mx-auto u-text-gray-400" aria-hidden="true" />
        <p class="mt-4 text-sm u-text-gray-900">
          {{ query ? "We couldn't find any items with that term. Please try again." : "We couldn't find any items." }}
        </p>
      </div>
    </div>
  </Combobox>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Combobox, ComboboxInput, ComboboxOptions } from '@headlessui/vue'
import type { ComputedRef, PropType, ComponentPublicInstance } from 'vue'
import { useFuse } from '@vueuse/integrations/useFuse'
import { defu } from 'defu'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import type { Group, Command } from '../../types/command-palette'
import CommandPaletteGroup from './CommandPaletteGroup.vue'
import { useRouter } from '#imports'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object, Array],
    default: null
  },
  multiple: {
    type: Boolean,
    default: false
  },
  nullable: {
    type: Boolean,
    default: false
  },
  groups: {
    type: Array as PropType<Group[]>,
    default: () => []
  },
  closeIcon: {
    type: String,
    default: null
  },
  inputIcon: {
    type: String,
    default: 'heroicons-outline:search'
  },
  inputPlaceholder: {
    type: String,
    default: 'Search...'
  },
  emptyIcon: {
    type: String,
    default: 'heroicons-outline:search'
  },
  options: {
    type: Object as PropType<Partial<UseFuseOptions<Command>>>,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const query = ref('')
const comboboxInput = ref<ComponentPublicInstance<HTMLInputElement>>()

onMounted(() => {
  activateFirstOption()
})

const options: ComputedRef<Partial<UseFuseOptions<Command>>> = computed(() => defu({}, props.options, {
  fuseOptions: {
    keys: ['label']
  },
  resultLimit: 12,
  matchAllWhenSearchEmpty: true
}))

const fuse = props.groups.reduce((acc, group) => {
  const fuse = useFuse(query, group.commands, defu({}, group.options || {}, options.value))
  acc[group.key] = fuse
  return acc
}, {})

const groups = computed(() => props.groups.map((group) => {
  return {
    ...group,
    commands: fuse[group.key].results.value.map(result => result.item).slice(0, group.options?.resultLimit || options.value.resultLimit)
  }
}).filter(group => group.commands.length))

// Methods

function activateFirstOption () {
  // hack combobox by using keyboard event
  // https://github.com/tailwindlabs/headlessui/blob/main/packages/%40headlessui-vue/src/components/combobox/combobox.ts#L692
  setTimeout(() => {
    comboboxInput.value?.$el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
  }, 0)
}

function onSelect (option: Command) {
  if (option.disabled) {
    return
  }

  emit('update:modelValue', option)

  // waiting for modal to be closed
  if (!option.prevent) {
    query.value = ''
  }
}

function onClear () {
  if (query.value) {
    query.value = ''
  } else {
    emit('close')
  }
}
</script>

<script lang="ts">
export default { name: 'UCommandPalette' }
</script>
