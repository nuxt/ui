<template>
  <div class="relative">
    <UPopover :content="{ side: 'right' }">
      <UButton label="Open" color="neutral" variant="subtle" />

      <template #anchor>
        <div class="absolute top-1/2 -right-24 translate-x-1/2 -translate-y-1/2">
          Anchor
        </div>
      </template>

      <template #content>
        <Placeholder class="size-48 m-4 inline-flex" />
      </template>
    </UPopover>
  </div>
</template>
