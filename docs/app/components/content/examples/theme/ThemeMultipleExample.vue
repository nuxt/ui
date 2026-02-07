<template>
  <UTheme
    :ui="{
      button: {
        base: 'rounded-full'
      },
      badge: {
        base: 'rounded-full'
      }
    }"
  >
    <div class="flex items-center gap-2">
      <UButton label="Button" />
      <UBadge label="Badge" />
    </div>
  </UTheme>
</template>
