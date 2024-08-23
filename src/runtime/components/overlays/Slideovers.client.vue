<template>
  <component
    :is="instance.component"
    v-for="instance in slideoverInstances"
    :key="instance.id"
    v-bind="instance.props"
    :model-value="instance.isOpen"
    :prevent-close="true"
    @close-prevented="onClosePrevented(instance)"
    @after-leave="remove(instance.id)"
    @update:model-value="close(instance.id)"
  />
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { useSlideover, slidOverInjectionKey } from '../../composables/useSlideover'

const slideoverInstances = inject(slidOverInjectionKey)

const { remove, close } = useSlideover()

/**
 * We must set preventClose: true to prevent closing all of the instances.
 * Instead, we listen for the close-prevented event and remove the top level instance only.
 *
 * @param instance the instance that is being closed
 */
const onClosePrevented = (instance) => {
  if (instance.props.preventClose) {
    return
  }

  // Close the top level instance only
  close(slideoverInstances.value[slideoverInstances.value.length - 1].id)
}
</script>
