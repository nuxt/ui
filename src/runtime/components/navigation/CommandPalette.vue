<template>
  <HCombobox
    :by="by"
    :model-value="modelValue"
    :multiple="multiple"
    :nullable="nullable"
    :class="wrapperClass"
    v-bind="attrs"
    as="div"
    @update:model-value="onSelect"
  >
    <div v-show="searchable" :class="ui.input.wrapper">
      <UIcon v-if="iconName" :name="iconName" :class="iconClass" aria-hidden="true" />
      <HComboboxInput
        ref="comboboxInput"
        :value="query"
        :class="[ui.input.base, ui.input.size, ui.input.height, ui.input.padding, icon && ui.input.icon.padding]"
        :placeholder="placeholder"
        :aria-label="placeholder"
        autocomplete="off"
        @change="query = $event.target.value"
      />

      <UButton v-if="closeButton" aria-label="Close" v-bind="{ ...ui.default.closeButton, ...closeButton }" :class="ui.input.closeButton" @click="onClear" />
    </div>

    <HComboboxOptions
      v-if="groups.length"
      static
      hold
      as="div"
      aria-label="Commands"
      :class="ui.container"
    >
      <CommandPaletteGroup
        v-for="group of groups"
        :key="group.key"
        :query="query"
        :group="group"
        :group-attribute="groupAttribute"
        :command-attribute="commandAttribute"
        :selected-icon="selectedIcon"
        :ui="ui"
      >
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </CommandPaletteGroup>
    </HComboboxOptions>

    <template v-else-if="emptyState">
      <slot name="empty-state">
        <div :class="ui.emptyState.wrapper">
          <UIcon v-if="emptyState.icon" :name="emptyState.icon" :class="ui.emptyState.icon" aria-hidden="true" />
          <p :class="query ? ui.emptyState.queryLabel : ui.emptyState.label">
            {{ query ? emptyState.queryLabel : emptyState.label }}
          </p>
        </div>
      </slot>
    </template>
  </HCombobox>
</template>

<script lang="ts">
import { ref, computed, watch, onMounted, defineComponent } from 'vue'
import { Combobox as HCombobox, ComboboxInput as HComboboxInput, ComboboxOptions as HComboboxOptions } from '@headlessui/vue'
import type { ComputedRef, PropType, ComponentPublicInstance } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useFuse } from '@vueuse/integrations/useFuse'
import { twMerge, twJoin } from 'tailwind-merge'
import { groupBy, map, omit } from 'lodash-es'
import { defu } from 'defu'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import type { Group, Command } from '../../types/command-palette'
import UIcon from '../elements/Icon.vue'
import UButton from '../elements/Button.vue'
import type { Button } from '../../types/button'
import CommandPaletteGroup from './CommandPaletteGroup.vue'
import { defuTwMerge } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    HCombobox,
    HComboboxInput,
    HComboboxOptions,
    UIcon,
    UButton,
    CommandPaletteGroup
  },
  inheritAttrs: false,
  props: {
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
    loading: {
      type: Boolean,
      default: false
    },
    groups: {
      type: Array as PropType<Group[]>,
      default: () => []
    },
    icon: {
      type: String,
      default: () => appConfig.ui.commandPalette.default.icon
    },
    loadingIcon: {
      type: String,
      default: () => appConfig.ui.commandPalette.default.loadingIcon
    },
    selectedIcon: {
      type: String,
      default: () => appConfig.ui.commandPalette.default.selectedIcon
    },
    closeButton: {
      type: Object as PropType<Button>,
      default: () => appConfig.ui.commandPalette.default.closeButton
    },
    emptyState: {
      type: Object as PropType<{ icon: string, label: string, queryLabel: string }>,
      default: () => appConfig.ui.commandPalette.default.emptyState
    },
    placeholder: {
      type: String,
      default: 'Search...'
    },
    groupAttribute: {
      type: String,
      default: 'label'
    },
    commandAttribute: {
      type: String,
      default: 'label'
    },
    autoselect: {
      type: Boolean,
      default: true
    },
    autoclear: {
      type: Boolean,
      default: true
    },
    debounce: {
      type: Number,
      default: 200
    },
    fuse: {
      type: Object as PropType<UseFuseOptions<Command>>,
      default: () => ({})
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.commandPalette>>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'close'],
  setup (props, { emit, attrs, expose }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.commandPalette>>(() => defuTwMerge({}, props.ui, appConfig.ui.commandPalette))

    const query = ref('')
    const comboboxInput = ref<ComponentPublicInstance<HTMLInputElement>>()
    const comboboxApi = ref(null)
    const isLoading = ref(false)

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

    const options: ComputedRef<Partial<UseFuseOptions<Command>>> = computed(() => defu({}, props.fuse, {
      fuseOptions: {
        keys: [props.commandAttribute]
      },
      resultLimit: 12,
      matchAllWhenSearchEmpty: true
    }))

    const commands = computed(() => props.groups.filter(group => !group.search).reduce((acc, group) => {
      return acc.concat(group.commands.map(command => ({ ...command, group: group.key })))
    }, [] as Command[]))

    const searchResults = ref<{ [key: string]: any }>({})

    const { results } = useFuse(query, commands, options)

    const groups = computed(() => ([
      ...map(groupBy(results.value, command => command.item.group), (results, key) => {
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
      }),
      ...props.groups.filter(group => !!group.search).map(group => ({ ...group, commands: (searchResults.value[group.key] || []).slice(0, options.value.resultLimit) })).filter(group => group.commands.length)
    ]))

    const debouncedSearch = useDebounceFn(async () => {
      const searchableGroups = props.groups.filter(group => !!group.search)
      if (!searchableGroups.length) {
        return
      }

      isLoading.value = true

      await Promise.all(searchableGroups.map(async (group) => {
        searchResults.value[group.key] = await group.search(query.value)
      }))

      isLoading.value = false
    }, props.debounce)

    watch(query, () => {
      debouncedSearch()

      // Select first item on search changes
      setTimeout(() => {
        // https://github.com/tailwindlabs/headlessui/blob/6fa6074cd5d3a96f78a2d965392aa44101f5eede/packages/%40headlessui-vue/src/components/combobox/combobox.ts#L804
        comboboxInput.value?.$el.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp' }))
      }, 0)
    })

    const wrapperClass = computed(() => twMerge(ui.value.wrapper, attrs.class as string))

    const iconName = computed(() => {
      if ((props.loading || isLoading.value) && props.loadingIcon) {
        return props.loadingIcon
      }

      return props.icon
    })

    const iconClass = computed(() => {
      return twJoin(
        ui.value.input.icon.base,
        ui.value.input.icon.size,
        ((props.loading || isLoading.value) && props.loadingIcon) && 'animate-spin'
      )
    })

    const emptyState = computed(() => ({ ...ui.value.default.emptyState, ...props.emptyState }))

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

    expose({
      query,
      updateQuery: (q: string) => {
        query.value = q
      },
      comboboxApi,
      results
    })

    return {
      attrs: computed(() => omit(attrs, ['class'])),
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      // eslint-disable-next-line vue/no-dupe-keys
      groups,
      comboboxInput,
      query,
      wrapperClass,
      iconName,
      iconClass,
      // eslint-disable-next-line vue/no-dupe-keys
      emptyState,
      onSelect,
      onClear
    }
  }
})
</script>
