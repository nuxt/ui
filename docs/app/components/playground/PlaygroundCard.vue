<template>
  <!-- A real UCard (no explicit variant) so the studio's panel defaults
       and style treatments apply to the grid tiles too. Tiles bring their
       own padding, the body slot contributes none. -->
  <UCard
    class="relative isolate overflow-hidden"
    :ui="{ body: 'p-0 sm:p-0' }"
  >
    <slot />
  </UCard>
</template>
