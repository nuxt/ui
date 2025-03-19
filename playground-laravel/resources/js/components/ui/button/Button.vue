<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Primitive, type PrimitiveProps } from 'radix-vue';
import type { HTMLAttributes } from 'vue';
import { buttonVariants, type ButtonVariants } from '.';

interface Props extends PrimitiveProps {
    variant?: ButtonVariants['variant'];
    size?: ButtonVariants['size'];
    class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
    as: 'button',
});
</script>

<template>
    <Primitive :as="as" :as-child="asChild" :class="cn(buttonVariants({ variant, size }), props.class)">
        <slot />
    </Primitive>
</template>
