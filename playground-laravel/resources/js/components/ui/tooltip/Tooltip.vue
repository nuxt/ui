<script setup lang="ts">
import { TooltipRoot, useForwardPropsEmits, type TooltipRootEmits, type TooltipRootProps } from 'radix-vue';

const props = defineProps<TooltipRootProps>();
const emits = defineEmits<TooltipRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
    <TooltipRoot v-bind="forwarded">
        <slot />
    </TooltipRoot>
</template>
