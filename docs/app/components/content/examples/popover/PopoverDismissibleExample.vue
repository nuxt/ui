<template>
  <UPopover :dismissible="false" :ui="{ content: 'p-4' }">
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #content="{ close }">
      <div class="flex items-center gap-4 mb-4">
        <h2 class="text-highlighted font-semibold">
          Popover non-dismissible
        </h2>

        <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="close" />
      </div>

      <Placeholder class="size-full min-h-48" />
    </template>
  </UPopover>
</template>
