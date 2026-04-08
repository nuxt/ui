<script setup lang="ts">
/*
 * Internal component used to reset the FieldGroup injection context at portal
 * boundaries, preventing nested components from inheriting `size` and
 * `orientation` styles from a parent UFieldGroup.
 */
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
