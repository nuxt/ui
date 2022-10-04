<template>
  <transition appear v-bind="transitionClass">
    <div
      :class="['z-50 w-full pointer-events-auto', backgroundClass, roundedClass, shadowClass]"
      @mouseover="onMouseover"
      @mouseleave="onMouseleave"
    >
      <div :class="['relative overflow-hidden', roundedClass, ringClass]">
        <div class="p-4">
          <div class="flex gap-3" :class="{ 'items-start': description, 'items-center': !description }">
            <div v-if="iconName" class="flex-shrink-0">
              <Icon :name="iconName" :class="iconClass" />
            </div>
            <div class="w-0 flex-1">
              <p class="text-sm font-medium u-text-gray-900">
                {{ title }}
              </p>
              <p v-if="description" class="mt-1 text-sm leading-5 u-text-gray-500">
                {{ description }}
              </p>

              <div v-if="description && actions.length" class="mt-3 flex items-center gap-6">
                <button v-for="(action, index) of actions" :key="index" type="button" class="text-sm font-medium focus:outline-none text-primary-500 hover:text-primary-600 dark:hover:text-primary-400" @click.stop="onAction(action)">
                  {{ action.label }}
                </button>
              </div>
            </div>
            <div class="flex-shrink-0 flex items-center gap-3">
              <div v-if="!description && actions.length" class="flex items-center gap-2">
                <button v-for="(action, index) of actions" :key="index" type="button" class="text-sm font-medium focus:outline-none text-primary-500 hover:text-primary-600 dark:hover:text-primary-400" @click.stop="onAction(action)">
                  {{ action.label }}
                </button>
              </div>

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
import type { PropType } from 'vue'
import Icon from '../elements/Icon.vue'
import { useTimer } from '../../composables/useTimer'
import { classNames } from '../../utils'
import $ui from '#build/ui'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: null,
    validator (value: string) {
      return Object.keys($ui.notification.type).includes(value)
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
  backgroundClass: {
    type: String,
    default: () => $ui.notification.background
  },
  shadowClass: {
    type: String,
    default: () => $ui.notification.shadow
  },
  ringClass: {
    type: String,
    default: () => $ui.notification.ring
  },
  roundedClass: {
    type: String,
    default: () => $ui.notification.rounded
  },
  transitionClass: {
    type: Object,
    default: () => $ui.notification.transition
  },
  customClass: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  iconBaseClass: {
    type: String,
    default: () => $ui.notification.icon.base
  },
  timeout: {
    type: Number,
    default: 5000
  },
  actions: {
    type: Array as PropType<{
      label: string,
      click: Function
    }[]>,
    default: () => []
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
  return props.icon || $ui.notification.type[props.type]
})

const iconClass = computed(() => {
  return classNames(
    props.iconBaseClass,
    $ui.notification.icon.color[props.type] || 'u-text-gray-400'
  )
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

function onAction (action) {
  if (timer) {
    timer.stop()
  }

  if (action.click) {
    action.click()
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
  if (timer) {
    timer.stop()
  }
})
</script>

<script lang="ts">
export default { name: 'UNotification' }
</script>
