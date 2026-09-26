<template>
  <UTheme :props="{ '*': { color: 'neutral', size: 'sm' } }">
    <div class="flex flex-wrap items-center gap-2">
      <UButton label="Button" />
      <UBadge label="Badge" variant="subtle" />
      <UInput placeholder="Input" />
      <UAvatar alt="Benjamin Canac" />
    </div>
  </UTheme>
</template>
