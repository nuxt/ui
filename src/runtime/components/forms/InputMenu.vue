<template>
  <HCombobox
    v-slot="{ open }"
    :by="by"
    :name="name"
    :model-value="modelValue"
    :disabled="disabled"
    :nullable="nullable"
    as="div"
    :class="ui.wrapper"
    @update:model-value="onUpdate"
  >
    <div :class="uiMenu.trigger">
      <HComboboxInput
        :id="inputId"
        :name="name"
        :required="required"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClass"
        autocomplete="off"
        v-bind="attrs"
        :display-value="() => query ? query : label"
        @change="onQueryChange"
      />

      <span v-if="(isLeading && leadingIconName) || $slots.leading" :class="leadingWrapperIconClass">
        <slot name="leading" :disabled="disabled" :loading="loading">
          <UIcon :name="leadingIconName" :class="leadingIconClass" />
        </slot>
      </span>

      <HComboboxButton v-if="(isTrailing && trailingIconName) || $slots.trailing" ref="trigger" :class="trailingWrapperIconClass">
        <slot name="trailing" :disabled="disabled" :loading="loading">
          <UIcon :name="trailingIconName" :class="trailingIconClass" />
        </slot>
      </HComboboxButton>
    </div>

    <div v-if="open" ref="container" :class="[uiMenu.container, uiMenu.width]">
      <Transition appear v-bind="uiMenu.transition">
        <div>
          <div v-if="popper.arrow" data-popper-arrow :class="Object.values(uiMenu.arrow)" />

          <HComboboxOptions static :class="[uiMenu.base, uiMenu.ring, uiMenu.rounded, uiMenu.shadow, uiMenu.background, uiMenu.padding, uiMenu.height]">
            <HComboboxOption
              v-for="(option, index) in filteredOptions"
              v-slot="{ active, selected, disabled: optionDisabled }"
              :key="index"
              as="template"
              :value="valueAttribute ? accessor(option, valueAttribute) : option"
              :disabled="option.disabled"
            >
              <li :class="[uiMenu.option.base, uiMenu.option.rounded, uiMenu.option.padding, uiMenu.option.size, uiMenu.option.color, active ? uiMenu.option.active : uiMenu.option.inactive, selected && uiMenu.option.selected, optionDisabled && uiMenu.option.disabled]">
                <div :class="uiMenu.option.container">
                  <slot name="option" :option="option" :active="active" :selected="selected">
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

                <span v-if="selected" :class="[uiMenu.option.selectedIcon.wrapper, uiMenu.option.selectedIcon.padding]">
                  <UIcon :name="selectedIcon" :class="uiMenu.option.selectedIcon.base" aria-hidden="true" />
                </span>
              </li>
            </HComboboxOption>

            <p v-if="query && !filteredOptions.length" :class="uiMenu.option.empty">
              <slot name="option-empty" :query="query">
                {{ uiMenu.default.optionEmpty.label.replace('{query}', query) }}
              </slot>
            </p>
            <p v-else-if="!filteredOptions.length" :class="uiMenu.empty">
              <slot name="empty" :query="query">
                {{ uiMenu.default.empty.label }}
              </slot>
            </p>
          </HComboboxOptions>
        </div>
      </Transition>
    </div>
  </HCombobox>
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
import type { InputSize, InputColor, InputVariant, PopperOptions, Strategy, DeepPartial } from '../../types/index'
// @ts-expect-error
import appConfig from '#build/app.config'
import { input, inputMenu } from '#ui/ui.config'
import { useId } from '#imports'

const config = mergeConfig<typeof input>(appConfig.ui.strategy, appConfig.ui.input, input)

const configMenu = mergeConfig<typeof inputMenu>(appConfig.ui.strategy, appConfig.ui.inputMenu, inputMenu)

