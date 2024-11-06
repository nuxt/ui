<template>
  <HCombobox
    :by="by"
    :model-value="modelValue"
    :multiple="multiple"
    :nullable="nullable"
    :class="ui.wrapper"
    v-bind="attrs"
    as="div"
    @update:model-value="onSelect"
  >
    <div v-show="searchable" :class="ui.input.wrapper">
      <UIcon v-if="iconName" :name="iconName" :class="iconClass" aria-hidden="true" />
      <HComboboxInput
        ref="comboboxInput"
        :value="query"
        :class="[ui.input.base, ui.input.size, ui.input.height, ui.input.padding, icon && ui.input.icon.padding, closeButton && ui.input.closeButton.padding]"
        :placeholder="placeholder"
        :aria-label="placeholder"
        autocomplete="off"
        @change="query = $event.target.value"
      />

      <UButton v-if="closeButton" aria-label="Close" v-bind="{ ...(ui.default.closeButton || {}), ...closeButton }" :class="ui.input.closeButton.base" @click="onClear" />
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
import { ref, computed, watch, toRef, onMounted, defineComponent } from 'vue'
import { Combobox as HCombobox, ComboboxInput as HComboboxInput, ComboboxOptions as HComboboxOptions, provideUseId } from '@headlessui/vue'
import type { ComputedRef, PropType, ComponentPublicInstance } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useFuse } from '@vueuse/integrations/useFuse'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import { twJoin } from 'tailwind-merge'
import { defu } from 'defu'
import UIcon from '../elements/Icon.vue'
import UButton from '../elements/Button.vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { Group, Command, Button, Strategy, DeepPartial } from '../../types/index'
import CommandPaletteGroup from './CommandPaletteGroup.vue'
// @ts-expect-error
import appConfig from '#build/app.config'
import { commandPalette } from '#ui/ui.config'
import { useId } from '#imports'

const config = mergeConfig<typeof commandPalette>(appConfig.ui.strategy, appConfig.ui.commandPalette, commandPalette)

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
      default: () => config.default.icon
    },
    loadingIcon: {
      type: String,
      default: () => config.default.loadingIcon
    },
    selectedIcon: {
      type: String,
      default: () => config.default.selectedIcon
    },
    closeButton: {
      type: Object as PropType<Button>,
      default: () => config.default.closeButton as unknown as Button
    },
    emptyState: {
      type: Object as PropType<{ icon: string, label: string, queryLabel: string }>,
      default: () => config.default.emptyState
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
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { emit, expose }) {
    const { ui, attrs } = useUI('commandPalette', toRef(props, 'ui'), config, toRef(props, 'class'))

    const query = ref('')
    const comboboxInput = ref<ComponentPublicInstance<HTMLInputElement>>()
    const comboboxApi = ref(null)
    const isLoading = ref(false)

    onMounted(() => {
      if (props.autoselect) {
        activateNextOption()
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

    const commands = computed(() => {
      const commands: Command[] = []
      for (const group of props.groups) {
        if (!group.search && !group.static) {
          commands.push(...(group.commands?.map(command => ({ ...command, group: group.key })) || []))
        }
      }
      return commands
    })

    const searchResults = ref<{ [key: string]: any }>({})

    const { results } = useFuse(query, commands, options)

    function getGroupWithCommands(group: Group, commands: Command[]) {
      if (!group) {
        return
      }

      if (group.filter && typeof group.filter === 'function') {
        commands = group.filter(query.value, commands)
      }

      return {
        ...group,
        commands: commands.slice(0, options.value.resultLimit)
      }
    }

    const groups = computed(() => {
      if (!results.value) {
        return []
      }

      const groupedCommands: Record<string, Command[]> = results.value.reduce((acc, command) => {
        const { item, ...data } = command
        if (!item.group) {
          return acc
        }

        acc[item.group] ||= []
        acc[item.group].push({ ...item, ...data })

        return acc
      }, {})

      const groups: Group[] = Object.entries(groupedCommands).map(([key, commands]) => {
        const group = props.groups.find(group => group.key === key)
        if (!group) {
          return null
        }

        return getGroupWithCommands(group, commands)
      }).filter(Boolean)

      const searchGroups = props.groups.filter(group => !!group.search && searchResults.value[group.key]?.length).map((group) => {
        const commands = (searchResults.value[group.key] || [])

        return getGroupWithCommands(group, [...commands])
      })

      const staticGroups: Group[] = props.groups.filter(group => group.static && group.commands?.length).map((group) => {
        return getGroupWithCommands(group, group.commands)
      })

      return [
        ...groups,
        ...searchGroups,
        ...staticGroups
      ]
    })

    const debouncedSearch = useDebounceFn(async () => {
      const searchableGroups = props.groups.filter(group => !!group.search)
      if (!searchableGroups.length) {
        return
      }

      isLoading.value = true

      await Promise.all(searchableGroups.map(async (group) => {
        // @ts-ignore
        searchResults.value[group.key] = await group.search(query.value)
      }))

      isLoading.value = false

      activateFirstOption()
    }, props.debounce)

    watch(query, () => {
      debouncedSearch()

      activateFirstOption()
    })

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
        ((props.loading || isLoading.value) && props.loadingIcon) && ui.value.input.icon.loading
      )
    })

    const emptyState = computed(() => {
      if (props.emptyState === null) return null
      return { ...ui.value.default.emptyState, ...props.emptyState }
    })

    // Methods

    function activateFirstOption() {
      setTimeout(() => {
        // https://github.com/tailwindlabs/headlessui/blob/6fa6074cd5d3a96f78a2d965392aa44101f5eede/packages/%40headlessui-vue/src/components/combobox/combobox.ts#L804
        comboboxInput.value?.$el.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp' }))
      }, 0)
    }

    function activateNextOption() {
      setTimeout(() => {
        // https://github.com/tailwindlabs/headlessui/blob/6fa6074cd5d3a96f78a2d965392aa44101f5eede/packages/%40headlessui-vue/src/components/combobox/combobox.ts#L769
        comboboxInput.value?.$el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
      }, 0)
    }

    function onSelect(option: Command | Command[]) {
      emit('update:modelValue', option, { query: query.value })

      // Clear input after selection
      if (props.autoclear) {
        setTimeout(() => {
          query.value = ''
        }, 0)
      }
    }

    function onClear() {
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

    provideUseId(() => useId())

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      // eslint-disable-next-line vue/no-dupe-keys
      groups,
      comboboxInput,
      query,
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
