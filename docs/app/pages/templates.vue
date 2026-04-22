<script setup lang="ts">
const { data: page } = await useAsyncData('templates', () => queryCollection('templates').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
  ogTitle: page.value.title,
  ogDescription: page.value.description
})

defineOgImageComponent('Docs')
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <main v-if="page">
    <UPageHero :ui="{ container: 'relative py-10 sm:py-16 lg:py-24' }">
      <template #title>
        <MDC :value="page.hero.title" unwrap="p" cache-key="pro-templates-hero-title" />
      </template>

      <template #description>
        <MDC :value="page.hero.description" unwrap="p" cache-key="pro-templates-hero-description" />
      </template>

      <template #links>
        <FrameworkTabs size="md" class="w-48" />
      </template>

      <template #top>
        <div class="absolute z-[-1] rounded-full bg-primary blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />
      </template>

      <LazyStarsBg />

      <div aria-hidden="true" class="hidden lg:block absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />
    </UPageHero>

    <UPageSection
      v-for="(template, index) in page.items"
      :key="index"
      :title="template.title"
      :features="template.features"
      orientation="horizontal"
      class="lg:border-t border-default"
      :class="`${template.framework}-only`"
      :ui="{
        title: 'lg:text-4xl',
        wrapper: 'lg:py-16 lg:min-h-[481px] flex flex-col justify-center lg:border-r border-default order-last lg:pr-16',
        container: 'lg:py-0',
        links: 'gap-x-3'
      }"
    >
      <template #links>
        <UButton v-for="link of template.links" :key="link.label" color="neutral" variant="outline" v-bind="link" />

        <UDropdownMenu
          :items="template.open_links"
          :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-auto' }"
          :modal="false"
          class="group"
        >
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-square-code"
            trailing-icon="i-lucide-chevron-down"
            label="Open on"
            :ui="{
              trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
            }"
          />
        </UDropdownMenu>

        <UDropdownMenu
          :items="[
            ...template.deploy_links,
            { label: 'Other', icon: 'i-lucide-globe', to: 'https://nuxt.com/deploy', target: '_blank' }
          ]"
          :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-auto' }"
          :modal="false"
          class="group"
        >
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-cloud"
            trailing-icon="i-lucide-chevron-down"
            label="Deploy to"
            :ui="{
              trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
            }"
          />
        </UDropdownMenu>
      </template>

      <template #description>
        <MDC :value="template.description" unwrap="p" :cache-key="`pro-templates-${index}-description`" />
      </template>

      <div class="lg:border-x border-default h-full flex items-center lg:bg-muted/20">
        <Motion class="flex-1" :initial="{ opacity: 0, transform: 'translateY(10px)' }" :while-in-view="{ opacity: 1, transform: 'translateY(0px)' }" :in-view-options="{ once: true }" :transition="{ duration: 0.5, delay: 0.2 }">
          <UColorModeImage
            :light="`/assets/templates/${template.framework}/${template.title.toLowerCase()}-light.png`"
            :dark="`/assets/templates/${template.framework}/${template.title.toLowerCase()}-dark.png`"
            class="w-full h-auto border lg:border-y lg:border-x-0 border-default rounded-sm lg:rounded-none"
            :alt="`Template ${template.title} screenshot`"
            width="654"
            height="368"
            loading="lazy"
          />
        </Motion>
      </div>
    </UPageSection>
  </main>
</template>
