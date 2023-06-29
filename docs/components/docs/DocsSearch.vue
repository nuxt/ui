<template>
  <UModal
    v-model="isSearchModalOpen"
    :overlay="!isXs"
    :transition="!isXs"
    :ui="{
      padding: 'sm:p-4',
      rounded: 'sm:rounded-lg',
      width: 'sm:max-w-3xl',
      height: 'h-screen sm:h-[28rem]'
    }"
  >
    <UCommandPalette
      ref="commandPaletteRef"
      :groups="groups"
      command-attribute="title"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray', variant: 'ghost', size: 'sm', class: '-mr-1.5' }"
      :ui="{ input: { height: 'h-16 sm:h-12', icon: { size: 'h-5 w-5', padding: 'pl-11' } } }"
      :fuse="{
        fuseOptions: { ignoreLocation: true, includeMatches: true, threshold: 0, keys: ['title', 'description', 'children.children.value', 'children.children.children.value'] },
        resultLimit: 10
      }"
      @update:model-value="onSelect"
      @close="isSearchModalOpen = false"
    />
  </UModal>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'
import type { Command } from '../../../src/runtime/types'

const navigation: Ref<NavItem[]> = inject('navigation')

const router = useRouter()
const { usingInput } = useShortcuts()
const { isSearchModalOpen } = useDocs()
const breakpoints = useBreakpoints({ mobile: 640 })

const isXs = breakpoints.smaller('mobile')

const commandPaletteRef = ref<HTMLElement & { query: Ref<string>, results: { item: Command }[] }>()

const { data: files } = await useLazyAsyncData('search', () => queryContent().where({ _type: 'markdown' }).find(), { default: () => [] })

// Computed

const defaultGroups = computed(() => navigation.value.map(item => ({
  key: item._path,
  label: item.title,
  commands: files.value.filter(file => file._path.startsWith(item._path)).map(file => ({
    id: file._id,
    title: file.navigation?.title || file.title,
    to: file._path,
    suffix: file.description,
    icon: file.icon
  }))
})))

const queryGroups = computed(() => navigation.value.map(item => ({
  key: item._path,
  label: item.title,
  commands: files.value.filter(file => file._path.startsWith(item._path)).flatMap((file) => {
    return [{
      id: file._id,
      title: file.navigation?.title || file.title,
      to: file._path,
      description: file.description,
      icon: file.icon
    },
    // @ts-ignore
    ...Object.entries(groupByHeading(file.body.children)).map(([hash, { title, children }]) => ({
      id: `${file._path}${hash}`,
      title,
      prefix: `${file.navigation?.title || file.title} ->`,
      prefixClass: 'text-gray-700 dark:text-gray-200',
      to: `${file._path}${hash}`,
      children: concatChildren(children),
      icon: file.icon
    }))]
  })
})))

const groups = computed(() => commandPaletteRef.value?.query ? queryGroups.value : defaultGroups.value)

// avoid conflicts between multiple meta_k shortcuts
const canToggleModal = computed(() => isSearchModalOpen.value || !usingInput.value)

// Methods

function remapChildren (children: any[]) {
  return children?.map((grandChild) => {
    if (['code-inline', 'em', 'a', 'strong'].includes(grandChild.tag)) {
      return { type: 'text', value: grandChild.children.find(child => child.type === 'text')?.value || '' }
    }

    return grandChild
  })
}

function concatChildren (children: any[]) {
  return children.map((child) => {
    if (['alert'].includes(child.tag)) {
      child.children = concatChildren(child.children)
    }
    if (child.tag === 'p') {
      child.children = remapChildren(child.children)

      child.children = child.children?.reduce((acc, grandChild) => {
        if (grandChild.type === 'text') {
          if (acc.length && acc[acc.length - 1].type === 'text') {
            acc[acc.length - 1].value += grandChild.value
          } else {
            acc.push(grandChild)
          }
        } else {
          acc.push(grandChild)
        }
        return acc
      }, [])
    }
    if (['style'].includes(child.tag)) {
      return null
    }

    return child
  })
}

function groupByHeading (children: any[]) {
  const groups = {} // grouped by path
  let hash = '' // file.page with potential `#anchor` concat
  let title: string | null
  for (const node of children) {
    // if heading found, udpate current path
    if (['h2', 'h3'].includes(node.tag)) {
      // find heading text value
      title = node.children?.find(child => child.type === 'text')?.value
      if (title) {
        hash = `#${node.props.id}`
      }
    }
    // push to existing/new group based on path
    if (groups[hash]) {
      groups[hash].children.push(node)
    } else {
      groups[hash] = { children: [node], title }
    }
  }
  return groups
}

function onSelect (option) {
  isSearchModalOpen.value = false

  if (option.click) {
    option.click()
  } else if (option.to) {
    router.push(option.to)
  } else if (option.href) {
    window.open(option.href, '_blank')
  }
}

// Shortcuts

defineShortcuts({
  meta_k: {
    usingInput: true,
    whenever: [canToggleModal],
    handler: () => {
      isSearchModalOpen.value = !isSearchModalOpen.value
    }
  },
  escape: {
    usingInput: true,
    whenever: [isSearchModalOpen],
    handler: () => { isSearchModalOpen.value = false }
  }
})
</script>
