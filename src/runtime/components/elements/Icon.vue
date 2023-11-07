<template>
  <Icon v-if="dynamic" :name="name" />
  <span v-else :class="name" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// @ts-expect-error
import appConfig from '#build/app.config'

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true
    },
    dynamic: {
      type: Boolean,
      default: () => !!appConfig.ui?.icons?.dynamic
    }
  }
})
</script>
