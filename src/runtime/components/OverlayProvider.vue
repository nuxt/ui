<script setup lang="ts">
import { computed } from 'vue'
import { useOverlay } from '../composables/useOverlay'
import type { Overlay } from '../composables/useOverlay'

const { overlays, unmount, close } = useOverlay()

const mountedOverlays = computed(() => overlays.filter((overlay: Overlay) => overlay.isMounted))

const onAfterLeave = (id: symbol) => {
  close(id)
  unmount(id)
}
</script>

<template>
  <component
    :is="overlay.component"
    v-for="overlay in mountedOverlays"
    :key="overlay.id"
    v-bind="overlay.props"
    v-model:open="overlay.isOpen"
    v-on="overlay.emits"
    @after:leave="onAfterLeave(overlay.id)"
  />
</template>
