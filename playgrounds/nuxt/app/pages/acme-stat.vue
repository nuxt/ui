<script setup lang="ts">
const variants = ['outline', 'soft', 'subtle', 'solid'] as const
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <AcmeStat
        v-for="variant in variants"
        :key="variant"
        :variant="variant"
        label="Revenue"
        value="$48,210"
        :delta="12.4"
        icon="i-lucide-dollar-sign"
      />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <AcmeStat label="Churn" value="2.1%" :delta="-0.4" size="sm" />
      <AcmeStat label="Seats" value="1,204" :delta="0" />
      <AcmeStat label="MRR" value="$12k" trend="up" size="lg" :ui="{ value: 'text-primary' }" />
    </div>

    <UTheme :props="{ acmeStat: { variant: 'soft' } }" :ui="{ acmeStat: { root: 'rounded-none' } }">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AcmeStat label="Inside a Theme" value="42" :delta="3" />
        <AcmeStat label="Own variant wins" value="42" variant="outline" />
      </div>
    </UTheme>

    <UTheme unstyled>
      <AcmeStat label="Unstyled" value="0" />
    </UTheme>
  </div>
</template>
