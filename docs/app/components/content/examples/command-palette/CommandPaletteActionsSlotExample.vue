<script setup lang="ts">
const toast = useToast()

const selectedStatus = ref('In Progress')

const statusItems = [
  {
    label: 'Backlog',
    icon: 'i-lucide-circle',
    onClick: () => {
      selectedStatus.value = 'Backlog'
      toast.add({ title: 'Status changed to Backlog' })
    }
  },
  {
    label: 'Todo',
    icon: 'i-lucide-circle-dot',
    onClick: () => {
      selectedStatus.value = 'Todo'
      toast.add({ title: 'Status changed to Todo' })
    }
  },
  {
    label: 'In Progress',
    icon: 'i-lucide-loader-circle',
    onClick: () => {
      selectedStatus.value = 'In Progress'
      toast.add({ title: 'Status changed to In Progress' })
    }
  },
  {
    label: 'Done',
    icon: 'i-lucide-circle-check',
    onClick: () => {
      selectedStatus.value = 'Done'
      toast.add({ title: 'Status changed to Done' })
    }
  }
]

const groups = [
  {
    id: 'tasks',
    label: 'Tasks',
    items: [
      {
        label: 'Design new landing page',
        suffix: 'High priority',
        icon: 'i-lucide-layout',
        chip: {
          label: 'In Progress',
          color: 'info' as const
        }
      },
      {
        label: 'Fix authentication bug',
        suffix: 'Critical',
        icon: 'i-lucide-bug',
        chip: {
          label: 'Todo',
          color: 'warning' as const
        }
      },
      {
        label: 'Update documentation',
        suffix: 'Medium priority',
        icon: 'i-lucide-file-text',
        chip: {
          label: 'Backlog',
          color: 'neutral' as const
        }
      },
      {
        label: 'Implement dark mode',
        suffix: 'Low priority',
        icon: 'i-lucide-moon',
        chip: {
          label: 'Done',
          color: 'success' as const
        }
      },
      {
        label: 'Optimize performance',
        suffix: 'High priority',
        icon: 'i-lucide-zap',
        chip: {
          label: 'In Progress',
          color: 'info' as const
        }
      },
      {
        label: 'Add unit tests',
        suffix: 'Medium priority',
        icon: 'i-lucide-test-tube',
        chip: {
          label: 'Todo',
          color: 'warning' as const
        }
      }
    ]
  }
]
</script>

<template>
  <UCommandPalette :groups="groups" placeholder="Search tasks..." class="flex-1 h-80">
    <template #actions>
      <UDropdownMenu :items="statusItems">
        <UButton :label="selectedStatus" color="neutral" variant="outline" trailing-icon="i-lucide-chevron-down" />
      </UDropdownMenu>
    </template>
  </UCommandPalette>
</template>
