<script setup lang="ts">
const links = [{
  avatar: {
    src: 'https://ipx.nuxt.com/s_16x16/gh_avatar/benjamincanac',
    srcset: 'https://ipx.nuxt.com/s_32x32/gh_avatar/benjamincanac 2x',
    alt: ''
  },
  label: 'benjamincanac',
  to: 'https://github.com/benjamincanac',
  target: '_blank'
}, {
  avatar: {
    src: 'https://ipx.nuxt.com/s_16x16/gh_avatar/Atinux',
    srcset: 'https://ipx.nuxt.com/s_32x32/gh_avatar/Atinux 2x',
    alt: ''
  },
  label: 'Atinux',
  to: 'https://github.com/Atinux',
  target: '_blank'
}, {
  avatar: {
    src: 'https://ipx.nuxt.com/s_16x16/gh_avatar/smarroufin',
    srcset: 'https://ipx.nuxt.com/s_32x32/gh_avatar/smarroufin 2x',
    alt: ''
  },
  label: 'smarroufin',
  to: 'https://github.com/smarroufin',
  target: '_blank'
}]
</script>

<template>
  <UVerticalNavigation :links="links">
    <template #avatar="{ link }">
      <UAvatar v-bind="link.avatar" size="2xs" loading="lazy" />
    </template>
  </UVerticalNavigation>
</template>
