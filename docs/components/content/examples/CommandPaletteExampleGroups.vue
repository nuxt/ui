<script setup lang="ts">
const router = useRouter()
const toast = useToast()

const commandPaletteRef = ref()

const users = [
  { id: 'benjamincanac', label: 'benjamincanac', href: 'https://github.com/benjamincanac', target: '_blank', avatar: { src: 'https://ipx.nuxt.com/s_16x16/gh_avatar/benjamincanac', srcset: 'https://ipx.nuxt.com/s_32x32/gh_avatar/benjamincanac 2x', loading: 'lazy' } },
  { id: 'Atinux', label: 'Atinux', href: 'https://github.com/Atinux', target: '_blank', avatar: { src: 'https://ipx.nuxt.com/s_16x16/gh_avatar/Atinux', srcset: 'https://ipx.nuxt.com/s_32x32/gh_avatar/Atinux 2x', loading: 'lazy' } },
  { id: 'smarroufin', label: 'smarroufin', href: 'https://github.com/smarroufin', target: '_blank', avatar: { src: 'https://ipx.nuxt.com/s_16x16/gh_avatar/smarroufin', srcset: 'https://ipx.nuxt.com/s_32x32/gh_avatar/smarroufin 2x', loading: 'lazy' } }
]

const actions = [
  { id: 'new-file', label: 'Add new file', icon: 'i-heroicons-document-plus', click: () => toast.add({ title: 'New file added!' }), shortcuts: ['⌘', 'N'] },
  { id: 'new-folder', label: 'Add new folder', icon: 'i-heroicons-folder-plus', click: () => toast.add({ title: 'New folder added!' }), shortcuts: ['⌘', 'F'] },
  { id: 'hashtag', label: 'Add hashtag', icon: 'i-heroicons-hashtag', click: () => toast.add({ title: 'Hashtag added!' }), shortcuts: ['⌘', 'H'] },
  { id: 'label', label: 'Add label', icon: 'i-heroicons-tag', click: () => toast.add({ title: 'Label added!' }), shortcuts: ['⌘', 'L'] }
]

const groups = computed(() =>
  [commandPaletteRef.value?.query
    ? {
        key: 'users',
        commands: users
      }
    : {
        key: 'recent',
        label: 'Recent searches',
        commands: users.slice(0, 1)
      }, {
    key: 'actions',
    commands: actions
  }].filter(Boolean))

function onSelect(option) {
  if (option.click) {
    option.click()
  } else if (option.to) {
    router.push(option.to)
  } else if (option.href) {
    window.open(option.href, '_blank')
  }
}
</script>

<template>
  <UCommandPalette ref="commandPaletteRef" :groups="groups" :autoselect="false" @update:model-value="onSelect" />
</template>
