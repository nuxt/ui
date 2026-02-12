<script lang="ts">
import type { ImgHTMLAttributes } from '../../types/html'

export interface ColorModeImageProps extends /** @vue-ignore */ Omit<ImgHTMLAttributes, 'src'> {
  dark: string
  light: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { withTrailingSlash, withLeadingSlash, joinURL } from 'ufo'
import { useRuntimeConfig } from '#imports'
import ImageComponent from '#build/ui-image-component'

defineOptions({ inheritAttrs: false })

const props = defineProps<ColorModeImageProps>()

function withBase(path: string): string {
  if (path.startsWith('/') && !path.startsWith('//')) {
    const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL))
    if (_base !== '/' && !path.startsWith(_base)) {
      return joinURL(_base, path)
    }
  }
  return path
}

const refinedLight = computed(() => withBase(props.light))
const refinedDark = computed(() => withBase(props.dark))
</script>

<template>
  <component :is="ImageComponent" :src="refinedLight" class="dark:hidden" v-bind="$attrs" />
  <component :is="ImageComponent" :src="refinedDark" class="hidden dark:block" v-bind="$attrs" />
</template>
