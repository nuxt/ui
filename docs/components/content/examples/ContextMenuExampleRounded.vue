<script setup>
const { x, y } = useMouse()
const { y: windowY } = useWindowScroll()

const isOpen = ref(false)
const virtualElement = ref({ getBoundingClientRect: () => ({}) })
const rounded = ref('lg');
const roundedOptions = ['none', 'sm', 'rounded', 'md', 'lg', 'xl', '2xl', '3xl', 'full'];

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
  <div class="w-full">
    <UFormGroup name="rounded" label="rounded" class="mb-4">
      <USelect v-model="rounded" :options="roundedOptions" />
    </UFormGroup>

    <div class="w-full" @contextmenu.prevent="onContextMenu">
      <Placeholder class="h-96 select-none w-full flex items-center justify-center">
        Right click here
      </Placeholder>

      <UContextMenu v-model="isOpen" :virtual-element="virtualElement" :rounded="rounded">
        <div class="p-4">
          Menu
        </div>
      </UContextMenu>
    </div>
  </div>
</template>
