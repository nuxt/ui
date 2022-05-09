<template>
  <div class="rounded-md p-4" :class="variantClass">
    <div class="flex">
      <div class="flex-shrink-0">
        <Icon :name="iconName" :class="iconClass" class="h-5 w-5" />
      </div>
      <div class="ml-3 flex-1 md:flex md:justify-between">
        <p v-if="title" class="text-sm leading-5" :class="titleClass">
          {{ title }}
        </p>
        <p v-if="link" class="mt-3 text-sm leading-5 md:mt-0 md:ml-6">
          <NuxtLink
            :to="to"
            class="whitespace-nowrap font-medium"
            :class="linkClass"
            @click="click && click()"
          >
            {{ link }} &rarr;
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../elements/Icon'

const props = defineProps({
  variant: {
    type: String,
    default: 'info',
    validator (value: string) {
      return ['info', 'warning', 'error', 'success'].includes(value)
    }
  },
  to: {
    type: [String, Object],
    default: null
  },
  click: {
    type: Function,
    default: null
  },
  title: {
    type: String,
    default: null
  },
  link: {
    type: String,
    default: null
  }
})

const iconName = computed(() => {
  return ({
    info: 'heroicons-solid:information-circle',
    warning: 'heroicons-solid:exclamation',
    error: 'heroicons-solid:x-circle',
    success: 'heroicons-solid:check-circle'
  })[props.variant]
})

const variantClass = computed(() => {
  return ({
    info: 'bg-blue-50',
    warning: 'bg-orange-50',
    error: 'bg-red-50',
    success: 'bg-green-50'
  })[props.variant]
})

const iconClass = computed(() => {
  return ({
    info: 'text-blue-400',
    warning: 'text-orange-400',
    error: 'text-red-400',
    success: 'text-green-400'
  })[props.variant]
})

const titleClass = computed(() => {
  return ({
    info: 'text-blue-700',
    warning: 'text-orange-700',
    error: 'text-red-700',
    success: 'text-green-700'
  })[props.variant]
})

const linkClass = computed(() => {
  return ({
    info: 'text-blue-700 hover:text-blue-600',
    warning: 'text-orange-700 hover:text-orange-600',
    error: 'text-red-700 hover:text-red-600',
    success: 'text-green-700 hover:text-green-600'
  })[props.variant]
})
</script>
