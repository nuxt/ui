<template>
  <Icon v-bind="$props" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true
    },
    mode: {
      type: String as PropType<'svg' | 'css'>,
      required: false,
      default: null
    },
    size: {
      type: [Number, String],
      required: false,
      default: null
    },
    customize: {
      type: Function,
      required: false,
      default: null
    }
  }
})
</script>
