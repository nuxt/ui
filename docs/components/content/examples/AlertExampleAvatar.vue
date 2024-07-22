<template>
  <UAlert
    title="Customize Alert Avatar"
    description="Insert custom content into the avatar slot!"
    :avatar="{
      src: 'https://avatars.githubusercontent.com/u/739984?v=4',
      alt: 'Avatar'
    }"
  >
    <template #avatar="{ avatar }">
      <UAvatar
        v-bind="avatar"
        chip-color="primary"
        chip-text=""
        chip-position="top-right"
      />
    </template>
  </UAlert>
</template>
