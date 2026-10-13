import { defineAsyncComponent } from 'vue'

const loaders = {
  modal: () => import('../components/Modal.vue'),
  slideover: () => import('../components/Slideover.vue'),
  drawer: () => import('../components/Drawer.vue')
}

export const lazyOverlays = {
  modal: defineAsyncComponent(loaders.modal),
  slideover: defineAsyncComponent(loaders.slideover),
  drawer: defineAsyncComponent(loaders.drawer)
}

export function loadOverlay(name: keyof typeof loaders) {
  return loaders[name]()
}
