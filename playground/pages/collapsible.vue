<template>
  <UCollapsible class="space-y-2 w-48">
    <UButton class="group" color="gray" label="Open" block>
      <template #trailing="trailingProps">
        <UIcon name="i-heroicons-chevron-right-20-solid" :class="trailingProps.class" class="group-data-[state=open]:rotate-90 transition duration-200" />
      </template>
    </UButton>

    <template #content>
      <div class="bg-primary-500 dark:bg-primary-400 rounded-md h-12 w-full" />
    </template>
  </UCollapsible>
</template>
