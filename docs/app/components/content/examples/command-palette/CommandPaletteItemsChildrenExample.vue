<script setup lang="ts">
const toast = useToast()

const groups = [{
  id: 'actions',
  label: 'Actions',
  items: [{
    label: 'Create new',
    icon: 'i-lucide-plus',
    children: [{
      label: 'New file',
      icon: 'i-lucide-file-plus',
      suffix: 'Create a new file in the current directory',
      onSelect(e: Event) {
        e.preventDefault()
        toast.add({ title: 'New file created!' })
      },
      kbds: ['meta', 'N']
    }, {
      label: 'New folder',
      icon: 'i-lucide-folder-plus',
      suffix: 'Create a new folder in the current directory',
      onSelect(e: Event) {
        e.preventDefault()
        toast.add({ title: 'New folder created!' })
      },
      kbds: ['meta', 'F']
    }, {
      label: 'New project',
      icon: 'i-lucide-folder-git',
      suffix: 'Create a new project from a template',
      onSelect(e: Event) {
        e.preventDefault()
        toast.add({ title: 'New project created!' })
      },
      kbds: ['meta', 'P']
    }]
  }, {
    label: 'Share',
    icon: 'i-lucide-share',
    children: [{
      label: 'Copy link',
      icon: 'i-lucide-link',
      suffix: 'Copy a link to the current item',
      onSelect(e: Event) {
        e.preventDefault()
        toast.add({ title: 'Link copied to clipboard!' })
      },
      kbds: ['meta', 'L']
    }, {
      label: 'Share via email',
      icon: 'i-lucide-mail',
      suffix: 'Share the current item via email',
      onSelect(e: Event) {
        e.preventDefault()
        toast.add({ title: 'Share via email dialog opened!' })
      }
    }, {
      label: 'Share on social',
      icon: 'i-lucide-share-2',
      suffix: 'Share the current item on social media',
      children: [{
        label: 'Twitter',
        icon: 'i-simple-icons-twitter',
        onSelect(e: Event) {
          e.preventDefault()
          toast.add({ title: 'Shared on Twitter!' })
        }
      }, {
        label: 'LinkedIn',
        icon: 'i-simple-icons-linkedin',
        onSelect(e: Event) {
          e.preventDefault()
          toast.add({ title: 'Shared on LinkedIn!' })
        }
      }, {
        label: 'Facebook',
        icon: 'i-simple-icons-facebook',
        onSelect(e: Event) {
          e.preventDefault()
          toast.add({ title: 'Shared on Facebook!' })
        }
      }]
    }]
  }, {
    label: 'Settings',
    icon: 'i-lucide-settings',
    children: [{
      label: 'General',
      icon: 'i-lucide-sliders',
      suffix: 'Configure general settings',
      onSelect(e: Event) {
        e.preventDefault()
        toast.add({ title: 'General settings opened!' })
      }
    }, {
      label: 'Appearance',
      icon: 'i-lucide-palette',
      suffix: 'Customize the appearance',
      onSelect(e: Event) {
        e.preventDefault()
        toast.add({ title: 'Appearance settings opened!' })
      }
    }, {
      label: 'Security',
      icon: 'i-lucide-shield',
      suffix: 'Manage security settings',
      onSelect(e: Event) {
        e.preventDefault()
        toast.add({ title: 'Security settings opened!' })
      }
    }]
  }]
}]
</script>

<template>
  <UCommandPalette :groups="groups" class="flex-1" />
</template>
