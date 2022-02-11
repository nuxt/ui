<template>
  <Listbox v-slot="{ open, disabled }" v-model="selectedOption" as="div" class="relative">
    <ListboxButton as="div">
      <slot :open="open" :disabled="disabled">
        <UButton
          variant="white"
          icon="heroicons-solid:selector"
          icon-base-class="u-text-gray-400"
          trailing
          :size="size"
          :label="selectedOption[textAttribute]"
        />
      </slot>
    </ListboxButton>

    <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <ListboxOptions class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 u-ring-gray-200 overflow-auto focus:outline-none sm:text-sm">
        <ListboxOption
          v-for="option in options"
          v-slot="{ active, selected }"
          :key="option"
          as="template"
          :value="option"
          :disabled="option.disabled"
        >
          <li :class="[active ? 'text-white bg-primary-600' : 'u-text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9']">
            <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
              {{ option[textAttribute] }}
            </span>

            <span v-if="selected" :class="[active ? 'text-white' : 'text-primary-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
              <Icon v-show="selected" name="heroicons-solid:check" />
            </span>
          </li>
        </ListboxOption>
      </ListboxOptions>
    </transition>
  </Listbox>
</template>

<script setup>
import { ref, computed } from 'vue'
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
  size: {
    type: String,
    default: 'md',
    validator (value) {
      return Object.keys($ui.selectCustom.size).includes(value)
    }
  },
  textAttribute: {
    type: String,
    default: 'text'
  }
})

const emit = defineEmits(['update:modelValue'])

const selectedOption = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})
</script>
