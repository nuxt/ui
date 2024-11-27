<script setup lang="ts">
import { Slot } from 'radix-vue'
</script>

<template>
  <Slot class="nuxt-only">
    <slot name="nuxt" />
  </Slot>
  <Slot class="vue-only">
    <slot name="vue" />
  </Slot>
</template>
