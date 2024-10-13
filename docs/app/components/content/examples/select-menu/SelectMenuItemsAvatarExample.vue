<script setup lang="ts">
const items = ref([
  {
    label: 'benjamincanac',
    value: 'benjamincanac',
    avatar: {
      src: 'https://github.com/benjamincanac.png',
      alt: 'benjamincanac'
    }
  },
  {
    label: 'romhml',
    value: 'romhml',
    avatar: {
      src: 'https://github.com/romhml.png',
      alt: 'romhml'
    }
  },
  {
    label: 'noook',
    value: 'noook',
    avatar: {
      src: 'https://github.com/noook.png',
      alt: 'noook'
    }
  }
])
const selected = ref(items.value[0])
</script>

<template>
  <USelectMenu v-model="selected" :items="items" class="w-48">
    <template #leading="{ modelValue, ui }">
      <UAvatar
        v-if="modelValue"
        v-bind="modelValue.avatar"
        :size="ui.itemLeadingAvatarSize()"
        :class="ui.itemLeadingAvatar()"
      />
    </template>
  </USelectMenu>
</template>
