<script setup lang="ts">
import { useMouse, useWindowScroll } from '@vueuse/core'

const { x, y } = useMouse()
const { y: windowY } = useWindowScroll()

const isOpen = ref(false)
const virtualElement = ref({ getBoundingClientRect: () => ({}) })

function onContextMenu() {
  const top = unref(y) - unref(windowY)
  const left = unref(x)

  virtualElement.value.getBoundingClientRect = () => ({
    width: 0,
    height: 0,
    top,
    left
  })

  isOpen.value = true
}
</script>

<template>
  <div class="w-full" @contextmenu.prevent="onContextMenu">
    <Placeholder class="h-96 select-none w-full flex items-center justify-center">
      Right click here
    </Placeholder>

    <UContextMenu v-model="isOpen" :virtual-element="virtualElement" :popper="{ arrow: true, placement: 'right' }">
      <div class="p-4">
        Menu
      </div>
    </UContextMenu>
  </div>
</template>
