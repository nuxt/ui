<script setup lang="ts">
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <li data-sidebar="menu-item" :class="cn('group/menu-item relative', props.class)">
        <slot />
    </li>
</template>
