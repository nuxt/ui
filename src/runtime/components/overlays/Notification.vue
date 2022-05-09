<template>
  <transition
    appear
    enter-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-active-class="transition duration-300 ease-out transform"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-class="opacity-100"
    leave-active-class="transition duration-100 ease-in"
    leave-to-class="opacity-0"
  >
    <div
      class="z-50 w-full bg-white rounded-lg shadow-lg pointer-events-auto dark:bg-gray-800"
      @mouseover="onMouseover"
      @mouseleave="onMouseleave"
    >
      <div class="relative overflow-hidden rounded-lg ring-1 u-ring-gray-200">
        <div class="p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <Icon :name="iconName" class="w-6 h-6" :class="iconClass" />
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium leading-5 u-text-gray-900">
                {{ title }}
              </p>
              <p v-if="description" class="mt-1 text-sm leading-5 u-text-gray-500">
                {{ description }}
              </p>
              <Button
                v-if="undo"
                variant="white"
                size="xs"
                class="mt-2"
                @click.stop="onUndo"
              >
                Undo
              </Button>
            </div>
            <div class="flex-shrink-0 ml-4">
              <button
                class="transition duration-150 ease-in-out u-text-gray-400 focus:outline-none hover:u-text-gray-500 focus:u-text-gray-500"
                @click.stop="onClose"
              >
                <span class="sr-only">Close</span>
                <Icon name="heroicons-solid:x" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div v-if="timeout" class="absolute bottom-0 left-0 right-0 h-1">
          <div class="h-1 bg-primary-500" :style="progressBarStyle" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue'

import Icon from '../elements/Icon'
import Button from '../elements/Button'
import { useTimer } from '../../composables/useTimer'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    default: 'info',
    validator (value: string) {
      return ['info', 'success', 'error', 'warning'].includes(value)
    }
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  timeout: {
    type: Number,
    default: 5000
  },
  undo: {
    type: Function,
    default: null
  },
  callback: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['close'])

let timer: any = null
const remaining = ref(props.timeout)

const iconName = computed(() => {
  return props.icon || ({
    warning: 'heroicons-outline:exclamation-circle',
    info: 'heroicons-outline:information-circle',
    success: 'heroicons-outline:check-circle',
    error: 'heroicons-outline:x-circle'
  })[props.type]
})

const iconClass = computed(() => {
  return ({
    warning: 'text-orange-400',
    info: 'text-blue-400',
    success: 'text-green-400',
    error: 'text-red-400'
  })[props.type] || 'u-text-gray-400'
})

const progressBarStyle = computed(() => {
  const remainingPercent = remaining.value / props.timeout * 100
  return { width: `${remainingPercent || 0}%` }
})

function onMouseover () {
  if (timer) {
    timer.pause()
  }
}

function onMouseleave () {
  if (timer) {
    timer.resume()
  }
}

function onClose () {
  if (timer) {
    timer.stop()
  }

  if (props.callback) {
    props.callback()
  }

  emit('close')
}

function onUndo () {
  if (timer) {
    timer.stop()
  }

  if (props.undo) {
    props.undo()
  }

  emit('close')
}

onMounted(() => {
  if (!props.timeout) {
    return
  }

  timer = useTimer(() => {
    onClose()
  }, props.timeout)

  watchEffect(() => {
    remaining.value = timer.remaining.value
  })
})

onUnmounted(() => {
  timer.stop()
})
</script>
