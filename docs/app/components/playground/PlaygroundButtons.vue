<template>
  <div class="flex flex-col gap-3 p-4">
    <div class="flex flex-wrap gap-2">
      <UButton label="Solid" />
      <UButton label="Outline" variant="outline" />
      <UButton label="Soft" variant="soft" />
      <UButton label="Subtle" variant="subtle" />
      <UButton label="Ghost" variant="ghost" />
    </div>

    <div class="flex flex-wrap gap-2">
      <UButton label="Get started" icon="i-lucide-rocket" color="primary" />
      <UButton label="Loading" loading variant="outline" />
      <UButton icon="i-lucide-heart" color="error" variant="soft" square aria-label="Like" />
      <UButton icon="i-lucide-settings" color="neutral" variant="ghost" square aria-label="Settings" />
    </div>

    <UFieldGroup>
      <UButton label="Copy" icon="i-lucide-copy" color="neutral" variant="subtle" />
      <UButton icon="i-lucide-chevron-down" color="neutral" variant="subtle" square aria-label="More" />
    </UFieldGroup>
  </div>
</template>
