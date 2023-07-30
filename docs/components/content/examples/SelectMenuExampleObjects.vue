<script setup>
const people = [{
  id: 'benjamincanac',
  label: 'benjamincanac',
  href: 'https://github.com/benjamincanac',
  target: '_blank',
  avatar: { src: 'https://avatars.githubusercontent.com/u/739984?v=4' }
}, {
  id: 'Atinux',
  label: 'Atinux',
  href: 'https://github.com/Atinux',
  target: '_blank',
  avatar: { src: 'https://avatars.githubusercontent.com/u/904724?v=4' }
}, {
  id: 'smarroufin',
  label: 'smarroufin',
  href: 'https://github.com/smarroufin',
  target: '_blank',
  avatar: { src: 'https://avatars.githubusercontent.com/u/7547335?v=4' }
}, {
  id: 'nobody',
  label: 'Nobody',
  icon: 'i-heroicons-user-circle'
}]

const selected = ref(people[0])
</script>

<template>
  <USelectMenu v-model="selected" :options="people">
    <template #label>
      <UIcon v-if="selected.icon" :name="selected.icon" class="w-4 h-4" />
      <UAvatar v-else-if="selected.avatar" v-bind="selected.avatar" size="3xs" />

      {{ selected.label }}
    </template>
  </USelectMenu>
</template>
