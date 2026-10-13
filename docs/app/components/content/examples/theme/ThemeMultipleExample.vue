<template>
  <UTheme
    :props="{
      button: { color: 'neutral', variant: 'outline', size: 'lg' },
      input: { size: 'lg' },
      select: { size: 'lg' }
    }"
    :ui="{
      button: { base: 'rounded-full' },
      input: { base: 'rounded-full' },
      select: { base: 'rounded-full' }
    }"
  >
    <div class="flex items-center gap-2">
      <UButton label="Button" />
      <UInput placeholder="Search..." />
      <USelect placeholder="Select" :items="['Item 1', 'Item 2', 'Item 3']" />
    </div>
  </UTheme>
</template>
