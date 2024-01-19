<template>
  <div ref="carbonads" class="carbon" />
</template>

<script setup lang="ts">
const carbonads = ref(null)

onMounted(() => {
  if (carbonads.value) {
    const script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', 'https://cdn.carbonads.com/carbon.js?serve=CWYIVK3E&placement=uinuxtcom')
    script.setAttribute('id', '_carbonads_js')
    carbonads.value.appendChild(script)
  }
})
</script>

<style lang="postcss">
.carbon > #carbonads {
  @apply relative border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-700 w-full transition-colors min-h-[220px];

  &:hover {
    .carbon-text {
      @apply text-gray-700 dark:text-gray-200;
    }
  }

  .carbon-img {
    @apply flex justify-center p-2 w-full;

    & > img {
      @apply !max-w-full w-full rounded;
    }
  }

  .carbon-text {
    @apply flex px-2 text-sm text-gray-500 dark:text-gray-400 transition-colors text-center w-full;
  }

  .carbon-poweredby {
    @apply block text-xs text-center text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 pt-1 pb-2 px-2 transition-colors;
  }
}
</style>
