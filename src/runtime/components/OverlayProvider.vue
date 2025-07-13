<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/overlay-provider'
import type { ComponentConfig } from '../types/utils'

type OverlayProvider = ComponentConfig<typeof theme, AppConfig, 'overlayProvider'>

export interface OverlayProviderProps {
  /**
   * Allow the overlay to nicely stack on top of each other.
   * @defaultValue false
   */
  stacked?: boolean
  class?: any
  ui?: OverlayProvider['slots']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useOverlay } from '../composables/useOverlay'
import type { Overlay } from '../composables/useOverlay'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<OverlayProviderProps>(), {
  stacked: false
})

const appConfig = useAppConfig() as OverlayProvider['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.overlayProvider || {}) })({
  stacked: props.stacked
}))

const { overlays, unmount, close } = useOverlay()

const mountedOverlays = computed(() => overlays.filter((overlay: Overlay) => overlay.isMounted))

const onAfterLeave = (id: symbol) => {
  close(id)
  unmount(id)
}

const onClose = (id: symbol, value: any) => {
  close(id, value)
}
</script>

<template>
  <component
    :is="overlay.component"
    v-for="(overlay, index) in mountedOverlays"
    :key="overlay.id"
    v-bind="overlay.props"
    v-model:open="overlay.isOpen"
    :overlay="index === 0 ? true : false"
    :content="{
      style: {
        '--overlay-count': mountedOverlays.length,
        '--overlay-index': index
      }
    }"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @close="(value:any) => onClose(overlay.id, value)"
    @after:leave="onAfterLeave(overlay.id)"
  />
</template>
