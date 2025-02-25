<script setup lang="ts">
const title = 'Vue Components'
const description = 'Explore 99+ customizable UI components for Vue and Nuxt built with Tailwind CSS and Reka UI.'

useSeoMeta({
  titleTemplate: `%s - Nuxt UI`,
  title,
  description,
  ogTitle: `${title} - Nuxt UI`,
  ogDescription: description
})

defineOgImageComponent('Docs', {
  headline: 'Documentation'
})

const { data: components } = await useAsyncData('components', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/components/%')
    .where('extension', '=', 'md')
    .select('path', 'title', 'description', 'category', 'module')
    .all()
})

const componentsPerCategory = computed(() => {
  return components.value!.reduce((acc, component) => {
    acc[component.category!] = [...(acc[component.category!] || []), component]
    return acc
  }, {} as Record<string, any[]>)
})

const categories = [{
  id: 'layout',
  title: 'Layout',
  description: 'Structural components for organizing content, including containers, grids, dividers, and responsive layout systems.'
}, {
  id: 'form',
  title: 'Form',
  description: 'Interactive form elements including inputs, selects, checkboxes, radio buttons, and advanced form validation components.'
}, {
  id: 'element',
  title: 'Element',
  description: 'Core UI building blocks like buttons, badges, icons, avatars, and other fundamental interface elements.'
}, {
  id: 'data',
  title: 'Data',
  description: 'Components for displaying and managing data, including tables, lists, cards, data grids, and visualization elements.'
}, {
  id: 'navigation',
  title: 'Navigation',
  description: 'Components for user navigation and wayfinding, including menus, breadcrumbs, pagination, and navigation bars.'
}, {
  id: 'overlay',
  title: 'Overlay',
  description: 'Floating UI elements like modals, dialogs, tooltips, popovers, and other components that overlay the main content.'
}]

const { y } = useWindowScroll()
onMounted(() => {
  const stickyElements = document.querySelectorAll('[data-track-sticky]') as NodeListOf<HTMLElement>
  watch(y, () => {
    stickyElements.forEach((el) => {
      const rect = el.getBoundingClientRect()
      const topComputed = Number.parseInt(window.getComputedStyle(el).top || '0', 10)
      if (rect.top <= topComputed) {
        el.dataset.stuck = ''
      } else {
        delete el.dataset.stuck
      }
    })
  }, { immediate: true })
})
</script>

<template>
  <UMain>
    <UPageHero
      description="Build your Vue or Nuxt application faster with Nuxt UI and Nuxt UI Pro components. Powered by Tailwind CSS and Reka UI, delivering responsive and customizable components."
      class="relative"
      orientation="vertical"
      :ui="{ title: 'text-balance', container: 'relative' }"
    >
      <div aria-hidden="true" class="hidden lg:block absolute z-[-1] border-x border-(--ui-border) inset-0 mx-4 sm:mx-6 lg:mx-8" />
      <template #headline>
        <UButton
          to="https://tailwindcss.com"
          label="Made with Tailwind CSS v4"
          size="md"
          variant="subtle"
          color="neutral"
          icon="i-logos-tailwindcss-icon"
          class="rounded-full"
        />
      </template>
      <template #title>
        Build beautiful UI with <span class="text-(--ui-primary)">{{ components!.length }}+</span> powerful components
      </template>
      <template #links>
        <UButton
          to="/getting-started/installation/vue"
          label="Start with Vue"
          icon="i-logos-vue"
          color="neutral"
          variant="outline"
          size="xl"
        />
        <UButton
          to="/getting-started/installation/nuxt"
          label="Start with Nuxt"
          icon="i-logos-nuxt-icon"
          color="neutral"
          variant="outline"
          size="xl"
        />
      </template>
      <template #top>
        <div class="absolute z-[-1] rounded-full bg-(--ui-primary) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />
        <StarsBg />
      </template>
    </UPageHero>

    <div v-for="category in categories" :key="category.id">
      <div data-track-sticky class="group mb-4 sm:mb-6 lg:mb-8 sticky top-[calc(var(--ui-header-height)-1px)] bg-(--ui-bg)/75 backdrop-blur z-[1]">
        <div class="relative border-y border-(--ui-border) py-4 sm:not-group-[[data-stuck]]:py-6 lg:not-group-[[data-stuck]]:py-8 transition-all duration-300">
          <UContainer>
            <h2 class="relative text-pretty font-bold text-(--ui-text-highlighted) text-base sm:not-group-[[data-stuck]]:text-xl lg:not-group-[[data-stuck]]:text-2xl transition-all duration-300 ">
              <a :href="`#${category.id}`" class="group lg:not-group-[[data-stuck]]:ps-2 lg:not-group-[[data-stuck]]:-ms-2">
                <span class="absolute -ms-8 top-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 p-1 bg-(--ui-bg-elevated) hover:text-(--ui-primary) rounded-[calc(var(--ui-radius)*1.5)] hidden lg:not-group-[[data-stuck]]:flex text-(--ui-text-muted) transition">
                  <UIcon name="i-lucide-hash" class="size-4 shrink-0" />
                </span>
                {{ category.title }}
              </a>
            </h2>
            <p class="text-pretty text-(--ui-text-muted) text-sm sm:not-group-[[data-stuck]]:text-base lg:not-group-[[data-stuck]]:text-lg mt-1 sm:not-group-[[data-stuck]]:mt-2 line-clamp-1 transition-all duration-300">
              {{ category.description }}
            </p>
          </UContainer>
        </div>
      </div>
      <UContainer>
        <UPageGrid :id="category.id" class="xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pb-24 scroll-mt-[calc(97px+var(--ui-header-height))] sm:scroll-mt-[calc(133px+var(--ui-header-height))] lg:scroll-mt-[calc(165px+var(--ui-header-height))]">
          <UPageCard
            v-for="(component, index) in componentsPerCategory[category.id]"
            :key="component.path"
            variant="naked"
            :title="component.title"
            :description="component.description"
            :to="component.path"
            :ui="{ wrapper: 'order-last', container: 'lg:flex' }"
          >
            <template #title>
              <div class="flex items-center gap-0.5">
                <span>{{ component.title }}</span>
                <sup v-if="component.module === 'ui-pro'" class="text-[8px] font-medium text-(--ui-primary)">PRO</sup>
              </div>
            </template>

            <div class="group rounded-[calc(var(--ui-radius)*1.5)] border border-(--ui-border-muted) overflow-hidden aspect-[16/9]">
              <UColorModeImage
                :light="`${component.path.replace('/components/', '/components/light/')}.png`"
                :dark="`${component.path.replace('/components/', '/components/dark/')}.png`"
                class="group-hover:scale-105 transition-transform size-full"
                :loading="index >= 4 ? 'lazy' : 'eager'"
                width="640"
                height="360"
              />
            </div>
          </UPageCard>
        </UPageGrid>
      </UContainer>
    </div>
  </UMain>
</template>
