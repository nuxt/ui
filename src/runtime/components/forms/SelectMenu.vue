<template>
  <component
    :is="searchable ? 'HCombobox' : 'HListbox'"
    v-slot="{ open }"
    :by="by"
    :name="name"
    :model-value="multiple ? (Array.isArray(modelValue) ? modelValue : []) : modelValue"
    :multiple="multiple"
    :disabled="disabled"
    as="div"
    :class="ui.wrapper"
    @update:model-value="onUpdate"
  >
    <input
      v-if="required"
      :value="modelValue"
      :required="required"
      :class="uiMenu.required"
      tabindex="-1"
      aria-hidden="true"
    >

    <component
      :is="searchable ? 'HComboboxButton' : 'HListboxButton'"
      ref="trigger"
      as="div"
      role="button"
      :class="uiMenu.trigger"
    >
      <slot :open="open" :disabled="disabled" :loading="loading">
        <button :id="inputId" :class="selectClass" :disabled="disabled" type="button" v-bind="attrs">
          <span v-if="(isLeading && leadingIconName) || $slots.leading" :class="leadingWrapperIconClass">
            <slot name="leading" :selected="selected" :disabled="disabled" :loading="loading">
              <UIcon :name="leadingIconName" :class="leadingIconClass" />
            </slot>
          </span>

          <slot name="label" :selected="selected">
            <span v-if="label" :class="uiMenu.label">{{ label }}</span>
            <span v-else :class="uiMenu.label">{{ placeholder || '&nbsp;' }}</span>
          </slot>

          <span v-if="(isTrailing && trailingIconName) || $slots.trailing" :class="trailingWrapperIconClass">
            <slot name="trailing" :selected="selected" :disabled="disabled" :loading="loading">
              <UIcon :name="trailingIconName" :class="trailingIconClass" aria-hidden="true" />
            </slot>
          </span>
        </button>
      </slot>
    </component>

    <div v-if="open" ref="container" :class="[uiMenu.container, uiMenu.width]">
      <Transition appear v-bind="uiMenu.transition">
        <div>
          <div v-if="popper.arrow" data-popper-arrow :class="Object.values(uiMenu.arrow)" />

          <component :is="searchable ? 'HComboboxOptions' : 'HListboxOptions'" static :class="[uiMenu.base, uiMenu.ring, uiMenu.rounded, uiMenu.shadow, uiMenu.background, uiMenu.padding, uiMenu.height]">
            <HComboboxInput
              v-if="searchable"
              :display-value="() => query"
              name="q"
              :placeholder="searchablePlaceholder"
              autofocus
              autocomplete="off"
              :class="uiMenu.input"
              @change="onQueryChange"
            />
            <component
              :is="searchable ? 'HComboboxOption' : 'HListboxOption'"
              v-for="(option, index) in filteredOptions"
              v-slot="{ active, selected: optionSelected, disabled: optionDisabled }"
              :key="index"
              as="template"
              :value="valueAttribute ? accessor(option, valueAttribute) : option"
              :disabled="option.disabled"
            >
              <li :class="[uiMenu.option.base, uiMenu.option.rounded, uiMenu.option.padding, uiMenu.option.size, uiMenu.option.color, active ? uiMenu.option.active : uiMenu.option.inactive, optionSelected && uiMenu.option.selected, optionDisabled && uiMenu.option.disabled]">
                <div :class="uiMenu.option.container">
                  <slot name="option" :option="option" :active="active" :selected="optionSelected">
                    <UIcon v-if="option.icon" :name="option.icon" :class="[uiMenu.option.icon.base, active ? uiMenu.option.icon.active : uiMenu.option.icon.inactive, option.iconClass]" aria-hidden="true" />
                    <UAvatar
                      v-else-if="option.avatar"
                      v-bind="{ size: uiMenu.option.avatar.size, ...option.avatar }"
                      :class="uiMenu.option.avatar.base"
                      aria-hidden="true"
                    />
                    <span v-else-if="option.chip" :class="uiMenu.option.chip.base" :style="{ background: `#${option.chip}` }" />

                    <span class="truncate">{{ ['string', 'number'].includes(typeof option) ? option : accessor(option, optionAttribute) }}</span>
                  </slot>
                </div>

                <span v-if="optionSelected" :class="[uiMenu.option.selectedIcon.wrapper, uiMenu.option.selectedIcon.padding]">
                  <UIcon :name="selectedIcon" :class="uiMenu.option.selectedIcon.base" aria-hidden="true" />
                </span>
              </li>
            </component>

            <component :is="searchable ? 'HComboboxOption' : 'HListboxOption'" v-if="creatable && createOption" v-slot="{ active, selected: optionSelected }" :value="createOption" as="template">
              <li :class="[uiMenu.option.base, uiMenu.option.rounded, uiMenu.option.padding, uiMenu.option.size, uiMenu.option.color, active ? uiMenu.option.active : uiMenu.option.inactive]">
                <div :class="uiMenu.option.container">
                  <slot name="option-create" :option="createOption" :active="active" :selected="optionSelected">
                    <span :class="uiMenu.option.create">Create "{{ typeof createOption === 'string' ? createOption : accessor(createOption, optionAttribute) }}"</span>
                  </slot>
                </div>
              </li>
            </component>
            <p v-else-if="searchable && query && !filteredOptions?.length" :class="uiMenu.option.empty">
              <slot name="option-empty" :query="query">
                {{ uiMenu.default.optionEmpty.label.replace('{query}', query) }}
              </slot>
            </p>
            <p v-else-if="!filteredOptions?.length" :class="uiMenu.empty">
              <slot name="empty" :query="query">
                {{ uiMenu.default.empty.label }}
              </slot>
            </p>
          </component>
        </div>
      </Transition>
    </div>
  </component>
