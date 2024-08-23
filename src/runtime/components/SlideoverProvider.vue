<script setup lang="ts">
import { inject } from 'vue'
import { slideoverInjectionKey, useSlideover } from '../composables/useSlideover'

const slideoverState = inject(slideoverInjectionKey)

const { isOpen } = useSlideover()
</script>

<template>
  <component :is="slideoverState.component" v-if="slideoverState" v-bind="slideoverState.props" v-model:open="isOpen" />
</template>
