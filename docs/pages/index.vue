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
        <Tetris class="top-[-1px]" />
      </ClientOnly>
    </ULandingHero>

    <ULandingSection>
      <URange :model-value="50" class="animate-bounce w-48" />

      <PaginationExampleBasic class="animate-bounce" />

      <UNotification :id="1" title="Heads up!" icon="i-heroicons-command-line" class="animate-bounce" />
    </ULandingSection>

    <ULandingSection v-for="(section, index) of page.sections" :key="index" v-bind="section">
      <template v-if="section.title" #title>
        <span v-html="section?.title" />
      </template>

      <template v-if="section.description" #description>
        <span v-html="section.description" />
      </template>

      <template #features>
        <UPageGrid class="xl:grid-cols-4">
          <ULandingCard v-for="(feature, subIndex) of section.features" :key="subIndex" v-bind="feature" />
        </UPageGrid>
      </template>

      <template #categories>
        <UPageGrid class="lg:gap-16">
          <NuxtLink
            v-for="(category, subIndex) of section.categories"
            :key="subIndex"
            :to="category.to"
            class="hover:bg-gradient-to-b hover:from-gray-300/50 dark:hover:from-gray-700/50 rounded-lg"
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

    <ULandingSection>
      <ULandingCTA panel align="left" :ui="{ background: 'dark:bg-gradient-to-b from-gray-800 to-gray-900 backdrop-blur-lg', inner: 'bg-gray-50/50 dark:bg-gray-900/50' }" class="ring-1 ring-gray-200 dark:ring-gray-800">
        <template #title>
          <span v-html="page.cta.title" />
        </template>

        <template #description>
          <UAvatarGroup :max="10" size="sm" class="justify-end [&_span:first-child]:text-xs">
            <UAvatar
              v-for="(contributor, index) of module.contributors"
              :key="index"
              :alt="contributor.username"
              :src="`https://github.com/${contributor.username}.png`"
              class="lg:hover:scale-110 lg:hover:ring-primary-500 dark:lg:hover:ring-primary-400 transition-transform"
            >
              <NuxtLink :to="`https://github.com/${contributor.username}`" target="_blank" class="focus:outline-none" tabindex="-1">
                <span class="absolute inset-0" aria-hidden="true" />
              </NuxtLink>
            </UAvatar>
          </UAvatarGroup>
        </template>

        <div class="flex items-center justify-center gap-16">
          <NuxtLink class="text-center" :to="`https://npmjs.org/package/${module.npm}`" target="_blank">
            <p class="text-6xl font-semibold text-gray-900 dark:text-white">
              {{ formatNumber(module.stats.downloads) }}+
            </p>
            <p>downloads</p>
          </NuxtLink>

          <NuxtLink class="text-center" :to="`https://github.com/${module.repo}`" target="_blank">
            <p class="text-6xl font-semibold text-gray-900 dark:text-white">
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
const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())
const { data: module } = await useLazyFetch('https://api.nuxt.com/modules/nuxtlabs-ui')

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
