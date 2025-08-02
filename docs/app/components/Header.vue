<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import type { NavigationMenuItem } from '@nuxt/ui'

const props = defineProps<{
  links: NavigationMenuItem[]
}>()

const route = useRoute()
const config = useRuntimeConfig().public
const { module } = useSharedData()

const value = ref<string | undefined>(module.value)

watch(module, () => {
  value.value = module.value
})

onMounted(() => {
  value.value = module.value
})

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const githubLink = computed(() => `https://github.com/nuxt/${value.value}`)

const desktopLinks = computed(() => props.links.map(({ icon, ...link }) => link))
const mobileLinks = computed(() => [
  ...props.links.map(link => ({ ...link, defaultOpen: link.children && route.path.startsWith(link.to as string) })),
  {
    label: 'Open on GitHub',
    to: githubLink.value,
    icon: 'i-simple-icons-github',
    target: '_blank'
  }
])

const items = computed(() => {
  const ui2 = { label: 'v2.22.0', to: 'https://ui2.nuxt.com' }
  const uiPro1 = { label: 'v1.8.0', to: 'https://ui2.nuxt.com/pro' }

  return [
    { label: `v${config.version}`, active: true, color: 'primary' as const, checked: true, type: 'checkbox' as const },
    route.path === '/' ? ui2 : route.path.startsWith('/pro') ? uiPro1 : module.value === 'ui-pro' ? uiPro1 : ui2
  ]
})

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
  <UHeader :ui="{ left: 'min-w-0' }" :menu="{ shouldScaleBackground: true }">
    <template #left>
      <UContextMenu :items="logoContextMenuItems">
        <NuxtLink to="/" class="flex items-end gap-2 font-bold text-xl text-highlighted min-w-0 focus-visible:outline-primary shrink-0" aria-label="Nuxt UI">
          <Logo v-if="route.path === '/'" ref="logoElement" class="w-auto h-6 shrink-0" />
          <LogoPro v-else-if="route.path.startsWith('/pro')" ref="logoElement" class="w-auto h-6 shrink-0" />
          <template v-else>
            <LogoPro class="w-auto h-6 shrink-0 ui-pro-only" />
            <Logo ref="logoElement" class="w-auto h-6 shrink-0 ui-only" />
          </template>
        </NuxtLink>
      </UContextMenu>

      <UDropdownMenu
        v-slot="{ open }"
        :modal="false"
        :items="items"
        :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-0' }"
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
          :key="value"
          color="neutral"
          variant="ghost"
          :to="githubLink"
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
        <ModuleSelect />
      </div>

      <UContentNavigation :navigation="navigation" highlight :ui="{ linkTrailingBadge: 'font-semibold uppercase' }">
        <template #link-title="{ link }">
          <span class="inline-flex items-center gap-0.5">
            {{ link.title }}

            <sup v-if="link.module === 'ui-pro'" class="text-[8px] font-medium text-primary">PRO</sup>
          </span>
        </template>
      </UContentNavigation>
    </template>
  </UHeader>
</template>
