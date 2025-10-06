<script lang="ts">
import type { AvatarProps } from '@nuxt/ui'

export interface ColorModeAvatarProps extends /** @vue-ignore */ Omit<AvatarProps, 'src'> {
  light: string
  dark: string
}
</script>

<script setup lang="ts">
import UAvatar from '../Avatar.vue'

defineOptions({ inheritAttrs: false })

defineProps<ColorModeAvatarProps>()
</script>

<template>
  <UAvatar :src="light" class="dark:hidden" v-bind="$attrs" />
  <UAvatar :src="dark" class="hidden dark:block" v-bind="$attrs" />
</template>
