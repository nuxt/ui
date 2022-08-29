<template>
  <div class="flex flex-row-reverse">
    <Avatar
      v-if="remainingGroupSize > 0"
      :size="size"
      :text="`+${remainingGroupSize}`"
      :class="avatarClass"
    />
    <Avatar
      v-for="(avatar, index) of displayedGroup"
      :key="index"
      v-bind="avatar"
      :size="size"
      :class="avatarClass"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { classNames } from '../../utils'
import Avatar from './Avatar.vue'
import $ui from '#build/ui'

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
  },
  ringClass: {
    type: String,
    default: () => $ui.avatarGroup.ring
  },
  marginClass: {
    type: String,
    default: () => $ui.avatarGroup.margin
  }
})

const avatars = computed(() => {
  return props.group.map((avatar) => {
    return typeof avatar === 'string' ? { src: avatar } : avatar
  })
})

const displayedGroup = computed(() => {
  if (!props.max) { return [...avatars.value].reverse() }

  return avatars.value.slice(0, props.max).reverse()
})

const remainingGroupSize = computed(() => {
  if (!props.max) { return 0 }

  return avatars.value.length - props.max
})

const avatarClass = computed(() => {
  return classNames(
    props.ringClass,
    props.marginClass
  )
})
</script>

<script lang="ts">
export default { name: 'UAvatarGroup' }
</script>
