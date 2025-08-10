<script setup lang="ts">
const groups = [
  {
    id: 'actions',
    items: [
      {
        label: 'Add new file',
        suffix: 'Create a new file in the current directory',
        icon: 'i-lucide-file-plus',
        kbds: ['meta', 'N']
      },
      {
        label: 'Add new folder',
        suffix: 'Create a new folder in the current directory',
        icon: 'i-lucide-folder-plus',
        kbds: ['meta', 'F']
      },
      {
        label: 'Search files',
        suffix: 'Search across all files in the project',
        icon: 'i-lucide-search',
        kbds: ['meta', 'P']
      },
      {
        label: 'Settings',
        suffix: 'Open application settings',
        icon: 'i-lucide-settings',
        kbds: ['meta', ',']
      }
    ]
  },
  {
    id: 'recent',
    label: 'Recent',
    items: [
      {
        label: 'project.vue',
        suffix: 'components/',
        icon: 'i-vscode-icons-file-type-vue'
      },
      {
        label: 'readme.md',
        suffix: 'docs/',
        icon: 'i-vscode-icons-file-type-markdown'
      },
      {
        label: 'package.json',
        suffix: 'root/',
        icon: 'i-vscode-icons-file-type-node'
      }
    ]
  }
]
</script>

<template>
  <UCommandPalette :groups="groups" class="flex-1 h-80">
    <template #footer>
      <div class="flex items-center justify-between gap-2">
        <UIcon name="i-simple-icons-nuxtdotjs" class="size-5 text-dimmed ml-1" />
        <div class="flex items-center gap-1">
          <UButton color="neutral" variant="ghost" label="Open Command" class="text-dimmed" size="xs">
            <template #trailing>
              <UKbd value="enter" />
            </template>
          </UButton>
          <USeparator orientation="vertical" class="h-4" />
          <UButton color="neutral" variant="ghost" label="Actions" class="text-dimmed" size="xs">
            <template #trailing>
              <UKbd value="meta" />
              <UKbd value="k" />
            </template>
          </UButton>
        </div>
      </div>
    </template>
  </UCommandPalette>
</template>
