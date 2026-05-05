<template>
  <UTheme
    :ui="{
      button: {
        base: 'rounded-full'
      }
    }"
  >
    <div class="flex items-center gap-2">
      <UButton label="Button" color="neutral" />
      <UButton label="Button" color="neutral" variant="outline" />
      <UButton label="Button" color="neutral" variant="subtle" />
    </div>
  </UTheme>
</template>
