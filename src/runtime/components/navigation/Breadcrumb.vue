<template>
  ...
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import type { BreadcrumbItem } from '../../types/breadcrumb'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  props: {
    items: {
      type: Array as PropType<BreadcrumbItem[]>,
      default: () => []
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.breadcrumb>>,
      default: () => appConfig.ui.breadcrumb
    }
  },
  setup (props) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.breadcrumb>>(() => defu({}, props.ui, appConfig.ui.breadcrumb))

  
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui
    }
  }
})
</script>
