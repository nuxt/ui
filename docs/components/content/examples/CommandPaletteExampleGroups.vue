<script setup>
const router = useRouter()

const commandPaletteRef = ref()

const users = [
  { id: 'benjamincanac', label: 'benjamincanac', href: 'https://github.com/benjamincanac', target: '_blank', avatar: { src: 'https://avatars.githubusercontent.com/u/739984?v=4' } },
  { id: 'Atinux', label: 'Atinux', href: 'https://github.com/Atinux', target: '_blank', avatar: { src: 'https://avatars.githubusercontent.com/u/904724?v=4' } },
  { id: 'smarroufin', label: 'smarroufin', href: 'https://github.com/smarroufin', target: '_blank', avatar: { src: 'https://avatars.githubusercontent.com/u/7547335?v=4' } }
]

const actions = [
  { id: 'new-file', label: 'Add new file', icon: 'i-heroicons-document-plus', click: () => alert('New file'), shortcuts: ['⌘', 'N'] },
  { id: 'new-folder', label: 'Add new folder', icon: 'i-heroicons-folder-plus', click: () => alert('New folder'), shortcuts: ['⌘', 'F'] },
  { id: 'hashtag', label: 'Add hashtag', icon: 'i-heroicons-hashtag', click: () => alert('Add hashtag'), shortcuts: ['⌘', 'H'] },
  { id: 'label', label: 'Add label', icon: 'i-heroicons-tag', click: () => alert('Add label'), shortcuts: ['⌘', 'L'] }
]

const groups = computed(() => commandPaletteRef.value?.query
  ? [{
      key: 'users',
      commands: users
    }]
  : [{
      key: 'recent',
      label: 'Recent searches',
      commands: users.slice(0, 1)
    }, {
      key: 'actions',
      commands: actions
    }])

function onSelect (option) {
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
