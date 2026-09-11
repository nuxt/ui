<script setup lang="ts">
const pg = usePg()

const duration = ref(2)
const spread = ref(2)
</script>

<template>
  <Navbar>
    <UFormField label="Duration" orientation="horizontal">
      <UInputNumber v-model="duration" :class="pg.w_28" />
    </UFormField>
    <UFormField label="Spread" orientation="horizontal">
      <UInputNumber v-model="spread" :class="pg.w_28" />
    </UFormField>
  </Navbar>

  <UChatShimmer text="Thinking about it..." :duration="duration" :spread="spread" />
</template>
