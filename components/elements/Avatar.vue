<template>
  <span :class="wrapperClass">
    <img v-if="url && !error" :class="avatarClass" :src="url" :alt="alt" :onerror="() => onError()">
    <span v-else-if="text || placeholder" :class="placeholderClass">{{ text || placeholder }}</span>

    <span v-if="chip" :class="chipClass" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { classNames } from '../../utils'
import { $theme } from '#theme'

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
      return Object.keys($theme('ui.avatar.size').value).includes(value)
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
    validator (value: string) {
      return Object.keys($theme('ui.avatar.chip.variant').value).includes(value)
    }
  },
  chipPosition: {
    type: String,
    default: 'top-right',
    validator (value: string) {
      return Object.keys($theme('ui.avatar.chip.position').value).includes(value)
    }
  },
  wrapperClass: {
    type: String,
    default () {
      return $theme('ui.avatar.wrapper').value
    }
  },
  backgroundClass: {
    type: String,
    default () { return $theme('ui.avatar.background').value }
  },
  placeholderClass: {
    type: String,
    default () { return $theme('ui.avatar.placeholder').value }
  },
  roundedClass: {
    type: String,
    default () { return $theme('ui.avatar.rounded').value }
  }
})

const wrapperClass = computed(() => {
  return classNames(
    props.wrapperClass,
    props.backgroundClass,
    $theme('ui.avatar.size').value[props.size],
    props.rounded ? 'rounded-full' : props.roundedClass
  )
})

const avatarClass = computed(() => {
  return classNames(
    $theme('ui.avatar.size').value[props.size],
    props.rounded ? 'rounded-full' : props.roundedClass
  )
})

const chipClass = computed(() => {
  return classNames(
    $theme('ui.avatar.chip.base').value,
    $theme('ui.avatar.chip.position').value[props.chipPosition],
    $theme('ui.avatar.chip.variant').value[props.chipVariant],
    $theme('ui.avatar.chip.size').value[props.size]
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

<script lang="ts">
export default { name: 'UAvatar' }
</script>
