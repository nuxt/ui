<script setup lang="ts">
const appConfig = useAppConfig()

// The two counts render side by side, each hidden by the framework class:
// a JS count would disagree with the server, which has no cookie to read.
const counts = computed(() => ({
  nuxt: page.value?.items.filter(item => item.framework === 'nuxt').length ?? 0,
  vue: page.value?.items.filter(item => item.framework === 'vue').length ?? 0
}))

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

useCanonical()

if (import.meta.server) {
  defineOgImage('Docs.takumi', {
    title: page.value.title,
    description: page.value.description
  })
}
</script>

<template>
  <main v-if="page">
    <PageHero v-bind="page.hero" />

    <UContainer class="max-w-[1180px] pt-10 pb-16">
      <div class="flex flex-wrap items-center gap-x-3.5 gap-y-3">
        <FrameworkTabs size="sm" class="w-40" />

        <span class="hidden sm:block flex-1 h-px bg-(--ui-border)" />

        <span class="nuxt-only text-xs text-muted whitespace-nowrap">{{ counts.nuxt }} templates</span>
        <span class="vue-only text-xs text-muted whitespace-nowrap">{{ counts.vue }} templates</span>
      </div>

      <div class="flex flex-col">
        <article
          v-for="(template, index) in page.items"
          :key="index"
          :class="`${template.framework}-only`"
          class="flex flex-col sm:flex-row gap-5 lg:gap-9 py-7 border-b border-default"
        >
          <UColorModeImage
            :light="`/assets/templates/${template.framework}/${template.title.toLowerCase()}-light.png`"
            :dark="`/assets/templates/${template.framework}/${template.title.toLowerCase()}-dark.png`"
            :alt="`Template ${template.title} screenshot`"
            width="654"
            height="368"
            loading="lazy"
            class="w-full sm:w-[340px] shrink-0 aspect-video object-cover object-top rounded-xl border border-default bg-muted/40"
          />

          <div class="flex flex-col gap-3 min-w-0">
            <h2 class="text-xl font-semibold tracking-tight text-highlighted">
              {{ template.title }}
            </h2>

            <p class="max-w-[520px] text-[15px] leading-relaxed text-muted text-pretty">
              {{ template.description }}
            </p>

            <ul class="flex flex-col gap-1.5">
              <li v-for="feature in template.features" :key="feature.title" class="flex items-center gap-2 text-[13px] text-toned">
                <UIcon :name="feature.icon" class="size-4 shrink-0 text-primary" />
                {{ feature.title }}
              </li>
            </ul>

            <div class="flex flex-wrap gap-2 mt-auto pt-2">
              <UButton
                v-for="link of template.links"
                :key="link.label"
                color="neutral"
                variant="outline"
                size="sm"
                v-bind="link"
              />

              <UDropdownMenu
                :items="template.open_links"
                :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-auto' }"
                :modal="false"
                class="group"
              >
                <UButton
                  color="neutral"
                  variant="outline"
                  size="sm"
                  icon="i-lucide-square-code"
                  :trailing-icon="appConfig.ui.icons.chevronDown"
                  label="Open on"
                  :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
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
                  size="sm"
                  icon="i-lucide-cloud"
                  :trailing-icon="appConfig.ui.icons.chevronDown"
                  label="Deploy to"
                  :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
                />
              </UDropdownMenu>
            </div>
          </div>
        </article>
      </div>
    </UContainer>
  </main>
</template>
