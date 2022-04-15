<template>
  <div class="flex">
    <Avatar
      v-for="(avatar, index) of avatars"
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

<script>
import Avatar from './Avatar'

export default {
  components: {
    Avatar
  },
  props: {
    group: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: 'md',
      validator (value) {
        return ['xxxs', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value)
      }
    },
    max: {
      type: Number,
      default: null
    }
  },
  computed: {
    avatars () {
      return this.group.map((avatar) => {
        return typeof avatar === 'string' ? { src: avatar } : avatar
      })
    },
    displayedGroup () {
      if (!this.max) { return this.avatars }

      return this.avatars.slice(0, this.max)
    },
    remainingGroupSize () {
      if (!this.max) { return 0 }

      return this.avatars.length - this.max
    }
  }
}
</script>
