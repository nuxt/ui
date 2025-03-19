<script setup lang="ts">
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <ul data-sidebar="menu" :class="cn('flex w-full min-w-0 flex-col gap-1', props.class)">
        <slot />
    </ul>
</template>
