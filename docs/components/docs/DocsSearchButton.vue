<template>
  <UButton
    label="Search"
    icon="i-heroicons-magnifying-glass"
    block
    size="xs"
    variant="gray"
    class="!px-3"
  >
    <span class="text-sm ml-0.5">Search</span>
    <Shortcut value="meta" class="ml-auto hidden lg:inline-flex" />
    <Shortcut value="K" class="ml-1 hidden lg:inline-flex" />
  </UButton>
</template>