</template>

<script lang="ts">
import { ref, computed, toRef, watch, defineComponent, toRaw } from 'vue'
import type { PropType } from 'vue'
import {
  Combobox as HCombobox,
  ComboboxButton as HComboboxButton,
  ComboboxOptions as HComboboxOptions,
  ComboboxOption as HComboboxOption,
  ComboboxInput as HComboboxInput,
  Listbox as HListbox,
  ListboxButton as HListboxButton,
  ListboxOptions as HListboxOptions,
  ListboxOption as HListboxOption,
  provideUseId
} from '@headlessui/vue'
import { computedAsync, useDebounceFn } from '@vueuse/core'
import { defu } from 'defu'
import { twMerge, twJoin } from 'tailwind-merge'
import { isEqual } from 'ohash'
import UIcon from '../elements/Icon.vue'
import UAvatar from '../elements/Avatar.vue'
import { useUI } from '../../composables/useUI'
import { usePopper } from '../../composables/usePopper'
import { useFormGroup } from '../../composables/useFormGroup'
import { get, mergeConfig } from '../../utils'
import { useInjectButtonGroup } from '../../composables/useButtonGroup'
import type { SelectSize, SelectColor, SelectVariant, PopperOptions, Strategy, DeepPartial } from '../../types/index'
// @ts-expect-error
import appConfig from '#build/app.config'
import { select, selectMenu } from '#ui/ui.config'
import { useId } from '#imports'

const config = mergeConfig<typeof select>(appConfig.ui.strategy, appConfig.ui.select, select)

const configMenu = mergeConfig<typeof selectMenu>(appConfig.ui.strategy, appConfig.ui.selectMenu, selectMenu)

