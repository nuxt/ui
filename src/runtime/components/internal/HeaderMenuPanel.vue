<!-- The inline panel of HeaderMenu, in its own chunk so the Reka Dialog code it pulls in loads with
     the menu and not with every page that has a Header. Not registered as a component. -->
<script setup lang="ts">
import type { FocusOutsideEvent, PointerDownOutsideEvent } from 'reka-ui'
import { DialogContent, DialogDescription, DialogTitle, VisuallyHidden } from 'reka-ui'

defineProps<{
  title?: string
  description?: string
}>()

defineEmits<{
  interactOutside: [event: PointerDownOutsideEvent | FocusOutsideEvent]
}>()
</script>

<template>
  <DialogContent @interact-outside="$emit('interactOutside', $event)">
    <VisuallyHidden>
      <DialogTitle>{{ title }}</DialogTitle>
      <DialogDescription>{{ description }}</DialogDescription>
    </VisuallyHidden>

    <slot />
  </DialogContent>
</template>
