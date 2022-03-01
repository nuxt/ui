<template>
  <span :class="wrapperClass">
    <img v-if="url" :class="avatarClass" :src="url" :alt="alt">
    <span v-else-if="text || placeholder" :class="placeholderClass">{{ text || placeholder }}</span>

    <span v-if="chip" :class="chipClass" />
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'
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
    validator (value) {
      return Object.keys($ui.avatar.size).includes(value)
    }
  },
  rounded: {
    type: Boolean,
    default: true
  },
  chip: {
    type: Boolean,
    default: false
  },
  chipVariant: {
    type: String,
    default: 'primary',
    validator (value) {
      return Object.keys($ui.avatar.chip.variant).includes(value)
    }
  },
  chipPosition: {
    type: String,
    default: 'top-right',
    validator (value) {
      return Object.keys($ui.avatar.chip.position).includes(value)
    }
  },
  wrapperClass: {
    type: String,
    default: () => $ui.avatar.wrapper
  },
  backgroundClass: {
    type: String,
    default: () => $ui.avatar.background
  },
  placeholderClass: {
    type: String,
    default: () => $ui.avatar.placeholder
  }
})

const wrapperClass = computed(() => {
  return classNames(
    props.wrapperClass,
    props.backgroundClass,
    $ui.avatar.size[props.size],
    props.rounded ? 'rounded-full' : 'rounded-md'
  )
})

const avatarClass = computed(() => {
  return classNames(
    $ui.avatar.size[props.size],
    props.rounded ? 'rounded-full' : 'rounded-md'
  )
})

const chipClass = computed(() => {
  return classNames(
    $ui.avatar.chip.base,
    $ui.avatar.chip.position[props.chipPosition],
    $ui.avatar.chip.variant[props.chipVariant],
    $ui.avatar.chip.size[props.size]
  )
})

const url = computed(() => {
  if (typeof props.src === 'boolean') {
    return null
  }
  return props.src
})

const placeholder = computed(() => {
  return (props.alt || '').split(' ').map(word => word.charAt(0)).join('').substr(0, 2)
})
</script>
