<template>
  <Combobox
    ref="comboboxRef"
    :by="by"
    :model-value="modelValue"
    :multiple="multiple"
    :nullable="nullable"
    @update:model-value="onSelect"
  >
    <div class="flex flex-col flex-1 min-h-0 divide-y divide-gray-100 dark:divide-gray-800">
      <div v-show="searchable" class="relative flex items-center">
        <Icon :name="inputIcon" class="pointer-events-none absolute top-3.5 left-5 h-5 w-5 u-text-gray-400" aria-hidden="true" />
        <ComboboxInput
          ref="comboboxInput"
          :value="query"
          class="w-full h-12 pr-4 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 pl-[3.25rem] u-text-gray-900 focus:ring-0 sm:text-sm"
          :placeholder="inputPlaceholder"
          autocomplete="off"
          @change="query = $event.target.value"
        />

        <Button
          v-if="closeIcon"
          :icon="closeIcon"
          variant="transparent"
          class="absolute right-2"
          aria-label="close"
          @click="onClear"
        />
      </div>

      <ComboboxOptions v-if="groups.length" static hold class="relative flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 scroll-py-2">
        <CommandPaletteGroup v-for="group of groups" :key="group.key" :group="group" :group-attribute="groupAttribute" :command-attribute="commandAttribute">
          <template v-for="(_, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </CommandPaletteGroup>
      </ComboboxOptions>

      <div v-else-if="placeholder" class="flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14">
        <Icon :name="emptyIcon" class="w-6 h-6 mx-auto u-text-gray-400" aria-hidden="true" />
        <p class="mt-4 text-sm text-center u-text-gray-900">
          {{ query ? "We couldn't find any items with that term. Please try again." : "We couldn't find any items." }}
        </p>
      </div>
    </div>
  </Combobox>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Combobox, ComboboxInput, ComboboxOptions } from '@headlessui/vue'
import type { ComputedRef, PropType, ComponentPublicInstance } from 'vue'
import { useFuse } from '@vueuse/integrations/useFuse'
import { groupBy, map } from 'lodash-es'
import { defu } from 'defu'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import type { Group, Command } from '../../types/command-palette'
import Icon from '../elements/Icon.vue'
import Button from '../elements/Button.vue'
import CommandPaletteGroup from './CommandPaletteGroup.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object, Array],
    default: null
  },
  by: {
    type: String,
    default: 'id'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  nullable: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: true
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
  groupAttribute: {
    type: String,
    default: 'label'
  },
  commandAttribute: {
    type: String,
    default: 'label'
  },
  options: {
    type: Object as PropType<Partial<UseFuseOptions<Command>>>,
    default: () => ({})
  },
  autoselect: {
    type: Boolean,
    default: true
  },
  autoclear: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const query = ref('')
const comboboxInput = ref<ComponentPublicInstance<HTMLInputElement>>()
const comboboxApi = ref(null)

onMounted(() => {
  if (props.autoselect) {
    activateFirstOption()
  }
})

onMounted(() => {
  setTimeout(() => {
    // @ts-expect-error internals
    const popoverProvides = comboboxInput.value?.$.provides
    if (!popoverProvides) {
      return
    }
    const popoverProvidesSymbols = Object.getOwnPropertySymbols(popoverProvides)
    comboboxApi.value = popoverProvidesSymbols.length && popoverProvides[popoverProvidesSymbols[0]]
  }, 200)
})

const options: ComputedRef<Partial<UseFuseOptions<Command>>> = computed(() => defu({}, props.options, {
  fuseOptions: {
    keys: [props.commandAttribute]
  },
  resultLimit: 12,
  matchAllWhenSearchEmpty: true
}))

const commands = computed(() => props.groups.reduce((acc, group) => {
  return acc.concat(group.commands.map(command => ({ ...command, group: group.key })))
}, [] as Command[]))

const { results } = useFuse(query, commands, options)

const groups = computed(() => map(groupBy(results.value, command => command.item.group), (results, key) => {
  const commands = results.map((result) => {
    const { item, ...data } = result

    return {
      ...item,
      ...data
    }
  })

  return {
    ...props.groups.find(group => group.key === key),
    commands: commands.slice(0, options.value.resultLimit)
  } as Group
}))

watch(groups, () => {
  // Select first item on search changes
  setTimeout(() => {
    // https://github.com/tailwindlabs/headlessui/blob/6fa6074cd5d3a96f78a2d965392aa44101f5eede/packages/%40headlessui-vue/src/components/combobox/combobox.ts#L804
    comboboxInput.value?.$el.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp' }))
  }, 0)
})

// Methods

function activateFirstOption () {
  // hack combobox by using keyboard event
  // https://github.com/tailwindlabs/headlessui/blob/6fa6074cd5d3a96f78a2d965392aa44101f5eede/packages/%40headlessui-vue/src/components/combobox/combobox.ts#L769
  setTimeout(() => {
    comboboxInput.value?.$el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
  }, 0)
}

function onSelect (option: Command | Command[]) {
  emit('update:modelValue', option, { query: query.value })

  // Clear input after selection
  if (props.autoclear) {
    setTimeout(() => {
      query.value = ''
    }, 0)
  }
}

function onClear () {
  if (query.value) {
    query.value = ''
  } else {
    emit('close')
  }
}

defineExpose({
  updateQuery: (q: string) => {
    query.value = q
  },
  comboboxApi,
  results
})
</script>

<script lang="ts">
export default { name: 'UCommandPalette' }
</script>
