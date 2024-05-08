<template>
  <component
    :is="slideoverInstance.component"
    v-for="(slideoverInstance, index) in slideoverInstances"
    :key="index"
    v-bind="slideoverInstance.props"
    :model-value="slideoverInstance.isOpen"
    @after-leave="reset(slideoverInstance.id)"
  />
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { useSlideover, slidOverInjectionKey } from '../../composables/useSlideover'

const slideoverInstances = inject(slidOverInjectionKey)

const { reset } = useSlideover()
</script>
