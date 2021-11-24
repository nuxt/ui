<template>
  <div class="mx-auto sm:px-6 lg:px-8" :class="{ 'px-4': padded, 'max-w-7xl': constrained }">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    padded: {
      type: Boolean,
      default: false
    },
    constrained: {
      type: Boolean,
      default: true
    }
  }
}
</script>
