<script lang="ts">
import type { AvatarProps } from '../Avatar.vue'

export interface ColorModeAvatarProps extends Omit<AvatarProps, 'src'> {
  light: string
  dark: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useForwardProps } from 'reka-ui'
import { usePrefix } from '../../composables/usePrefix'
import UAvatar from '../Avatar.vue'
import { omit } from '../../utils'

defineOptions({ inheritAttrs: false })

const props = defineProps<ColorModeAvatarProps>()

const avatarProps = useForwardProps(computed(() => omit(props, ['light', 'dark'])))
const prefix = usePrefix()
</script>

<template>
  <UAvatar v-bind="{ ...avatarProps, ...$attrs }" :src="light" :class="prefix('dark:hidden')" />
  <UAvatar v-bind="{ ...avatarProps, ...$attrs }" :src="dark" :class="prefix('hidden dark:block')" />
</template>
