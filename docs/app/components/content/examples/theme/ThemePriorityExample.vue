<template>
  <UTheme
    :ui="{
      button: {
        base: 'rounded-full'
      }
    }"
  >
    <div class="flex items-center gap-2">
      <UButton label="Themed" />
      <UButton label="Overridden" :ui="{ base: 'rounded-none' }" />
    </div>
  </UTheme>
</template>
