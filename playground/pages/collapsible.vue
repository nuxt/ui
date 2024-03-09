<template>
  <div class="flex gap-1.5">
    <UCollapsible class="space-y-2 flex flex-col justify-start">
      <UButton trailing-icon="i-heroicons-chevron-right" label="Open" class="group" :ui="{ icon: 'group-data-[state=open]:rotate-180' }" />

      <template #content>
        <div class="bg-red-500 h-12 w-48" />
      </template>
    </UCollapsible>
  </div>
</template>