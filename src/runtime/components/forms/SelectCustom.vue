<template>
  <Combobox
    v-slot="{ open }"
    :by="by"
    :model-value="modelValue"
    :multiple="multiple"
    :nullable="nullable"
    :disabled="disabled"
    as="div"
    :class="wrapperClass"
    @update:model-value="onUpdate"
  >
    <input :value="modelValue" :required="required" class="absolute inset-0 w-px opacity-0 cursor-default" tabindex="-1">

    <ComboboxButton ref="trigger" v-slot="{ disabled: buttonDisabled }" as="div" class="inline-flex w-full">
      <slot :open="open" :disabled="buttonDisabled">
        <button :class="selectCustomClass" :disabled="disabled" type="button">
          <slot name="label">
            <span v-if="modelValue" class="block truncate">{{ modelValue[textAttribute] }}</span>
            <span v-else class="block truncate u-text-gray-400">{{ placeholder }}</span>
          </slot>
          <slot name="icon">
            <span :class="iconWrapperClass">
              <Icon :name="icon" :class="iconClass" aria-hidden="true" />
            </span>
          </slot>
        </button>
      </slot>
    </ComboboxButton>

    <div v-if="open" ref="container" :class="[listContainerClass, listWidthClass]">
      <transition appear v-bind="listTransitionClass">
        <ComboboxOptions static :class="listBaseClass">
          <ComboboxInput
            v-if="searchable"
            ref="searchInput"
            :display-value="() => query"
            name="q"
            placeholder="Search..."
            autofocus
            autocomplete="off"
            :class="listInputClass"
            @change="query = $event.target.value"
          />
          <ComboboxOption
            v-for="(option, index) in filteredOptions"
            v-slot="{ active, selected, disabled: optionDisabled }"
            :key="index"
            as="template"
            :value="option"
            :disabled="option.disabled"
          >
            <li :class="resolveOptionClass({ active, selected, disabled: optionDisabled })">
              <div :class="listOptionContainerClass">
                <slot name="option" :option="option" :active="active" :selected="selected">
                  <span class="block truncate">{{ option[textAttribute] }}</span>
                </slot>
              </div>

              <span v-if="selected" :class="resolveOptionIconClass({ active })">
                <Icon :name="listOptionIcon" :class="listOptionIconSizeClass" aria-hidden="true" />
              </span>
            </li>
          </ComboboxOption>

          <ComboboxOption v-if="creatable && queryOption && !filteredOptions.length" v-slot="{ active, selected }" :value="queryOption" as="template">
            <li :class="resolveOptionClass({ active, selected })">
              <div :class="listOptionContainerClass">
                <slot name="option-create" :option="queryOption" :active="active" :selected="selected">
                  <span class="block truncate">Create "{{ queryOption[textAttribute] }}"</span>
                </slot>
              </div>
            </li>
          </ComboboxOption>
          <p v-else-if="searchable && query && !filteredOptions.length" :class="listOptionEmptyClass">
            <slot name="option-empty" :query="query">
              No results found for "{{ query }}".
            </slot>
          </p>
        </ComboboxOptions>
      </transition>
    </div>
  </Combobox>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PropType, ComponentPublicInstance } from 'vue'
