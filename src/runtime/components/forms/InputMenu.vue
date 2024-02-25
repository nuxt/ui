<template>
  <HCombobox
    v-slot="{ open }"
    :by="by"
    :name="_name"
    :model-value="modelValue"
    :disabled="disabled"
    :nullable="nullable"
    as="div"
    :class="_ui.wrapper"
    @update:model-value="onUpdate"
  >
    <div :class="_uiMenu.trigger">
      <HComboboxInput
        :id="inputId"
        :name="_name"
        :required="required"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="_inputClass"
        autocomplete="off"
        v-bind="attrs"
        :display-value="() => _query ? _query : label"
        @change="onChange"
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

    <div v-if="open" ref="container" :class="[_uiMenu.container, _uiMenu.width]">
      <Transition appear v-bind="_uiMenu.transition">
        <div>
          <div v-if="_popper.arrow" data-popper-arrow :class="Object.values(_uiMenu.arrow)" />

          <HComboboxOptions static :class="[_uiMenu.base, _uiMenu.ring, _uiMenu.rounded, _uiMenu.shadow, _uiMenu.background, _uiMenu.padding, _uiMenu.height]">
            <HComboboxOption
              v-for="(option, index) in filteredOptions"
              v-slot="{ active, selected, disabled: optionDisabled }"
              :key="index"
              as="template"
              :value="valueAttribute ? option[valueAttribute] : option"
              :disabled="option.disabled"
            >
              <li :class="[_uiMenu.option.base, _uiMenu.option.rounded, _uiMenu.option.padding, _uiMenu.option.size, _uiMenu.option.color, active ? _uiMenu.option.active : _uiMenu.option.inactive, selected && _uiMenu.option.selected, optionDisabled && _uiMenu.option.disabled]">
                <div :class="_uiMenu.option.container">
                  <slot name="option" :option="option" :active="active" :selected="selected">
                    <UIcon v-if="option.icon" :name="option.icon" :class="[_uiMenu.option.icon.base, active ? _uiMenu.option.icon.active : _uiMenu.option.icon.inactive, option.iconClass]" aria-hidden="true" />
                    <UAvatar
                      v-else-if="option.avatar"
                      v-bind="{ size: _uiMenu.option.avatar.size, ...option.avatar }"
                      :class="_uiMenu.option.avatar.base"
                      aria-hidden="true"
                    />
                    <span v-else-if="option.chip" :class="_uiMenu.option.chip.base" :style="{ background: `#${option.chip}` }" />

                    <span class="truncate">{{ ['string', 'number'].includes(typeof option) ? option : option[optionAttribute] }}</span>
                  </slot>
                </div>

                <span v-if="selected" :class="[_uiMenu.option.selectedIcon.wrapper, _uiMenu.option.selectedIcon.padding]">
                  <UIcon :name="selectedIcon" :class="_uiMenu.option.selectedIcon.base" aria-hidden="true" />
                </span>
              </li>
            </HComboboxOption>

            <p v-if="_query && !filteredOptions.length" :class="_uiMenu.option.empty">
              <slot name="option-empty" :query="_query">
                No results for "{{ _query }}".
              </slot>
            </p>
            <p v-else-if="!filteredOptions.length" :class="_uiMenu.empty">
              <slot name="empty" :query="_query">
                No options.
              </slot>
            </p>
          </HComboboxOptions>
        </div>
      </Transition>
    </div>
  </HCombobox>
</template>

<script lang="ts">
import { ref, computed, toRef, watch, defineComponent } from 'vue'
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
import UIcon from '../elements/Icon.vue'
import UAvatar from '../elements/Avatar.vue'
import { useUI } from '../../composables/useUI'
import { usePopper } from '../../composables/usePopper'
import { useFormGroup } from '../../composables/useFormGroup'
import { get, mergeConfig } from '../../utils'
import { useInjectButtonGroup } from '../../composables/useButtonGroup'
import type { InputSize, InputColor, InputVariant, PopperOptions, Strategy } from '../../types'
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
      type: [String, Number, Object, Array],
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
      validator (value: string) {
        return Object.keys(config.size).includes(value)
      }
    },
    color: {
      type: String as PropType<InputColor>,
      default: () => config.default.color,
      validator (value: string) {
        return [...appConfig.ui.colors, ...Object.keys(config.color)].includes(value)
      }
    },
    variant: {
      type: String as PropType<InputVariant>,
      default: () => config.default.variant,
      validator (value: string) {
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
      type: Object as PropType<Partial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    },
    uiMenu: {
      type: Object as PropType<Partial<typeof configMenu> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'update:query', 'open', 'close', 'change'],
  setup (props, { emit, slots }) {
    const { ui, attrs } = useUI('input', toRef(props, 'ui'), config, toRef(props, 'class'))
    const { ui: uiMenu } = useUI('inputMenu', toRef(props, 'uiMenu'), configMenu)

    const popper = computed<PopperOptions>(() => defu({}, props.popper, uiMenu.value.popper as PopperOptions))

    const [trigger, container] = usePopper(popper.value)

    const { size: sizeButtonGroup, rounded } = useInjectButtonGroup({ ui, props })
    const { emitFormBlur, emitFormChange, inputId, color, size: sizeFormGroup, name } = useFormGroup(props, config)

    const size = computed(() => sizeButtonGroup.value || sizeFormGroup.value)

    const internalQuery = ref('')
    const query = computed({
      get () {
        return props.query ?? internalQuery.value
      },
      set (value) {
        internalQuery.value = value
        emit('update:query', value)
      }
    })

    const label = computed(() => {
      if (!props.modelValue) {
        return
      }

      if (props.valueAttribute) {
        const option = props.options.find(option => option[props.valueAttribute] === props.modelValue)
        return option ? option[props.optionAttribute] : null
      } else {
        return ['string', 'number'].includes(typeof props.modelValue) ? props.modelValue : props.modelValue[props.optionAttribute]
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

    const filteredOptions = computedAsync(async () => {
      if (debouncedSearch) {
        return await debouncedSearch(query.value)
      }

      if (query.value === '') {
        return props.options
      }

      return (props.options as any[]).filter((option: any) => {
        return (props.searchAttributes?.length ? props.searchAttributes : [props.optionAttribute]).some((searchAttribute: any) => {
          if (['string', 'number'].includes(typeof option)) {
            return String(option).search(new RegExp(query.value, 'i')) !== -1
          }

          const child = get(option, searchAttribute)

          return child !== null && child !== undefined && String(child).search(new RegExp(query.value, 'i')) !== -1
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

    function onUpdate (event: any) {
      query.value = ''
      emit('update:modelValue', event)
      emit('change', event)
      emitFormChange()
    }

    function onChange (event: any) {
      query.value = event.target.value
    }

    provideUseId(() => useId())

    return {
      _ui: ui,
      _uiMenu: uiMenu,
      attrs,
      _name: name,
      inputId,
      _popper: popper,
      trigger,
      container,
      label,
      isLeading,
      isTrailing,
      _inputClass: inputClass,
      leadingIconName,
      leadingIconClass,
      leadingWrapperIconClass,
      trailingIconName,
      trailingIconClass,
      trailingWrapperIconClass,
      filteredOptions,
      _query: query,
      onUpdate,
      onChange
    }
  }
})
</script>
