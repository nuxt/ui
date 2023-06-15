<template>
  <header v-if="page" class="relative border-b border-gray-200 dark:border-gray-800 pb-8 mb-12">
    <p class="mb-4 text-sm leading-6 font-semibold text-primary-500 dark:text-primary-400 capitalize">
      {{ page._dir?.title ? page._dir.title : useLowerCase(page._dir) }}
    </p>
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
      <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight dark:text-white">
        {{ page.title }}
      </h1>

      <div v-if="page.headlessui || page.github" class="flex items-center gap-2 mt-4 lg:mt-0">
        <UButton
          v-if="page.headlessui"
          :label="page.headlessui.label"
          :to="page.headlessui.to"
          icon="i-simple-icons-headlessui"
          color="white"
        />

        <UButton
          v-if="page.github"
          label="GitHub"
          icon="i-simple-icons-github"
          color="white"
          :to="`https://github.com/nuxtlabs/ui/blob/dev/src/runtime/components/${page._dir}/${page.title.replace(' ', '')}${page.github.suffix || '.vue'}`"
        />
      </div>
    </div>
    <p v-if="page.description" class="mt-4 text-lg">
      {{ page.description }}
    </p>
  </header>
</template>

<script setup lang="ts">
defineProps({
  page: {
    type: Object,
    default: null
  }
})
</script>
