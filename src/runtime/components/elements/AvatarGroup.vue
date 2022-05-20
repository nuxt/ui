<template>
  <div class="flex">
    <Avatar
      v-for="(avatar, index) of displayedGroup"
      :key="index"
      v-bind="avatar"
      class="ring-2 u-ring-white -ml-1.5 first:ml-0"
      :size="size"
    />
    <Avatar
      v-if="remainingGroupSize > 0"
      class="ring-2 u-ring-white -ml-1.5 first:ml-0 text-[10px]"
      :size="size"
      :text="`+${remainingGroupSize}`"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Avatar from './Avatar'

const props = defineProps({
  group: {
    type: Array,
    default: () => []
  },
  size: {
    type: String,
    default: 'md',
    validator (value: string) {
      return ['xxxs', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    }
  },
  max: {
    type: Number,
    default: null
  }
})

const avatars = computed(() => {
  return props.group.map((avatar) => {
    return typeof avatar === 'string' ? { src: avatar } : avatar
  })
})

const displayedGroup = computed(() => {
  if (!props.max) { return avatars.value }

  return avatars.value.slice(0, props.max)
})

const remainingGroupSize = computed(() => {
  if (!props.max) { return 0 }

  return avatars.value.length - props.max
})
</script>

<script lang="ts">
export default { name: 'UAvatarGroup' }
</script>
