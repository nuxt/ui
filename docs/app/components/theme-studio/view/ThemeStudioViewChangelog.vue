<script setup lang="ts">
import { Markdown } from '@comark/vue'
import shiki from '@comark/vue/plugins/shiki'

// Replicates the official Nuxt UI Changelog template (nuxt-ui-templates/changelog)
// in a single self-contained preview: app.vue's split layout with the sticky
// intro panel + SkyBg on the left, and pages/index.vue's UChangelogVersions
// feed on the right. Release notes are inlined since the template fetches them
// from GitHub and renders them with Comark, neither of which is available here.

const appConfig = useAppConfig()
const studioIcons = useStudioIcons()

const introLinks = [{
  label: 'Documentation',
  icon: studioIcons.bookOpen,
  color: 'neutral' as const,
  variant: 'ghost' as const,
  size: 'md' as const
}, {
  label: 'GitHub',
  icon: studioIcons.github,
  color: 'neutral' as const,
  variant: 'ghost' as const,
  size: 'md' as const
}]

/**
 * Invented releases in the shape the template fetches from GitHub: a tag, a
 * date and a markdown body. The template renders that body with Comark, and so
 * does this, so the headings, code blocks, callouts and commit links all come
 * from the markdown rather than from hand-written prose markup.
 */
interface Release {
  tag: string
  title: string
  date: string
  body: string
}