import { defu } from 'defu'
import {
  Combobox,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  ComboboxInput
} from '@headlessui/vue'
import Icon from '../elements/Icon.vue'
import { classNames } from '../../utils'
import { usePopper } from '../../composables/usePopper'
import type { PopperOptions } from '../../types'
import $ui from '#build/ui'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object, Array],
    default: ''
  },
  by: {
    type: String,
    default: undefined
  },
  options: {
    type: Array as PropType<{ [key: string]: any, disabled?: boolean }[]>,
    default: () => []
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
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
    default: false
  },
  creatable: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  size: {
    type: String,
    default: 'md',
    validator (value: string) {
      return Object.keys($ui.selectCustom.size).includes(value)
    }
  },
  wrapperClass: {
    type: String,
    default: () => $ui.selectCustom.wrapper
  },
  baseClass: {
    type: String,
    default: () => $ui.selectCustom.base
  },
  icon: {
    type: String,
    default: () => $ui.selectCustom.icon.name
  },
  iconBaseClass: {
    type: String,
    default: () => $ui.selectCustom.icon.base
  },
  customClass: {
    type: String,
    default: null
  },
  appearance: {
    type: String,
    default: 'default',
    validator (value: string) {
      return Object.keys($ui.selectCustom.appearance).includes(value)
    }
  },
  listBaseClass: {
    type: String,
    default: () => $ui.selectCustom.list.base
  },
  listContainerClass: {
    type: String,
    default: () => $ui.selectCustom.list.container
  },
  listWidthClass: {
    type: String,
    default: () => $ui.selectCustom.list.width
  },
  listInputClass: {
    type: String,
    default: () => $ui.selectCustom.list.input
  },
  listTransitionClass: {
    type: Object,
    default: () => $ui.selectCustom.list.transition
  },
  listOptionBaseClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.base
  },
  listOptionContainerClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.container
  },
  listOptionActiveClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.active
  },
  listOptionInactiveClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.inactive
  },
  listOptionSelectedClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.selected
  },
  listOptionUnselectedClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.unselected
  },
  listOptionDisabledClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.disabled
  },
  listOptionEmptyClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.empty
  },
  listOptionIcon: {
    type: String,
    default: () => $ui.selectCustom.list.option.icon.name
  },
  listOptionIconBaseClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.icon.base
  },
  listOptionIconActiveClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.icon.active
  },
  listOptionIconInactiveClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.icon.inactive
  },
  listOptionIconSizeClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.icon.size
  },
  textAttribute: {
    type: String,
    default: 'text'
  },
  searchAttributes: {
    type: Array,
    default: null
  },
  popperOptions: {
    type: Object as PropType<PopperOptions>,
    default: () => {}
  }
})

const emit = defineEmits(['update:modelValue'])

const popperOptions = computed<PopperOptions>(() => defu({}, props.popperOptions, $ui.selectCustom.popperOptions))

const [trigger, container] = usePopper(popperOptions.value)

const query = ref('')
const searchInput = ref<ComponentPublicInstance<HTMLElement>>()

const selectCustomClass = computed(() => {
  return classNames(
    props.baseClass,
    $ui.selectCustom.size[props.size],
    $ui.selectCustom.spacing[props.size],
    $ui.selectCustom.appearance[props.appearance],
    $ui.selectCustom.trailing.spacing[props.size],
    props.customClass
  )
})

const iconClass = computed(() => {
  return classNames(
    props.iconBaseClass,
    $ui.selectCustom.icon.size[props.size],
    'mr-2'
  )
})

const filteredOptions = computed(() =>
  query.value === ''
    ? props.options
    : props.options.filter((option: any) => {
      return (props.searchAttributes?.length ? props.searchAttributes : [props.textAttribute]).some((searchAttribute: any) => {
        return option[searchAttribute] && option[searchAttribute].search(new RegExp(query.value, 'i')) !== -1
      })
    })
)

const queryOption = computed(() => {
  return query.value === '' ? null : { [props.textAttribute]: query.value }
})

const iconWrapperClass = classNames(
  $ui.selectCustom.icon.trailing.wrapper
)

function resolveOptionClass ({ active, selected, disabled }: { active: boolean, selected: boolean, disabled?: boolean }) {
  return classNames(
    props.listOptionBaseClass,
    active ? props.listOptionActiveClass : props.listOptionInactiveClass,
    selected ? props.listOptionSelectedClass : props.listOptionUnselectedClass,
    disabled && props.listOptionDisabledClass
  )
}

function resolveOptionIconClass ({ active }: { active: boolean }) {
  return classNames(
    props.listOptionIconBaseClass,
    active ? props.listOptionIconActiveClass : props.listOptionIconInactiveClass
  )
}

function onUpdate (event) {
  if (query.value && searchInput.value?.$el) {
    query.value = ''
    // explicitly set input text because `ComboboxInput` `displayValue` is not reactive
    searchInput.value.$el.value = ''
  }
  emit('update:modelValue', event)
}
</script>

<script lang="ts">
export default { name: 'USelectCustom' }
</script>
