<script setup lang="ts">
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <div data-sidebar="group" :class="cn('relative flex w-full min-w-0 flex-col p-2', props.class)">
        <slot />
    </div>
</template>
