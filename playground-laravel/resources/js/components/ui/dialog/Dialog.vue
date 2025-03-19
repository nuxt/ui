<script setup lang="ts">
import { DialogRoot, useForwardPropsEmits, type DialogRootEmits, type DialogRootProps } from 'radix-vue';

const props = defineProps<DialogRootProps>();
const emits = defineEmits<DialogRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
    <DialogRoot v-bind="forwarded">
        <slot />
    </DialogRoot>
</template>