const versions: Release[] = [{
  tag: 'v4.2.0',
  title: 'v4.2.0',
  date: '2026-06-18T10:00:00Z',
  body: `This release focuses on data display: a brand new component, smarter tables and a batch of theme refinements across the board.

## ✨ Highlights

### Changelog component

\`UChangelogVersions\` composes a release feed from a list, with a sticky indicator per version and the date pulled out into its own column on large screens.

\`\`\`vue [app/pages/changelog.vue]
<template>
  <UChangelogVersions :indicator-motion="false">
    <UChangelogVersion
      v-for="version in versions"
      :key="version.tag"
      :title="version.title"
      :date="version.date"
    />
  </UChangelogVersions>
</template>
\`\`\`

> [!TIP]
> Pass \`badge\` to move the version number into the indicator column and keep the date inline with the title.

## 🚀 Features

- **ChangelogVersions:** new component to compose release notes ([#6712](https://github.com/nuxt/ui/pull/6712)) ([a1b2c3d](https://github.com/nuxt/ui/commit/a1b2c3d))
- **Table:** add column pinning and row expansion ([#6698](https://github.com/nuxt/ui/pull/6698)) ([4f9e2b1](https://github.com/nuxt/ui/commit/4f9e2b1))
- **ColorPicker:** support custom swatch sizes ([#6704](https://github.com/nuxt/ui/pull/6704)) ([8c3d5a7](https://github.com/nuxt/ui/commit/8c3d5a7))
- **Slider:** expose a slot to render content next to the value ([#6689](https://github.com/nuxt/ui/pull/6689)) ([2e7f014](https://github.com/nuxt/ui/commit/2e7f014))

## 🐛 Bug Fixes

- **Modal:** prevent overlay flicker when nesting inside a drawer ([#6741](https://github.com/nuxt/ui/pull/6741)) ([b5a8c92](https://github.com/nuxt/ui/commit/b5a8c92))
- **Carousel:** respect reduced motion preferences during autoplay ([#6736](https://github.com/nuxt/ui/pull/6736)) ([d1f4e63](https://github.com/nuxt/ui/commit/d1f4e63))

## ❤️ Contributors

- Benjamin Canac ([@benjamincanac](https://github.com/benjamincanac))
- Romain Hamel ([@romhml](https://github.com/romhml))
- Sandro Circi ([@sandros94](https://github.com/sandros94))
- Maxim ([@hywax](https://github.com/hywax))`
}, {
  tag: 'v4.1.0',
  title: 'v4.1.0',
  date: '2026-05-06T09:30:00Z',
  body: `A quality-of-life release: better forms, better keyboard navigation and a handful of long-requested props.

## 🚀 Features

- **Form:** nested field support with dot notation paths ([#6612](https://github.com/nuxt/ui/pull/6612)) ([7a2c8f5](https://github.com/nuxt/ui/commit/7a2c8f5))
- **CommandPalette:** new prop to render items lazily in large lists ([#6598](https://github.com/nuxt/ui/pull/6598)) ([c9b3e17](https://github.com/nuxt/ui/commit/c9b3e17))
- **Calendar:** allow custom day cells through a slot ([#6603](https://github.com/nuxt/ui/pull/6603)) ([f0d7a24](https://github.com/nuxt/ui/commit/f0d7a24))

## 🐛 Bug Fixes

- **ContentSearch:** keep focus within the panel when tabbing from the search input ([#6640](https://github.com/nuxt/ui/pull/6640)) ([3b8e5c1](https://github.com/nuxt/ui/commit/3b8e5c1))
- **Input:** fix RTL alignment of trailing icons ([#6631](https://github.com/nuxt/ui/pull/6631)) ([9e4a7d2](https://github.com/nuxt/ui/commit/9e4a7d2))
- **Toast:** avoid duplicate announcements of titles by screen readers ([#6627](https://github.com/nuxt/ui/pull/6627)) ([6c1f938](https://github.com/nuxt/ui/commit/6c1f938))

## ❤️ Contributors

- Benjamin Canac ([@benjamincanac](https://github.com/benjamincanac))
- Neil Richter ([@noook](https://github.com/noook))
- Gennadiy ([@genu](https://github.com/genu))`
}, {
  tag: 'v4.0.1',
  title: 'v4.0.1',
  date: '2026-04-02T16:15:00Z',
  body: `A small patch following the v4 launch, addressing the most reported issues from the first week.

## 🐛 Bug Fixes

- Restore auto-import of prose components in docs projects ([#6521](https://github.com/nuxt/ui/pull/6521)) ([e2d9b40](https://github.com/nuxt/ui/commit/e2d9b40))
- **Skeleton:** fix hydration mismatch when used with SSR color mode ([#6517](https://github.com/nuxt/ui/pull/6517)) ([a7c3f81](https://github.com/nuxt/ui/commit/a7c3f81))
- **Button:** correct padding of the compact size ([#6509](https://github.com/nuxt/ui/pull/6509)) ([5f8e2a6](https://github.com/nuxt/ui/commit/5f8e2a6))

## ❤️ Contributors

- Benjamin Canac ([@benjamincanac](https://github.com/benjamincanac))
- Daniel Roe ([@danielroe](https://github.com/danielroe))`
}, {
  tag: 'v4.0.0',
  title: 'v4.0.0',
  date: '2026-03-24T14:00:00Z',
  body: `Nuxt UI v4 unifies Nuxt UI and Nuxt UI Pro into a single free and open source library: 110+ components, Tailwind CSS v4, and a brand new theming system built on design tokens.

## ✨ Highlights

Every Pro component is now free and open source, dashboard and page sections included. Colors are semantic aliases with light and dark values generated from your palette, so a theme is a handful of tokens rather than a config file.

\`\`\`ts [app.config.ts]
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    }
  }
})
\`\`\`

> [!NOTE]
> Vue projects without Nuxt are supported through the dedicated Vite plugin, with the same components and the same theming.

## 🚀 Features

- All Pro components are now free and open source ([#6301](https://github.com/nuxt/ui/pull/6301)) ([1a4f7e9](https://github.com/nuxt/ui/commit/1a4f7e9))
- **theme:** semantic color aliases with light and dark values ([#6288](https://github.com/nuxt/ui/pull/6288)) ([8d2b6c3](https://github.com/nuxt/ui/commit/8d2b6c3))
- **ui:** per-slot overrides on the rewritten Tailwind Variants theming ([#6294](https://github.com/nuxt/ui/pull/6294)) ([c7e0f52](https://github.com/nuxt/ui/commit/c7e0f52))

## 🔥 Performances

- Drop the runtime config file in favour of CSS-first configuration ([#6310](https://github.com/nuxt/ui/pull/6310)) ([b3a9d18](https://github.com/nuxt/ui/commit/b3a9d18))

## ❤️ Contributors

- Benjamin Canac ([@benjamincanac](https://github.com/benjamincanac))
- Romain Hamel ([@romhml](https://github.com/romhml))
- Sébastien Chopin ([@atinux](https://github.com/atinux))
- Sylvain Marroufin ([@smarroufin](https://github.com/smarroufin))
- Neil Richter ([@noook](https://github.com/noook))`
}]

