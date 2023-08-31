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
              :icon="copied ? 'i-heroicons-clipboard-document-check' : 'i-heroicons-clipboard'"
              @click="copy(source)"
            />
          </template>
        </UInput>
      </template>

      <ClientOnly>
        <Tetris class="top-[-1px]" />
      </ClientOnly>
    </ULandingHero>

    <ULandingSection v-for="(section, index) of page.sections" :key="index" v-bind="section">
      <template #title>
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
          >
            <img :src="category.image" class="object-cover w-full">

            <div class="flex items-center justify-center gap-2 mt-2">
              <span class="font-semibold text-lg">{{ category.label }}</span>

              <UBadge v-if="category.badge" :label="category.badge" variant="subtle" size="xs" />
            </div>
          </NuxtLink>
        </UPageGrid>
      </template>
    </ULandingSection>
  </div>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())

const source = ref('pnpm i -D @nuxthq/ui')

const { copy, copied } = useClipboard({ source })

useContentHead(page)
</script>
