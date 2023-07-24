<template>
  <div
    v-for="i in count"
    :key="i"
    :class="[ui.base, ui.background, ui.rounded, $attrs.class]"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  props: {
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.skeleton>>,
      default: () => appConfig.ui.skeleton
    },
    count: {
      type: Number,
      default: 1
    }
  },
  setup (props) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.skeleton>>(() => defu({}, props.ui, appConfig.ui.skeleton))

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui
    }
  }
})
</script>
