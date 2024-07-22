<template>
  <component
    :is="slideoverState.component"
    v-if="slideoverState"
    v-bind="slideoverState.props"
    v-model="isOpen"
    @after-leave="reset"
  />
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { useSlideover, slidOverInjectionKey } from '../../composables/useSlideover'

const slideoverState = inject(slidOverInjectionKey)

const { isOpen, reset } = useSlideover()
</script>
