<template>
  <component :is="as" :class="[ui.base, ui.padding, ui.constrained]">
    <slot />
  </component>
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
    as: {
      type: String,
      default: 'div'
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.container>>,
      default: () => ({})
    }
  },
  setup (props) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.container>>(() => defuTwMerge({}, props.ui, appConfig.ui.container))

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui
    }
  }
})
</script>
