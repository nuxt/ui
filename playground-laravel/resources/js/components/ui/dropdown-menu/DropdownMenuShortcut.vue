<script setup lang="ts">
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <span :class="cn('ml-auto text-xs tracking-widest opacity-60', props.class)">
        <slot />
    </span>
</template>
