<template>
  <div v-if="toc" class="sticky top-16 bg-white/75 dark:bg-gray-900/75 backdrop-blur group lg:self-start -mx-4 sm:-mx-6 lg:mx-0 px-4 sm:px-6 lg:pl-8 lg:pr-0">
    <div class="py-3 lg:py-8 border-b border-dashed border-gray-200 dark:border-gray-800 lg:border-0">
      <button class="flex items-center gap-2" tabindex="-1" @click="isTocOpen = !isTocOpen">
        <span class="text-sm text-slate-900 font-semibold text-sm leading-6 dark:text-slate-100 truncate">Table of Contents</span>

        <UIcon name="i-heroicons-chevron-right-20-solid" class="lg:hidden w-4 h-4 transition-transform duration-100 transform text-gray-400 dark:text-gray-500" :class="[isTocOpen ? 'rotate-90' : 'rotate-0']" />
      </button>

      <DocsTocLinks class="mt-2 lg:mt-4" :links="toc.links" :class="[isTocOpen ? 'lg:block' : 'hidden lg:block']" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { toc } = useContent()

const isTocOpen = ref(false)
</script>