export default defineComponent({
  components: {
    HCombobox,
    HComboboxButton,
    HComboboxOptions,
    HComboboxOption,
    HComboboxInput,
    UIcon,
    UAvatar
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, Object, Array] as PropType<string | number | object | Array<any> | null>,
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
      default: () => configMenu.default.trailingIcon
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
    nullable: {
      type: Boolean,
      default: false
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
      type: String as PropType<InputSize>,
      default: null,
      validator(value: string) {
        return Object.keys(config.size).includes(value)
      }
    },
    color: {
      type: String as PropType<InputColor>,
      default: () => config.default.color,
      validator(value: string) {
        return [...appConfig.ui.colors, ...Object.keys(config.color)].includes(value)
      }
    },
    variant: {
      type: String as PropType<InputVariant>,
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
    search: {
      type: Function as PropType<((query: string) => Promise<any[]> | any[])>,
      default: undefined
    },
    searchAttributes: {
      type: Array,
      default: null
    },
    searchLazy: {
      type: Boolean,
      default: false
    },
    debounce: {
      type: Number,
      default: 200
    },
    popper: {
      type: Object as PropType<PopperOptions>,
      default: () => ({})
    },
    inputClass: {
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
    const { ui, attrs } = useUI('input', toRef(props, 'ui'), config, toRef(props, 'class'))
    const { ui: uiMenu } = useUI('inputMenu', toRef(props, 'uiMenu'), configMenu)

    const popper = computed<PopperOptions>(() => defu({}, props.popper, uiMenu.value.popper as PopperOptions))

    const [trigger, container] = usePopper(popper.value)

    const { size: sizeButtonGroup, rounded } = useInjectButtonGroup({ ui, props })
    const { emitFormBlur, emitFormChange, inputId, color, size: sizeFormGroup, name } = useFormGroup(props, config)

    const size = computed(() => sizeButtonGroup.value ?? sizeFormGroup.value)

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

    const label = computed(() => {
      if (!props.modelValue) return null

      function getValue(value: any) {
        if (props.valueAttribute) {
          return accessor(value, props.valueAttribute)
        }

        return value
      }

      function compareValues(value1: any, value2: any) {
        if (by.value && typeof by.value !== 'function' && typeof value1 === 'object' && typeof value2 === 'object') {
          return isEqual(value1[props.by], value2[props.by])
        }
        return isEqual(value1, value2)
      }

      if (props.valueAttribute) {
        const option = options.value.find((option) => {
          const optionValue = getValue(option)

          return compareValues(optionValue, props.modelValue)
        })

        return option ? accessor(option, props.optionAttribute) : null
      } else {
        return ['string', 'number'].includes(typeof props.modelValue) ? props.modelValue : accessor(props.modelValue as Record<string, any>, props.optionAttribute)
      }
    })

    const inputClass = computed(() => {
      const variant = ui.value.color?.[color.value as string]?.[props.variant as string] || ui.value.variant[props.variant]

      return twMerge(twJoin(
        ui.value.base,
        ui.value.form,
        rounded.value,
        ui.value.placeholder,
        ui.value.size[size.value],
        props.padded ? ui.value.padding[size.value] : 'p-0',
        variant?.replaceAll('{color}', color.value),
        (isLeading.value || slots.leading) && ui.value.leading.padding[size.value],
        (isTrailing.value || slots.trailing) && ui.value.trailing.padding[size.value]
      ), props.inputClass)
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

    const debouncedSearch = props.search && typeof props.search === 'function' ? useDebounceFn(props.search, props.debounce) : undefined

    const options = computedAsync(async () => {
      if (debouncedSearch) {
        return await debouncedSearch(query.value)
      }

      return props.options || []
    }, [], {
      lazy: props.searchLazy
    })

    function escapeRegExp(string: string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, match => `\\${match}`)
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

    watch(container, (value) => {
      if (value) {
        emit('open')
      } else {
        emit('close')
        emitFormBlur()
      }
    })

    function onUpdate(value: any) {
      query.value = ''

      if (toRaw(props.modelValue) === toRaw(value)) {
        return
      }

      emit('update:modelValue', value)
      emit('change', value)

      emitFormChange()
    }

    function accessor<T extends Record<string, any>>(obj: T, key: string) {
      return get(obj, key)
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
      label,
      isLeading,
      isTrailing,
      // eslint-disable-next-line vue/no-dupe-keys
      inputClass,
      leadingIconName,
      leadingIconClass,
      leadingWrapperIconClass,
      trailingIconName,
      trailingIconClass,
      trailingWrapperIconClass,
      filteredOptions,
      // eslint-disable-next-line vue/no-dupe-keys
      query,
      accessor,
      onUpdate,
      onQueryChange,
      // eslint-disable-next-line vue/no-dupe-keys
      by
    }
  }
})
</script>
