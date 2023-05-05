<template>
  <span :class="name" />
</template>

<script lang="ts">
export default defineComponent({
  props: {
    name: {
      type: String,
      required: true
    }
  }
})
</script>
