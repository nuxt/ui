<template>
  <UCollapsible class="space-y-2 w-48">
    <UButton
      class="group"
      color="gray"
      label="Open"
      block
      trailing-icon="i-heroicons-chevron-right-20-solid"
      :ui="{ trailingIcon: 'group-data-[state=open]:rotate-90 transition' }"
    />

    <template #content>
      <div class="bg-primary-500 dark:bg-primary-400 h-12 w-full" />
    </template>
  </UCollapsible>
</template>