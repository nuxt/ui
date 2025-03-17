<template>
  <UBanner
    id="ui3-launch"
    icon="i-lucide-rocket"
    :actions="[
      {
        label: 'Buy Nuxt UI Pro',
        to: '/pro/pricing',
        trailingIcon: 'i-lucide-arrow-right'
      }
    ]"
  >
    <template #title>
      <span class="font-semibold">Nuxt UI v3</span> is officially released.
    </template>
  </UBanner>
</template>
