<template>
  <div ref="panels" class="h-auto min-h-auto aspect-video w-full grid grid-cols-[auto,_1fr] overflow-hidden">
    <div class="relative">
      <div
        class="resizer hidden min-[371px]:block mr-2 overflow-auto z-0 w-[11px] h-full relative resize-x
        before:content-[''] before:w-[105%] before:h-[105%] before:bg-transparent before:pointer-events-none before:block before:absolute
        [&::-webkit-resizer]:bg-transparent [&::-webkit-scrollbar]:w-[10px] [&::-webkit-scrollbar]:h-[500px] [&::-webkit-scrollbar-corner]:bg-none"
      />
      <div class="bg-gray-300 dark:bg-gray-700 rounded-full h-[42px] w-[10px] absolute right-0 top-[45%] -z-[1] mr-2" />
    </div>

    <div class="relative min-w-[280px] border border-gray-300 dark:border-gray-700 rounded-md">
      <div class="overflow-auto m-0">
        <div class="m-4 h-full">
          <iframe :src="`/examples/${name}`" class="w-full h-full" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ name: string }>()

const panels = ref<HTMLElement>()
const panelsWidth = ref('')

onMounted(() => panelsWidth.value = `${panels.value.offsetWidth}px`)
</script>

<style scoped lang="postcss">
@media (min-width: 371px) {
  .resizer {
    max-width: calc(v-bind(panelsWidth) - 330px);
  }
}
</style>
