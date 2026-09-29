<template>
  <UTheme :variants="{ button: { variant: { soft: { base: 'rounded-full' } } } }">
    <div class="flex items-center gap-2">
      <UButton label="Soft" variant="soft" />
      <UButton label="Solid" />
    </div>
  </UTheme>
</template>
