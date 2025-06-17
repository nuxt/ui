<script setup lang="ts">
import { computed } from 'vue'
import { useOverlay, type Overlay } from '../composables/useOverlay'

defineOptions({
  inheritAttrs: false
})

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
      ...$attrs,
      style: {
        '--overlay-count': mountedOverlays.length,
        '--overlay-index': index,
        ...($attrs as any).style
      }
    }"
    @close="(value:any) => onClose(overlay.id, value)"
    @after:leave="onAfterLeave(overlay.id)"
  />
</template>
