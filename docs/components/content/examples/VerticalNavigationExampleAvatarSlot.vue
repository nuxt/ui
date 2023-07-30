<script setup>
const links = [{
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/739984?v=4'
  },
  label: 'Benjamin Canac'
}, {
  label: 'KeJun'
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
