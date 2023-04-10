<template>
  <span :class="wrapperClass">
    <img v-if="url && !error" :class="avatarClass" :src="url" :alt="alt" :onerror="() => onError()">
    <span v-else-if="text || placeholder" :class="ui.placeholder">{{ text || placeholder }}</span>

    <span v-if="chipVariant" :class="chipClass" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { classNames } from '../../utils'
import $ui from '#build/ui'

const props = defineProps({
  src: {
    type: [String, Boolean],
    default: null
  },
  alt: {
    type: String,
    default: null
  },
  text: {
    type: String,
    default: null
  },
  size: {
    type: String,
    default: 'md',
    validator (value: string) {
      return Object.keys($ui.avatar.size).includes(value)
    }
  },
  chipVariant: {
    type: String,
    default: null,
    validator (value: string) {
      return Object.keys($ui.avatar.chip.variant).includes(value)
    }
  },
  chipPosition: {
    type: String,
    default: 'top-right',
    validator (value: string) {
      return Object.keys($ui.avatar.chip.position).includes(value)
    }
  },
  ui: {
    type: Object as PropType<Partial<typeof $ui.avatar>>,
    default: () => $ui.avatar
  }
})

const ui = computed<Partial<typeof $ui.avatar>>(() => defu({}, props.ui, $ui.avatar))

const wrapperClass = computed(() => {
  return classNames(
    ui.value.wrapper,
    ui.value.background,
    ui.value.rounded,
    ui.value.size[props.size]
  )
})

const avatarClass = computed(() => {
  return classNames(
    ui.value.rounded,
    ui.value.size[props.size]
  )
})

const chipClass = computed(() => {
  return classNames(
    ui.value.chip.base,
    ui.value.chip.variant[props.chipVariant],
    ui.value.chip.position[props.chipPosition],
    ui.value.chip.size[props.size]
  )
})

const url = computed(() => {
  if (typeof props.src === 'boolean') {
    return null
  }
  return props.src
})

const placeholder = computed(() => {
  return (props.alt || '').split(' ').map(word => word.charAt(0)).join('').substring(0, 2)
})

const error = ref(false)

watch(() => props.src, () => {
  if (error.value) {
    error.value = false
  }
})

function onError () {
  error.value = true
}
</script>
