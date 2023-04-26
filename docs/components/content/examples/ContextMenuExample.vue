<script setup>
const { x, y } = useMouse()

const isOpen = ref(false)
const virtualElement = ref({ getBoundingClientRect: () => ({}) })

function openContextMenu () {
  const top = unref(y)
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
  <div class="w-full" @click="isOpen = false" @contextmenu.prevent="openContextMenu">
    <Placeholder class="h-20 w-full flex items-center justify-center">
      <p>Right click here</p>
    </Placeholder>

    <UContextMenu v-model="isOpen" :virtual-element="virtualElement" width-class="w-48">
      <div class="p-4">
        Menu
      </div>
    </UContextMenu>
  </div>
</template>
