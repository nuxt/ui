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

function getAvatar(value: string) {
  return items.value.find(item => item.value === value)?.avatar
}
</script>

<template>
  <USelect default-value="benjamincanac" :items="items" class="w-40">
    <template #leading="{ modelValue, ui }">
      <UAvatar
        v-if="modelValue"
        v-bind="getAvatar(modelValue)"
        :size="ui.itemLeadingAvatarSize()"
        :class="ui.itemLeadingAvatar()"
      />
    </template>
  </USelect>
</template>
