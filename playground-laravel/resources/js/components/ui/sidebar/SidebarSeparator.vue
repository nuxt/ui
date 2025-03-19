<script setup lang="ts">
import Separator from '@/components/ui/separator/Separator.vue';
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <Separator data-sidebar="separator" :class="cn('mx-2 w-auto bg-sidebar-border', props.class)">
        <slot />
    </Separator>
</template>
