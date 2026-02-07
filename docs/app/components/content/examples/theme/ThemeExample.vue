<template>
  <UTheme
    :ui="{
      button: {
        base: 'rounded-full'
      }
    }"
  >
    <div class="flex items-center gap-2">
      <UButton label="Button" />
      <UButton label="Button" color="neutral" />
    </div>
  </UTheme>
</template>
