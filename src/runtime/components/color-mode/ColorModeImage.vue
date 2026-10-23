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
import { usePrefix } from '../../composables/usePrefix'
import { resolveBaseURL } from '../../utils'

defineOptions({ inheritAttrs: false })

const props = defineProps<ColorModeImageProps>()

const refinedLight = computed(() => typeof ImageComponent === 'string' ? resolveBaseURL(props.light, useRuntimeConfig().app.baseURL) : props.light)
const refinedDark = computed(() => typeof ImageComponent === 'string' ? resolveBaseURL(props.dark, useRuntimeConfig().app.baseURL) : props.dark)
const prefix = usePrefix()
</script>

<template>
  <component :is="ImageComponent" :src="refinedLight" :class="prefix('dark:hidden')" v-bind="$attrs" />
  <component :is="ImageComponent" :src="refinedDark" :class="prefix('hidden dark:block')" v-bind="$attrs" />
</template>
