<template>
  <component
    :is="instance.component"
    v-for="(instance, index) in slideoverInstances"
    :key="index"
    v-bind="instance.props"
    :model-value="instance.isOpen"
    @after-leave="reset(instance.id)"
  />
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { useSlideover, slidOverInjectionKey } from '../../composables/useSlideover'

const slideoverInstances = inject(slidOverInjectionKey)

const { reset } = useSlideover()
</script>
