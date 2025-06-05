<template>
  <UDropdownMenu :ui="{ content: 'w-48' }">
    <UButton label="Open" color="neutral" variant="outline" icon="i-lucide-menu" />

    <template #body>
      <div class="p-2">
        <Placeholder class="w-full h-40" />
      </div>
    </template>
  </UDropdownMenu>
</template>
