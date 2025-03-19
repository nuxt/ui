<script setup lang="ts">
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <p :class="cn('text-sm text-muted-foreground', props.class)">
        <slot />
    </p>
</template>
