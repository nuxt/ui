<template>
  <div>
    <ULandingHero v-bind="page.hero" :ui="{ base: 'relative z-[1]' }" class="mb-[calc(var(--header-height)*2)]">
      <template #title>
        <span v-html="page.hero?.title" />
      </template>

      <template #description>
        <span v-html="page.hero?.description" />
      </template>

      <template #links>
        <UButton label="Get Started" icon="i-heroicons-rocket-launch" size="lg" to="/getting-started" />

        <UInput
          v-model="source"
          color="gray"
          readonly
          autocomplete="off"
          icon="i-heroicons-command-line"
          input-class="select-none"
          size="lg"
          :ui="{ base: 'disabled:cursor-default', icon: { trailing: { pointer: '' } } }"
        >
          <template #trailing>
            <UButton
              aria-label="Copy Code"
              :color="copied ? 'primary' : 'gray'"
              variant="link"
              size="2xs"
              :icon="copied ? 'i-heroicons-clipboard-document-check' : 'i-heroicons-clipboard-document'"
              @click="copy(source)"
            />
          </template>
        </UInput>
      </template>

      <ClientOnly>
        <HomeTetris />
      </ClientOnly>
    </ULandingHero>

    <ULandingSection v-for="(section, index) of page.sections" :key="index" v-bind="section">
      <template v-if="section.title" #title>
        <span v-html="section?.title" />
      </template>

      <template v-if="section.description" #description>
        <span v-html="section.description" />
      </template>

      <template #demo>
        <HomeDemo />
      </template>

      <template #features>
        <ULandingGrid class="lg:-mb-20 lg:auto-rows-[3rem]">
          <ULandingCard
            v-for="(feature, subIndex) of section.features"
            :key="subIndex"
            v-bind="feature"
            :ui="{
              background: 'dark:bg-gray-900/50 dark:lg:bg-gradient-to-b from-gray-700/50 to-gray-950/50',
              body: {
                base: 'flex-1',
                background: 'dark:bg-gray-800/50 dark:lg:bg-gray-900/50 backdrop-blur-lg'
              }
            }"
            class="flex flex-col"
          >
            <div v-if="feature.image">
              <UColorModeImage :light="`${feature.image}-light.svg`" :dark="`${feature.image}-dark.svg`" class="object-cover w-full" />
            </div>
          </ULandingCard>
        </ULandingGrid>
      </template>

      <template #categories>
        <UPageGrid class="lg:gap-16">
          <NuxtLink
            v-for="(category, subIndex) of section.categories"
            :key="subIndex"
            :to="category.to"
            class="hover:bg-gradient-to-b hover:from-gray-200/50 dark:hover:from-gray-800/50 rounded-lg"
          >
            <UColorModeImage :light="`${category.image}-light.svg`" :dark="`${category.image}-dark.svg`" class="object-cover w-full" />

            <div class="flex items-center justify-center gap-2 mt-1 mb-2">
              <span class="font-semibold text-lg">{{ category.label }}</span>

              <UBadge v-if="category.badge" :label="category.badge" variant="subtle" size="xs" />
            </div>
          </NuxtLink>
        </UPageGrid>
      </template>
    </ULandingSection>

    <ULandingSection class="!pt-0">
      <ULandingCTA
        align="left"
        card
        :ui="{
          background: 'dark:bg-gradient-to-b from-gray-800 to-gray-900',
          shadow: 'dark:shadow-2xl',
          body: {
            background: 'bg-gray-50/50 dark:bg-gray-900/50'
          },
          title: 'text-center lg:text-left',
          links: 'justify-center lg:justify-start'
        }"
      >
        <template #title>
          <span v-html="page.cta.title" />
        </template>

        <template #links>
          <UAvatarGroup :max="13" size="md" class="flex-wrap-reverse [&_span:first-child]:text-xs justify-center">
            <UTooltip
              v-for="(contributor, index) of module.contributors"
              :key="index"
              :text="contributor.username"
              class="rounded-full"
              :ui="{ background: 'bg-gray-50 dark:bg-gray-800/50' }"
              :popper="{ offsetDistance: 16 }"
            >
              <UAvatar
                :alt="contributor.username"
                :src="`https://github.com/${contributor.username}.png`"
                class="lg:hover:scale-125 lg:hover:ring-2 lg:hover:ring-primary-500 dark:lg:hover:ring-primary-400 transition-transform"
                size="md"
              >
                <NuxtLink :to="`https://github.com/${contributor.username}`" target="_blank" class="focus:outline-none" tabindex="-1">
                  <span class="absolute inset-0" aria-hidden="true" />
                </NuxtLink>
              </UAvatar>
            </UTooltip>
          </UAvatarGroup>
        </template>

        <div class="flex items-center justify-center gap-8 lg:gap-16">
          <NuxtLink class="text-center group" to="https://npmjs.org/package/@nuxthq/ui" target="_blank">
            <p class="text-6xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400">
              {{ formatNumber(module.stats.downloads) }}+
            </p>
            <p>downloads</p>
          </NuxtLink>

          <NuxtLink class="text-center group" to="https://github.com/nuxtlabs/ui" target="_blank">
            <p class="text-6xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400">
              {{ formatNumber(module.stats.stars) }}+
            </p>
            <p>stars</p>
          </NuxtLink>
        </div>
      </ULandingCTA>
    </ULandingSection>
  </div>
</template>

<script setup lang="ts">
import { pick } from 'lodash-es'

const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())
const { data: module } = await useFetch<{
  stats: {
    downloads: number
    stars: number
  }
  contributors: {
    username: string
  }[]
}>('https://api.nuxt.com/modules/nuxtlabs-ui', {
  transform: (module) => pick(module, ['stats', 'contributors'])
})

const source = ref('pnpm i -D @nuxthq/ui')

const { copy, copied } = useClipboard({ source })

useContentHead(page)

const formatNumber = function (num: number, fractionDigits = 0) {
  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(fractionDigits) + 'k' // convert to K for number from > 1000 < 1 million
  } else if (num > 1000000) {
    return (num / 1000000).toFixed(fractionDigits) + 'm' // convert to M for number from > 1 million
  } else {
    return String(num)
  }
}
</script>
