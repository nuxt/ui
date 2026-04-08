<script setup lang="ts">
import { computed, provide } from 'vue'
import { fieldGroupInjectionKey } from '../composables/useFieldGroup'

provide(fieldGroupInjectionKey, computed(() => ({
  size: undefined,
  orientation: undefined
})))
</script>

<template>
  <slot />
</template>
