<script lang="ts">
import type { ImgHTMLAttributes } from '../../types/html'

export interface ColorModeImageProps extends /** @vue-ignore */ Omit<ImgHTMLAttributes, 'src'> {
  dark: string
  light: string
}
</script>

<script setup lang="ts">
import ImageComponent from '#build/ui-image-component'

defineOptions({ inheritAttrs: false })

defineProps<ColorModeImageProps>()
</script>

<template>
  <component :is="ImageComponent" :src="light" class="dark:hidden" v-bind="$attrs" />
  <component :is="ImageComponent" :src="dark" class="hidden dark:block" v-bind="$attrs" />
</template>