// Inline replica of the template's SkyBg component: twinkling primary stars
// scattered across the sticky intro panel.
interface Star {
  x: number
  y: number
  size: number
  delay: number
}

const stars = ref<Star[]>([])

onMounted(() => {
  stars.value = Array.from({ length: 50 }, () => ({
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100),
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5
  }))
})
</script>

<template>
  <!-- The pane is the scroll container; the intro panel sticks to it on xl. The
       color mode button sits outside it, the way the template's is fixed. -->
  <div class="relative h-full">
    <!-- UColorModeButton renders the pack's moon/sun pair; the studio toolbar owns the real toggle. -->
    <UButton
      color="neutral"
      variant="ghost"
      aria-label="Color mode"
      class="absolute top-4 right-4 z-20"
    >
      <template #leading="{ ui }">
        <UIcon :name="appConfig.ui.icons.dark" :class="ui.leadingIcon({ class: 'hidden dark:inline-block' })" />
        <UIcon :name="appConfig.ui.icons.light" :class="ui.leadingIcon({ class: 'dark:hidden' })" />
      </template>
    </UButton>

    <div class="h-full overflow-y-auto bg-default">
      <div class="min-h-full xl:grid xl:grid-cols-2">
        <UPageSection
          title="Release Notes"
          description="Display GitHub release notes as a beautiful changelog for any repository with this Nuxt UI template."
          orientation="vertical"
          :links="introLinks"
          :ui="{
            root: 'border-b border-default xl:border-b-0 xl:sticky xl:top-0 xl:h-[calc(100dvh_-_var(--ui-header-height)_*_2_-_0.5rem)] overflow-hidden',
            container: 'h-full items-center justify-center',
            wrapper: 'flex flex-col',
            headline: 'mb-6',
            title: 'text-left text-4xl',
            description: 'text-left max-w-lg',
            links: 'gap-1 justify-start -ms-2.5'
          }"
        >
          <template #top>
            <!-- Template's SkyBg: twinkling primary stars. -->
            <div class="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
              <div
                v-for="(star, index) in stars"
                :key="index"
                class="star absolute rounded-full bg-primary"
                :style="{
                  'left': `${star.x}%`,
                  'top': `${star.y}%`,
                  'width': `${star.size}px`,
                  'height': `${star.size}px`,
                  'transform': 'translate(-50%, -50%)',
                  '--twinkle-delay': `${star.delay}s`
                }"
              />
            </div>

            <div class="absolute -right-1/2 z-[-1] rounded-full bg-primary blur-[300px] size-60 sm:size-100 transform -translate-y-1/2 top-1/2" />
          </template>

          <template #headline>
            <!-- Stand-in for the template's AppLogo wordmark. -->
            <div class="flex items-center gap-1.5">
              <UIcon name="i-simple-icons-nuxt" class="size-6 text-primary shrink-0" />
              <span class="text-xl font-bold"><span class="text-highlighted">Nuxt</span><span class="text-primary">UI</span></span>
            </div>
          </template>

          <template #default />
        </UPageSection>

        <section class="relative px-4 sm:px-6 xl:px-0 xl:-ms-30 xl:flex-1">
          <UChangelogVersions
            as="main"
            :indicator-motion="false"
            :ui="{
              root: 'py-16 sm:py-24 lg:py-32',
              indicator: 'inset-y-0'
            }"
          >
            <UChangelogVersion
              v-for="version in versions"
              :key="version.tag"
              :title="version.title"
              :date="version.date"
              :ui="{
                root: 'flex items-start',
                container: 'max-w-xl min-w-0',
                header: 'border-b border-default pb-4 mb-4',
                title: 'text-3xl',
                date: 'text-xs/9 text-highlighted font-mono',
                indicator: 'sticky top-0 pt-16 -mt-16 sm:pt-24 sm:-mt-24 lg:pt-32 lg:-mt-32'
              }"
            >
              <template #body>
                <Markdown :value="version.body" :plugins="[shiki()]" />
              </template>
            </UChangelogVersion>
          </UChangelogVersions>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.star {
  animation: changelog-twinkle 2s ease-in-out infinite;
  animation-delay: var(--twinkle-delay);
  will-change: opacity;
}

@keyframes changelog-twinkle {
  0%, 100% {
    opacity: 0.2;
  }

  50% {
    opacity: 1;
  }
}
</style>
