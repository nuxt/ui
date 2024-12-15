<script setup lang="ts">
// import { createReusableTemplate, refDebounced } from '@vueuse/core'
import { createReusableTemplate } from '@vueuse/core'
import type { User } from '~/types'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()
const toast = useToast()

const open = ref(false)
const searchTerm = ref('')
// const searchTermDebounced = refDebounced(searchTerm, 200)
const selected = ref([])

const { data: users, status } = await useFetch('https://jsonplaceholder.typicode.com/users', {
  // params: { q: searchTermDebounced },
  transform: (data: User[]) => {
    return data?.map(user => ({ id: user.id, label: user.name, suffix: user.email, avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` } })) || []
  },
  lazy: true
})

const loading = ref(false)

const groups = computed(() => [{
  id: 'users',
  label: searchTerm.value ? `Users matching “${searchTerm.value}”...` : 'Users',
  items: users.value || []
}, {
  id: 'actions',
  items: [{
    label: 'Add new file',
    suffix: 'Create a new file in the current directory or workspace.',
    icon: 'i-lucide-file-plus',
    loading: loading.value,
    onSelect(e: Event) {
      e.preventDefault()

      toast.add({ title: 'New file added!' })

      loading.value = true

      setTimeout(() => {
        loading.value = false
      }, 2000)
    },
    kbds: ['meta', 'N']
  }, {
    label: 'Add new folder',
    suffix: 'Create a new folder in the current directory or workspace.',
    icon: 'i-lucide-folder-plus',
    onSelect(e: Event) {
      e.preventDefault()

      toast.add({ title: 'New folder added!' })
    },
    kbds: ['meta', 'F']
  }, {
    label: 'Add hashtag',
    suffix: 'Add a hashtag to the current item.',
    icon: 'i-lucide-hash',
    onSelect(e: Event) {
      e.preventDefault()

      toast.add({ title: 'Hashtag added!' })
    },
    kbds: ['meta', 'H']
  }, {
    label: 'Add label',
    suffix: 'Add a label to the current item.',
    icon: 'i-lucide-tag',
    onSelect(e: Event) {
      e.preventDefault()

      toast.add({ title: 'Label added!' })
    },
    kbds: ['meta', 'L']
  }]
}])

const labels = [{
  label: 'bug',
  chip: {
    color: 'error' as const
  }
}, {
  label: 'feature',
  chip: {
    color: 'success' as const
  }
}, {
  label: 'enhancement',
  chip: {
    color: 'info' as const
  }
}]
const label = ref()

// function onSelect(item: typeof groups.value[number]['items'][number]) {
function onSelect(item: any) {
  console.log('Selected', item)
}

defineShortcuts({
  meta_k: () => open.value = !open.value,
  ...extractShortcuts(groups.value)
})
</script>

<template>
  <DefineTemplate>
    <UCommandPalette
      v-model="selected"
      v-model:search-term="searchTerm"
      :loading="status === 'pending'"
      :groups="groups"
      :fuse="{
        fuseOptions: {
          includeMatches: true
        }
      }"
      multiple
      class="sm:max-h-80"
      @update:model-value="onSelect"
    />
  </DefineTemplate>

  <div class="flex-1 flex flex-col gap-12 w-full max-w-lg">
    <div class="flex items-center justify-between gap-2 mt-[58px]">
      <UModal v-model:open="open">
        <UButton label="Open modal" color="neutral" variant="outline" />

        <template #content>
          <ReuseTemplate :close="true" @update:open="open = $event" />
        </template>
      </UModal>

      <UDrawer should-scale-background>
        <UButton label="Open drawer" color="neutral" variant="outline" />

        <template #content>
          <ReuseTemplate class="border-t border-[var(--ui-border)] mt-4" />
        </template>
      </UDrawer>

      <UPopover :content="{ side: 'right', align: 'start' }">
        <UButton label="Select label (popover)" color="neutral" variant="outline" />

        <template #content>
          <UCommandPalette v-model="label" placeholder="Search labels..." :groups="[{ id: 'labels', items: labels }]" :ui="{ input: '[&>input]:h-9' }" />
        </template>
      </UPopover>
    </div>

    <UCard :ui="{ body: '!p-0' }">
      <ReuseTemplate />
    </UCard>
  </div>
</template>
