<template>
  <component
    :is="slideoverState.component"
    v-for="(slideoverState, index) in slideoverInstances"
    :key="index"
    v-bind="slideoverState.props"
    :model-value="slideoverState.isOpen"
    @after-leave="reset(slideoverState.id)"
  />
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { useSlideover, slidOverInjectionKey } from '../../composables/useSlideover'

const slideoverInstances = inject(slidOverInjectionKey)

const { reset } = useSlideover()
</script>
