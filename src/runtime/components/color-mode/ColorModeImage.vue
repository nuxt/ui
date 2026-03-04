<script lang="ts">
import type { ImgHTMLAttributes } from '../../types/html'

export interface ColorModeImageProps extends /** @vue-ignore */ Omit<ImgHTMLAttributes, 'src'> {
  dark: string
  light: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useRuntimeConfig } from '#imports'
import ImageComponent from '#build/ui-image-component'
import { resolveBaseURL } from '../../utils'

defineOptions({ inheritAttrs: false })

const props = defineProps<ColorModeImageProps>()

const refinedLight = computed(() => resolveBaseURL(props.light, useRuntimeConfig().app.baseURL))
const refinedDark = computed(() => resolveBaseURL(props.dark, useRuntimeConfig().app.baseURL))
</script>

<template>
  <component :is="ImageComponent" :src="refinedLight" class="dark:hidden" v-bind="$attrs" />
  <component :is="ImageComponent" :src="refinedDark" class="hidden dark:block" v-bind="$attrs" />
</template>
