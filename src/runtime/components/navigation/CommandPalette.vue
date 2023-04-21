<template>
  <Combobox
    ref="comboboxRef"
    :by="by"
    :model-value="modelValue"
    :multiple="multiple"
    :nullable="nullable"
    @update:model-value="onSelect"
  >
    <div :class="ui.wrapper">
      <div v-if="searchable" :class="ui.input.wrapper">
        <Icon v-if="icon" :name="icon" :class="ui.input.icon.base" aria-hidden="true" />
        <ComboboxInput
          ref="comboboxInput"
          :value="query"
          :class="ui.input.base"
          :placeholder="placeholder"
          autocomplete="off"
          @change="query = $event.target.value"
        />

        <!-- <Button
          v-if="ui.input.close.icon.name"
          :icon="ui.input.close.icon"
          :class="ui.input.close.base"
          :size="ui.input.close.size"
          :variant="ui.input.close.variant"
          aria-label="Close"
          @click="onClear"
        /> -->
      </div>

      <ComboboxOptions
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
          :ui="ui"
        >
          <template v-for="(_, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </CommandPaletteGroup>
      </ComboboxOptions>

      <div v-else-if="empty" :class="ui.empty.wrapper">
        <Icon v-if="ui.empty.icon.name" :name="ui.empty.icon.name" :class="ui.empty.icon.base" aria-hidden="true" />
        <p :class="ui.empty.label">
          {{ query ? "We couldn't find any items with that term. Please try again." : "We couldn't find any items." }}
        </p>
      </div>
    </div>
  </Combobox>
</template>

<script lang="ts">
import { ref, computed, watch, onMounted, defineComponent } from 'vue'
import { Combobox, ComboboxInput, ComboboxOptions } from '@headlessui/vue'
import type { ComputedRef, PropType, ComponentPublicInstance } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useFuse } from '@vueuse/integrations/useFuse'
import { groupBy, map } from 'lodash-es'
import { defu } from 'defu'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import type { Group, Command } from '../../types/command-palette'
import Icon from '../elements/Icon.vue'
// import Button from '../elements/Button.vue'
import CommandPaletteGroup from './CommandPaletteGroup.vue'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    Icon,
    // Button,
    CommandPaletteGroup
  },
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
    groups: {
      type: Array as PropType<Group[]>,
      default: () => []
    },
    icon: {
      type: String,
      default: appConfig.ui.commandPalette.default.icon
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
    empty: {
      type: Boolean,
      default: true
    },
    debounce: {
      type: Number,
      default: 200
    },
    fuse: {
      type: Object as PropType<Partial<UseFuseOptions<Command>>>,
      default: () => ({})
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.commandPalette>>,
      default: () => appConfig.ui.commandPalette
    }
  },
  emits: ['update:modelValue', 'close'],
  setup (props, { emit }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.commandPalette>>(() => defu({}, props.ui, appConfig.ui.commandPalette))

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

      await Promise.all(searchableGroups.map(async (group) => {
        searchResults.value[group.key] = await group.search(query.value)
      }))
    }, props.debounce)

    watch(query, () => {
      debouncedSearch()

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

    // defineExpose({
    //   query,
    //   updateQuery: (q: string) => {
    //     query.value = q
    //   },
    //   comboboxApi,
    //   results
    // })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      // eslint-disable-next-line vue/no-dupe-keys
      groups,
      query,
      onSelect,
      onClear
    }
  }
})
</script>