export default defineComponent({
  components: {
    HCombobox,
    HComboboxButton,
    HComboboxOptions,
    HComboboxOption,
    HComboboxInput,
    HListbox,
    HListboxButton,
    HListboxOptions,
    HListboxOption,
    UIcon,
    UAvatar
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, Object, Array, Boolean] as PropType<string | number | object | Array<any> | boolean | null>,
      default: ''
    },
    query: {
      type: String,
      default: null
    },
    by: {
      type: String,
      default: undefined
    },
    options: {
      type: Array as PropType<{ [key: string]: any, disabled?: boolean }[] | string[]>,
      default: () => []
    },
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: null
    },
    loadingIcon: {
      type: String,
      default: () => config.default.loadingIcon
    },
    leadingIcon: {
      type: String,
      default: null
    },
    trailingIcon: {
      type: String,
      default: () => config.default.trailingIcon
    },
    trailing: {
      type: Boolean,
      default: false
    },
    leading: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    selectedIcon: {
      type: String,
      default: () => configMenu.default.selectedIcon
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    searchable: {
      type: [Boolean, Function] as PropType<boolean | ((query: string) => Promise<any[]> | any[])>,
      default: false
    },
    searchablePlaceholder: {
      type: String,
      default: () => configMenu.default.searchablePlaceholder.label
    },
    searchableLazy: {
      type: Boolean,
      default: false
    },
    clearSearchOnClose: {
      type: Boolean,
      default: () => configMenu.default.clearSearchOnClose
    },
    debounce: {
      type: Number,
      default: 200
    },
    creatable: {
      type: Boolean,
      default: false
    },
    showCreateOptionWhen: {
      type: [String, Function] as PropType<'always' | 'empty' | ((query: string, results: any[]) => boolean)>,
      default: () => configMenu.default.showCreateOptionWhen
    },
    placeholder: {
      type: String,
      default: null
    },
    padded: {
      type: Boolean,
      default: true
    },
    size: {
      type: String as PropType<SelectSize>,
      default: null,
      validator(value: string) {
        return Object.keys(config.size).includes(value)
      }
    },
    color: {
      type: String as PropType<SelectColor>,
      default: () => config.default.color,
      validator(value: string) {
        return [...appConfig.ui.colors, ...Object.keys(config.color)].includes(value)
      }
    },
    variant: {
      type: String as PropType<SelectVariant>,
      default: () => config.default.variant,
      validator(value: string) {
        return [
          ...Object.keys(config.variant),
          ...Object.values(config.color).flatMap(value => Object.keys(value))
        ].includes(value)
      }
    },
    optionAttribute: {
      type: String,
      default: 'label'
    },
    valueAttribute: {
      type: String,
      default: null
    },
    searchAttributes: {
      type: Array,
      default: null
    },
    popper: {
      type: Object as PropType<PopperOptions>,
      default: () => ({})
    },
    selectClass: {
      type: String,
      default: null
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    },
    uiMenu: {
      type: Object as PropType<DeepPartial<typeof configMenu> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'update:query', 'open', 'close', 'change'],
  setup(props, { emit, slots }) {
    if (import.meta.dev && props.multiple && !Array.isArray(props.modelValue)) {
      console.warn(`[@nuxt/ui] The USelectMenu components needs to have a modelValue of type Array when using the multiple prop. Got '${typeof props.modelValue}' instead.`, props.modelValue)
    }

    const { ui, attrs } = useUI('select', toRef(props, 'ui'), config, toRef(props, 'class'))
    const { ui: uiMenu } = useUI('selectMenu', toRef(props, 'uiMenu'), configMenu)

    const popper = computed<PopperOptions>(() => defu({}, props.popper, uiMenu.value.popper as PopperOptions))

    const [trigger, container] = usePopper(popper.value)

    const by = computed(() => {
      if (!props.by) return undefined

      if (typeof props.by === 'function') {
        return props.by
      }

      const key = props.by
      const hasDot = key.indexOf('.')
      if (hasDot > 0) {
        return (a: any, z: any) => {
          return accessor(a, key) === accessor(z, key)
        }
      }

      return key
    })

    const { size: sizeButtonGroup, rounded } = useInjectButtonGroup({ ui, props })
    const { emitFormBlur, emitFormChange, inputId, color, size: sizeFormGroup, name } = useFormGroup(props, config)

    const size = computed(() => sizeButtonGroup.value ?? sizeFormGroup.value)

    const internalQuery = ref('')
    const query = computed({
      get() {
        return props.query ?? internalQuery.value
      },
      set(value) {
        internalQuery.value = value
        emit('update:query', value)
      }
    })

    const selected = computed(() => {
      function compareValues(value1: any, value2: any) {
        if (by.value && typeof by.value !== 'function' && typeof value1 === 'object' && typeof value2 === 'object') {
          return isEqual(value1[by.value], value2[by.value])
        }
        return isEqual(value1, value2)
      }

      function getValue(value: any) {
        if (props.valueAttribute) {
          return accessor(value, props.valueAttribute)
        }

        return value
      }

      if (props.multiple) {
        const modelValue = props.modelValue
        if (!Array.isArray(modelValue) || !modelValue.length) {
          return []
        }

        return options.value.filter((option) => {
          const optionValue = getValue(option)
          return modelValue.some(value => compareValues(value, optionValue))
        })
      }

      return options.value.find((option) => {
        const optionValue = getValue(option)
        return compareValues(optionValue, toRaw(props.modelValue))
      }) ?? props.modelValue
    })

    const label = computed(() => {
      if (!props.modelValue) return null

      if (Array.isArray(props.modelValue) && props.modelValue.length) {
        return `${props.modelValue.length} selected`
      } else if (['string', 'number'].includes(typeof props.modelValue)) {
        return props.valueAttribute ? accessor(selected.value, props.optionAttribute) : props.modelValue
      }

      return accessor(props.modelValue as Record<string, any>, props.optionAttribute)
    })

    const selectClass = computed(() => {
      const variant = ui.value.color?.[color.value as string]?.[props.variant as string] || ui.value.variant[props.variant]

      return twMerge(twJoin(
        ui.value.base,
        uiMenu.value.select,
        rounded.value,
        ui.value.size[size.value],
        ui.value.gap[size.value],
        props.padded ? ui.value.padding[size.value] : 'p-0',
        variant?.replaceAll('{color}', color.value),
        (isLeading.value || slots.leading) && ui.value.leading.padding[size.value],
        (isTrailing.value || slots.trailing) && ui.value.trailing.padding[size.value]
      ), props.placeholder && (!props.modelValue || (Array.isArray(props.modelValue) && !props.modelValue.length)) && ui.value.placeholder, props.selectClass)
    })

    const isLeading = computed(() => {
      return (props.icon && props.leading) || (props.icon && !props.trailing) || (props.loading && !props.trailing) || props.leadingIcon
    })

    const isTrailing = computed(() => {
      return (props.icon && props.trailing) || (props.loading && props.trailing) || props.trailingIcon
    })

    const leadingIconName = computed(() => {
      if (props.loading) {
        return props.loadingIcon
      }

      return props.leadingIcon || props.icon
    })

    const trailingIconName = computed(() => {
      if (props.loading && !isLeading.value) {
        return props.loadingIcon
      }

      return props.trailingIcon || props.icon
    })

    const leadingWrapperIconClass = computed(() => {
      return twJoin(
        ui.value.icon.leading.wrapper,
        ui.value.icon.leading.pointer,
        ui.value.icon.leading.padding[size.value]
      )
    })

    const leadingIconClass = computed(() => {
      return twJoin(
        ui.value.icon.base,
        color.value && appConfig.ui.colors.includes(color.value) && ui.value.icon.color.replaceAll('{color}', color.value),
        ui.value.icon.size[size.value],
        props.loading && ui.value.icon.loading
      )
    })

    const trailingWrapperIconClass = computed(() => {
      return twJoin(
        ui.value.icon.trailing.wrapper,
        ui.value.icon.trailing.pointer,
        ui.value.icon.trailing.padding[size.value]
      )
    })

    const trailingIconClass = computed(() => {
      return twJoin(
        ui.value.icon.base,
        color.value && appConfig.ui.colors.includes(color.value) && ui.value.icon.color.replaceAll('{color}', color.value),
        ui.value.icon.size[size.value],
        props.loading && !isLeading.value && ui.value.icon.loading
      )
    })

    const debouncedSearch = props.searchable && typeof props.searchable === 'function' ? useDebounceFn(props.searchable, props.debounce) : undefined

    const options = computedAsync(async () => {
      if (debouncedSearch) {
        return await debouncedSearch(query.value)
      }

      return props.options || []
    }, [], {
      lazy: props.searchableLazy
    })

    function escapeRegExp(string: string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, match => `\\${match}`)
    }

    function accessor<T extends Record<string, any>>(obj: T, key: string) {
      return get(obj, key)
    }

    const filteredOptions = computed(() => {
      if (!query.value || debouncedSearch) {
        return options.value
      }

      const escapedQuery = escapeRegExp(query.value)

      return options.value.filter((option: any) => {
        return (props.searchAttributes?.length ? props.searchAttributes : [props.optionAttribute]).some((searchAttribute: any) => {
          if (['string', 'number'].includes(typeof option)) {
            return String(option).search(new RegExp(escapedQuery, 'i')) !== -1
          }

          const child = get(option, searchAttribute)

          return child !== null && child !== undefined && String(child).search(new RegExp(escapedQuery, 'i')) !== -1
        })
      })
    })

    const createOption = computed(() => {
      if (query.value === '') {
        return null
      }
      if (props.showCreateOptionWhen === 'empty' && filteredOptions.value.length) {
        return null
      }
      if (props.showCreateOptionWhen === 'always') {
        const existingOption = filteredOptions.value.find(option => ['string', 'number'].includes(typeof option) ? option === query.value : accessor(option, props.optionAttribute) === query.value)
        if (existingOption) {
          return null
        }
      }
      if (typeof props.showCreateOptionWhen === 'function') {
        if (!props.showCreateOptionWhen(query.value, filteredOptions.value)) {
          return null
        }
      }
      return ['string', 'number'].includes(typeof props.modelValue) ? query.value : { [props.optionAttribute]: query.value }
    })

    function clearOnClose() {
      if (props.clearSearchOnClose) {
        query.value = ''
      }
    }

    watch(container, (value) => {
      if (value) {
        emit('open')
      } else {
        clearOnClose()
        emit('close')
        emitFormBlur()
      }
    })

    function onUpdate(value: any) {
      if (toRaw(props.modelValue) === value) {
        return
      }

      emit('update:modelValue', value)
      emit('change', value)
      emitFormChange()
    }

    function onQueryChange(event: any) {
      query.value = event.target.value
    }

    provideUseId(() => useId())

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      // eslint-disable-next-line vue/no-dupe-keys
      uiMenu,
      attrs,
      // eslint-disable-next-line vue/no-dupe-keys
      name,
      inputId,
      // eslint-disable-next-line vue/no-dupe-keys
      popper,
      trigger,
      container,
      selected,
      label,
      accessor,
      isLeading,
      isTrailing,
      // eslint-disable-next-line vue/no-dupe-keys
      selectClass,
      leadingIconName,
      leadingIconClass,
      leadingWrapperIconClass,
      trailingIconName,
      trailingIconClass,
      trailingWrapperIconClass,
      filteredOptions,
      createOption,
      // eslint-disable-next-line vue/no-dupe-keys
      query,
      onUpdate,
      onQueryChange,
      // eslint-disable-next-line vue/no-dupe-keys
      by
    }
  }
})
</script>
