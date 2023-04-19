<template>
  <header v-if="page" class="relative border-b border-gray-200 dark:border-gray-800 pb-8 mb-12">
    <p class="mb-4 text-sm leading-6 font-semibold text-primary-500 dark:text-primary-400 capitalize">
      {{ useLowerCase(page._dir) }}
    </p>
    <div class="flex items-center justify-between">
      <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight dark:text-gray-200">
        {{ page.title }}
      </h1>

      <UButton
        v-if="page.autolink"
        label="Source"
        icon="i-mdi-github"
        size="sm"
        color="white"
        :to="`https://github.com/nuxtlabs/ui/blob/dev/src/runtime/components/${page._dir}/U${page.title}.vue`"
      />
    </div>
    <p v-if="page.description" class="mt-4 text-lg">
      {{ page.description }}
    </p>
  </header>
</template>

<script setup lang="ts">
const { page } = useContent()
</script>
