<template>
  <div class="flex">
    <TwAvatar
      v-for="(avatar, index) of displayedGroup"
      :key="index"
      :src="avatar.src"
      class="shadow-solid -ml-1.5 first:ml-0"
      :size="size"
      :status="avatar.status"
    />
    <TwAvatar
      v-if="remainingGroupSize > 0"
      class="shadow-solid -ml-1.5 first:ml-0 text-[10px]"
      :size="size"
      :text="`+${remainingGroupSize}`"
    />
  </div>
</template>

<script>
export default {
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
    displayedGroup () {
      if (!this.max) { return this.group }

      return this.group.slice(0, this.max)
    },
    remainingGroupSize () {
      if (!this.max) { return 0 }

      return this.group.length - this.max
    }

  }
}
</script>
