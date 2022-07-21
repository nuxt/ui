<template>
  <div :class="containerClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { classNames } from '../../utils'
import $ui from '#build/ui'

const props = defineProps({
  padded: {
    type: Boolean,
    default: false
  },
  constrained: {
    type: Boolean,
    default: true
  },
  constrainedClass: {
    type: String,
    default: () => $ui.container.constrained
  }
})

const containerClass = computed(() => {
  return classNames(
    'mx-auto sm:px-6 lg:px-8',
    props.padded && 'px-4',
    props.constrained && props.constrainedClass
  )
})
</script>

<script lang="ts">
export default { name: 'UContainer' }
</script>
