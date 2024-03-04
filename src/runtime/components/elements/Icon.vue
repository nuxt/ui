<template>
  <Icon v-if="dynamic" :name="name" />
  <span v-else :class="name" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useAppConfig } from '#imports'

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true
    },
    dynamic: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const appConfig = useAppConfig()

    // @ts-ignore
    const dynamic = computed(() => props.dynamic || appConfig.ui?.icons?.dynamic)

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      dynamic
    }
  }
})
</script>
