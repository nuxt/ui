<script setup>
const links = [{
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/739984?v=4'
  },
  label: 'benjamincanac',
  to: 'https://github.com/benjamincanac',
  target: '_blank'
}, {
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/904724?v=4'
  },
  label: 'Atinux',
  to: 'https://github.com/Atinux',
  target: '_blank'
}, {
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/7547335?v=4'
  },
  label: 'smarroufin',
  to: 'https://github.com/smarroufin',
  target: '_blank'
}]

const { ui } = useAppConfig()
</script>

<template>
  <UVerticalNavigation :links="links">
    <template #avatar="{ link }">
      <UAvatar
        v-if="link.avatar"
        v-bind="{ size: ui.verticalNavigation.avatar.size, ...link.avatar }"
        :class="[ui.verticalNavigation.avatar.base]"
      />
      <UIcon v-else name="i-heroicons-user-circle-20-solid" class="text-lg" />
    </template>
  </UVerticalNavigation>
</template>
