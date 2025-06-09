<script setup lang="ts">
import { vMaska } from 'maska/vue'
</script>

<template>
  <div class="flex flex-col gap-2">
    <UInput v-maska="'#### #### #### ####'" placeholder="4242 4242 4242 4242" icon="i-lucide-credit-card" />

    <div class="flex items-center gap-2">
      <UInput v-maska="'##/##'" placeholder="MM/YY" icon="i-lucide-calendar" />
      <UInput v-maska="'###'" placeholder="CVC" />
    </div>
  </div>
</template>
