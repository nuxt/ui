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
  icon: 'i-lucide-rocket'
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
    click() {
      console.log(`Toast ${id} action clicked`)
    }
  }]
}, {
  title: `Toast ${id}`,
  icon: 'i-lucide-rocket',
  actions: [{
    label: 'Action 1',
    color: 'neutral' as const,
    click() {
      console.log(`Toast ${id} action 1 clicked`)
    }
  }, {
    label: 'Action 2',
    color: 'neutral' as const,
    variant: 'outline' as const,
    click() {
      console.log(`Toast ${id} action 2 clicked`)
    }
  }]
}, {
  description: `This is the toast ${id}`,
  icon: 'i-lucide-rocket',
  actions: [{
    label: 'Action',
    variant: 'outline' as const,
    click() {
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
    click(toast) {
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
  <div class="flex flex-col items-center gap-8">
    <div class="flex flex-col gap-2">
      <URadioGroup v-model="appConfig.toaster.position" :items="positions" />
      <UCheckbox v-model="appConfig.toaster.expand" label="Expand" class="mt-1" />
      <UInput v-model="appConfig.toaster.duration" label="Duration" type="number" class="mt-1" />
    </div>

    <div class="flex items-center gap-2">
      <UButton label="Add new" color="neutral" variant="outline" @click="addToast" />
      <UButton label="Update last" color="neutral" variant="outline" @click="updateToast" />
      <UButton label="Remove last" color="neutral" variant="outline" @click="removeToast" />
    </div>
  </div>
</template>
