<template>
  <Switch
    v-model="enabled"
    :class="[enabled ? 'bg-primary-600' : 'bg-tw-gray-200', 'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-200']"
  >
    <span :class="[enabled ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200']">
      <span :class="[enabled ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200', 'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity']" aria-hidden="true">
        <Icon :name="iconOff" class="h-3 w-3 text-tw-gray-400" />
      </span>
      <span :class="[enabled ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100', 'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity']" aria-hidden="true">
        <Icon :name="iconOn" class="h-3 w-3 text-primary-600" />
      </span>
    </span>
  </Switch>
</template>

<script setup>
import { Switch } from '@headlessui/vue'
import Icon from './Icon'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  iconOn: {
    type: String,
    default: ''
  },
  iconOff: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const enabled = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})
</script>
