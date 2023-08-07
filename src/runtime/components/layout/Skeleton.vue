<template>
  <div :class="[ui.base, ui.background, ui.rounded]" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defuTwMerge } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  props: {
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.skeleton>>,
      default: () => ({})
    }
  },
  setup (props) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.skeleton>>(() => defuTwMerge({}, props.ui, appConfig.ui.skeleton))

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui
    }
  }
})
</script>
