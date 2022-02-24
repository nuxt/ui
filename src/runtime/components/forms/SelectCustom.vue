<template>
  <Listbox
    :model-value="modelValue"
    as="div"
    :class="wrapperClass"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <input :value="modelValue" :required="required" class="absolute inset-0 w-px opacity-0 cursor-default" tabindex="-1">

    <ListboxButton :class="selectCustomClass">
      <slot>
        <span v-if="modelValue" class="block truncate">{{ modelValue[textAttribute] }}</span>
        <span v-else class="block truncate u-text-gray-400">{{ placeholder }}</span>
      </slot>
      <span :class="iconWrapperClass">
        <Icon name="heroicons-solid:selector" :class="iconClass" aria-hidden="true" />
      </span>
    </ListboxButton>

    <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <ListboxOptions :class="listBaseClass">
        <ListboxOption
          v-for="(option, index) in options"
          v-slot="{ active, selected, disabled }"
          :key="index"
          as="template"
          :value="option"
          :disabled="option.disabled"
        >
          <li :class="resolveOptionClass({ active, disabled })">
            <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
              <slot name="option" :option="option">
                {{ option[textAttribute] }}
              </slot>
            </span>

            <span v-if="selected" :class="resolveOptionIconClass({ active })">
              <Icon name="heroicons-solid:check" :class="listOptionIconSizeClass" aria-hidden="true" />
            </span>
          </li>
        </ListboxOption>
      </ListboxOptions>
    </transition>
  </Listbox>
</template>

<script setup>
import { computed } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue'
import Icon from '../elements/Icon'
import { classNames } from '../../utils'
import $ui from '#build/ui'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  required: {
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
    validator (value) {
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
  iconBaseClass: {
    type: String,
    default: () => $ui.selectCustom.icon.base
  },
  customClass: {
    type: String,
    default: null
  },
  listBaseClass: {
    type: String,
    default: () => $ui.selectCustom.list.base
  },
  listOptionBaseClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.base
  },
  listOptionActiveClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.active
  },
  listOptionInactiveClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.inactive
  },
  listOptionDisabledClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.disabled
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
  }
})

defineEmits(['update:modelValue'])

const selectCustomClass = computed(() => {
  return classNames(
    props.baseClass,
    $ui.selectCustom.size[props.size],
    $ui.selectCustom.spacing[props.size],
    $ui.selectCustom.appearance.default,
    $ui.selectCustom.trailing.spacing[props.size],
    props.customClass
  )
})

const iconClass = computed(() => {
  return classNames(
    props.iconBaseClass,
    $ui.selectCustom.icon.size[props.size],
    $ui.selectCustom.icon.trailing.spacing[props.size]
  )
})

const iconWrapperClass = $ui.selectCustom.icon.trailing.wrapper

function resolveOptionClass ({ active, disabled }) {
  return classNames(
    props.listOptionBaseClass,
    active ? props.listOptionActiveClass : props.listOptionInactiveClass,
    disabled && props.listOptionDisabledClass
  )
}

function resolveOptionIconClass ({ active }) {
  return classNames(
    props.listOptionIconBaseClass,
    active ? props.listOptionIconActiveClass : props.listOptionIconInactiveClass
  )
}
</script>
