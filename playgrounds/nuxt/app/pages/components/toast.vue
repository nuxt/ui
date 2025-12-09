<script setup lang="ts">
import theme from '#build/ui/toaster'
import { useAppConfig } from '#imports'

const positions = Object.keys(theme.variants.position)

const { toasts, add, update, remove } = useToast()
const appConfig = useAppConfig()

const count = ref(1)
const last = computed(() => toasts.value[toasts.value.length - 1])

const templates = (id: number) => [{
  title: 'Toast',
  description: `This is the toast ${id}`
}, {
  title: `Toast ${id}`
}, {
  description: `This is the toast ${id}`
}, {
  title: 'Toast',
  description: `This is the toast ${id}`,
  icon: 'i-lucide-rocket',
  actions: [{
    label: 'Action 1',
    color: 'neutral' as const,
    onClick() {
      console.log(`Toast ${id} action 1 clicked`)
    }
  }, {
    label: 'Action 2',
    color: 'neutral' as const,
    variant: 'outline' as const,
    onClick() {
      console.log(`Toast ${id} action 2 clicked`)
    }
  }]
}, {
  title: `Toast ${id}`,
  icon: 'i-lucide-rocket'
}, {
  description: `This is the toast ${id}`,
  icon: 'i-lucide-rocket'
}, {
  title: 'Toast',
  description: `This is the toast ${id}`,
  avatar: {
    src: 'https://github.com/benjamincanac.png'
  }
}, {
  title: 'Toast',
  description: `This is the toast ${id}`,
  avatar: {
    src: 'https://github.com/benjamincanac.png'
  },
  actions: [{
    label: 'Action',
    onClick() {
      console.log(`Toast ${id} action clicked`)
    }
  }]
}, {
  title: `Toast ${id}`,
  icon: 'i-lucide-rocket',
  orientation: 'horizontal' as const,
  actions: [{
    label: 'Action 1',
    color: 'neutral' as const,
    onClick() {
      console.log(`Toast ${id} action 1 clicked`)
    }
  }, {
    label: 'Action 2',
    color: 'neutral' as const,
    variant: 'outline' as const,
    onClick() {
      console.log(`Toast ${id} action 2 clicked`)
    }
  }]
}, {
  description: `This is the toast ${id}`,
  icon: 'i-lucide-rocket',
  orientation: 'horizontal' as const,
  actions: [{
    label: 'Action',
    variant: 'outline' as const,
    onClick() {
      console.log(`Toast ${id} action clicked`)
    }
  }]
}]

function addToast() {
  const id = count.value++

  const template = templates(id)[Math.floor(Math.random() * templates(id).length)]

  add({
    id,
    ...template,
    onClick(toast) {
      console.log(`Toast ${toast.id} clicked`)
    }
  })
}

function updateToast() {
  if (!last.value) {
    return
  }

  update(last.value.id, {
    title: 'Toast updated',
    description: `This is the updated toast ${count.value++}`
  })
}

function removeToast() {
  if (!last.value) {
    return
  }

  remove(last.value.id)
}
</script>

<template>
  <Navbar>
    <USwitch v-model="appConfig.toaster.disableSwipe" label="Disable swipe" />
    <UCheckbox v-model="appConfig.toaster.expand" label="Expand" />
    <USelect v-model="appConfig.toaster.position" :items="positions" placeholder="Position" />
    <UInput v-model="appConfig.toaster.duration" placeholder="Duration" type="number" />
    <UInput v-model="appConfig.toaster.max" placeholder="Max" type="number" />
  </Navbar>

  <div class="flex items-center gap-2">
    <UButton label="Add new" color="neutral" variant="outline" @click="addToast" />
    <UButton label="Update last" color="neutral" variant="outline" @click="updateToast" />
    <UButton label="Remove last" color="neutral" variant="outline" @click="removeToast" />
  </div>
</template>
