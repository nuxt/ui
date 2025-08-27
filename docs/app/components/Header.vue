<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import type { NavigationMenuItem } from '@nuxt/ui'
import { mapContentNavigation } from '@nuxt/ui/utils/content'

const props = defineProps<{
  links: NavigationMenuItem[]
}>()

const route = useRoute()
const config = useRuntimeConfig().public

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const desktopLinks = computed(() => props.links.map(({ icon, ...link }) => link))
const mobileLinks = computed(() => [
  ...props.links.map(link => ({ ...link, defaultOpen: link.children && route.path.startsWith(link.to as string) })),
  {
    label: 'Open on GitHub',
    to: 'https://github.com/nuxt/ui',
    icon: 'i-simple-icons-github',
    target: '_blank'
  }
])

const items = computed(() => {
  return [
    { label: `v${config.version}`, active: true, color: 'primary' as const, checked: true, type: 'checkbox' as const },
    { label: 'v3.x', to: 'https://ui.nuxt.com' },
    { label: 'v2.x', to: 'https://ui2.nuxt.com' }
  ]
})

const docsNavigation = computed(() => mapContentNavigation(navigation?.value.map(item => ({ ...item, children: undefined })) ?? [])?.map(item => ({
  ...item,
  active: route.path.startsWith(item.to as string)
})))

const logoElement = ref()
const { copy } = useClipboard()
const toast = useToast()

const copyLogo = () => {
  if (logoElement.value) {
    copy(logoElement.value.$el.outerHTML)
    toast.add({
      title: 'Nuxt logo copied as SVG',
      description: 'You can now paste it into your project',
      icon: 'i-lucide-circle-check',
      color: 'success'
    })
  }
}

const logoContextMenuItems = [
  [{
    label: 'Copy logo as SVG',
    icon: 'i-simple-icons-nuxtdotjs',
    onSelect() {
      copyLogo()
    }
  }],
  [{
    label: 'Browse design kit',
    icon: 'i-lucide-shapes',
    to: 'https://nuxt.com/design-kit',
    target: '_blank'
  }]
]
</script>

<template>
  <UHeader :ui="{ left: 'min-w-0' }" class="flex flex-col">
    <template #left>
      <UContextMenu :items="logoContextMenuItems">
        <NuxtLink to="/" class="flex items-end gap-2 font-bold text-xl text-highlighted min-w-0 focus-visible:outline-primary shrink-0" aria-label="Nuxt UI">
          <Logo ref="logoElement" class="w-auto h-6 shrink-0" />
        </NuxtLink>
      </UContextMenu>

      <UDropdownMenu
        v-slot="{ open }"
        :modal="false"
        :items="items"
        :content="{ align: 'start' }"
        :ui="{ content: 'min-w-fit' }"
        size="xs"
      >
        <UButton
          :label="`v${config.version}`"
          variant="subtle"
          trailing-icon="i-lucide-chevron-down"
          size="xs"
          class="-mb-[6px] font-semibold rounded-full truncate"
          :class="[open && 'bg-primary/15 ']"
          :ui="{
            trailingIcon: ['transition-transform duration-200', open ? 'rotate-180' : undefined].filter(Boolean).join(' ')
          }"
        />
      </UDropdownMenu>
    </template>

    <UNavigationMenu :items="desktopLinks" variant="link" />

    <template #right>
      <ThemePicker />

      <UTooltip text="Search" :kbds="['meta', 'K']">
        <UContentSearchButton />
      </UTooltip>

      <UTooltip text="Open on GitHub" class="hidden lg:flex">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/nuxt/ui"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>

    <template #body>
      <UNavigationMenu orientation="vertical" :items="mobileLinks" class="-mx-2.5" />

      <USeparator type="dashed" class="mt-4 mb-6" />

      <div class="flex flex-col gap-2 w-[calc(100%+1.25rem)] mb-5.5 -mx-2.5">
        <FrameworkSelect />
      </div>

      <UContentNavigation :navigation="navigation" highlight :ui="{ linkTrailingBadge: 'font-semibold uppercase' }" />
    </template>

    <template v-if="route.path.startsWith('/docs/')" #bottom>
      <USeparator class="hidden lg:flex" />

      <UContainer class="hidden lg:flex items-center justify-between">
        <UNavigationMenu :items="docsNavigation" variant="pill" highlight class="-mx-2.5 -mb-px" />

        <FrameworkSelect class="w-40" />
      </UContainer>
    </template>
  </UHeader>
</template>
