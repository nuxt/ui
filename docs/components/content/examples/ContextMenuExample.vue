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
  <div class="w-full" @contextmenu.prevent="openContextMenu">
    <Placeholder class="h-20 w-full flex items-center justify-center">
      Right click here
    </Placeholder>

    <UContextMenu v-model="isOpen" :virtual-element="virtualElement">
      <div class="p-4">
        Menu
      </div>
    </UContextMenu>
  </div>
</template>
