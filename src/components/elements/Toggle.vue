<template>
  <div class="py-16 flex items-center">
    <span v-if="textLeading" :class="textClass" class="pr-2">{{ textLeading }}</span>
    <Switch
      :class="props.modelValue ? 'bg-primary-600' : 'bg-tw-gray-200'"
      class="relative inline-flex flex-shrink-0 h-38px w-74px border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      @click="emits('update:modelValue', !modelValue)"
    >
      <div
        :class="props.modelValue ? 'translate-x-9' : 'translate-x-0'"
        class="flex items-center justify-center h-34px w-34px pointer-events-none inline-block rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200"
      >
        <Icon :name="modelValue ? icon : (iconOff ? iconOff : icon)" />
      </div>
    </Switch>
    <span v-if="textTrailing" :class="textClass" class="pl-2">{{ textTrailing }}</span>
  </div>
</template>

<script setup lang="ts">
import { Switch } from '@headlessui/vue'
import { computed } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  iconOff: {
    type: String,
    default: ''
  },
  textLeading: {
    type: String,
    default: ''
  },
  textTrailing: {
    type: String,
    default: ''
  },
  textHighlight: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator (value: string) {
      return ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    }
  }
})

const emits = defineEmits(['update:modelValue'])

const textClass = computed(() => {
  return [
    ({
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-base'
    })[props.size],
    props.textHighlight && props.modelValue ? 'text-primary-600' : 'text-tw-gray-900',
    'font-medium'
  ].join(' ')
})
</script>
