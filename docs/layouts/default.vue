<template>
  <div class="relative grid lg:grid-cols-10 lg:gap-8">
    <DocsAside class="lg:col-span-2" />

    <div class="relative lg:col-span-6 pt-8 pb-16">
      <DocsPageHeader />

      <div class="prose prose-primary dark:prose-invert max-w-none">
        <slot />
      </div>

      <hr class="border-gray-200 dark:border-gray-800 my-12">

      <DocsPrevNext />
    </div>

    <DocsToc class="lg:col-span-2 order-first lg:order-last" />
  </div>
</template>
