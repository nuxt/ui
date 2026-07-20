<script setup lang="ts">
// Replicates the official Nuxt UI Changelog template (nuxt-ui-templates/changelog)
// in a single self-contained preview: app.vue's split layout with the sticky
// intro panel + SkyBg on the left, and pages/index.vue's UChangelogVersions
// feed on the right. Release notes are inlined since the template fetches them
// from GitHub and renders them with Comark, neither of which is available here.

const extra = useStudioExtraIcons()

const introLinks = [{
  label: 'Documentation',
  icon: extra.bookOpen,
  variant: 'ghost' as const,
  size: 'md' as const
}, {
  label: 'GitHub',
  icon: extra.github,
  variant: 'ghost' as const,
  size: 'md' as const
}]

// Invented releases standing in for the template's GitHub release notes.
interface Release {
  tag: string
  title: string
  date: string
  intro: string
  sections: {
    title: string
    items: { text: string, code?: string }[]
  }[]
  contributors: string[]
}

const versions: Release[] = [{
  tag: 'v4.2.0',
  title: 'v4.2.0',
  date: '2026-06-18T10:00:00Z',
  intro: 'This release focuses on data display: a brand new component, smarter tables and a batch of theme refinements across the board.',
  sections: [{
    title: 'Features',
    items: [
      { code: 'ChangelogVersions', text: 'new component to compose release notes with sticky version indicators' },
      { code: 'Table', text: 'add column pinning and row expansion' },
      { code: 'ColorPicker', text: 'support custom swatch sizes' },
      { code: 'Slider', text: 'expose a slot to render content next to the value' }
    ]
  }, {
    title: 'Bug fixes',
    items: [
      { code: 'Modal', text: 'prevent overlay flicker when nesting inside a drawer' },
      { code: 'Carousel', text: 'respect reduced motion preferences during autoplay' }
    ]
  }],
  contributors: ['benjamincanac', 'romhml', 'sandros94', 'hywax']
}, {
  tag: 'v4.1.0',
  title: 'v4.1.0',
  date: '2026-05-06T09:30:00Z',
  intro: 'A quality-of-life release: better forms, better keyboard navigation and a handful of long-requested props.',
  sections: [{
    title: 'Features',
    items: [
      { code: 'Form', text: 'nested field support with dot notation paths' },
      { code: 'CommandPalette', text: 'new prop to render items lazily in large lists' },
      { code: 'Calendar', text: 'allow custom day cells through a slot' }
    ]
  }, {
    title: 'Bug fixes',
    items: [
      { code: 'ContentSearch', text: 'keep focus within the panel when tabbing from the search input' },
      { code: 'Input', text: 'fix RTL alignment of trailing icons' },
      { code: 'Toast', text: 'avoid duplicate announcements of titles by screen readers' }
    ]
  }],
  contributors: ['benjamincanac', 'noook', 'genu']
}, {
  tag: 'v4.0.1',
  title: 'v4.0.1',
  date: '2026-04-02T16:15:00Z',
  intro: 'A small patch following the v4 launch, addressing the most reported issues from the first week.',
  sections: [{
    title: 'Bug fixes',
    items: [
      { text: 'Restore auto-import of prose components in docs projects' },
      { code: 'Skeleton', text: 'fix hydration mismatch when used with SSR color mode' },
      { code: 'Button', text: 'correct padding of the compact size' }
    ]
  }],
  contributors: ['benjamincanac', 'danielroe']
}, {
  tag: 'v4.0.0',
  title: 'v4.0.0',
  date: '2026-03-24T14:00:00Z',
  intro: 'Nuxt UI v4 unifies Nuxt UI and Nuxt UI Pro into a single free and open source library: 110+ components, Tailwind CSS v4, and a brand new theming system built on design tokens.',
  sections: [{
    title: 'Highlights',
    items: [
      { text: 'All Pro components are now free and open source: dashboard, page sections, chat and more' },
      { text: 'Semantic color aliases with light and dark values generated from your palette' },
      { code: 'ui', text: 'prop enables per-slot overrides on the rewritten Tailwind Variants theming' },
      { text: 'First-class Vue support without Nuxt through the dedicated Vite plugin' }
    ]
  }, {
    title: 'Breaking changes',
    items: [
      { code: 'Notification', text: 'renamed to Toast with a unified API' },
      { text: 'Dropped Tailwind CSS v3 support, the config file is replaced by CSS-first configuration' }
    ]
  }],
  contributors: ['benjamincanac', 'romhml', 'atinux', 'smarroufin', 'noook']
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
  <!-- The pane is the scroll container; the intro panel sticks to it on xl. -->
  <div class="h-full overflow-y-auto bg-default">
    <div class="min-h-full xl:grid xl:grid-cols-2">
      <UPageSection
        title="Changelog"
        description="Display GitHub release notes as a beautiful changelog for any repository with this Nuxt UI template."
        orientation="vertical"
        :links="introLinks"
        :ui="{
          root: 'border-b border-default xl:border-b-0 xl:sticky xl:top-0 xl:h-svh overflow-hidden',
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
          <div class="flex items-center gap-1.5 text-highlighted">
            <UIcon name="i-simple-icons-nuxt" class="size-6 text-primary shrink-0" />
            <span class="text-xl font-bold">Nuxt UI</span>
          </div>
        </template>

        <template #default />
      </UPageSection>

      <section class="relative px-4 sm:px-6 xl:px-0 xl:-ms-30 xl:flex-1">
        <UButton
          icon="i-lucide-sun-moon"
          aria-label="Color mode"
          color="neutral"
          variant="ghost"
          class="absolute top-4 right-4 z-10"
        />

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
              header: 'border-b border-default pb-4',
              title: 'text-3xl',
              date: 'text-xs/9 text-highlighted font-mono',
              indicator: 'sticky top-0 pt-16 -mt-16 sm:pt-24 sm:-mt-24 lg:pt-32 lg:-mt-32'
            }"
          >
            <template #body>
              <!-- The template renders release markdown with Comark; this
              preview inlines the notes as plain prose markup instead. -->
              <div class="text-base text-muted space-y-6">
                <p>{{ version.intro }}</p>

                <div v-for="section in version.sections" :key="section.title" class="space-y-3">
                  <h3 class="text-lg font-semibold text-highlighted">
                    {{ section.title }}
                  </h3>

                  <ul class="list-disc ps-5 space-y-1.5 marker:text-dimmed">
                    <li v-for="(item, index) in section.items" :key="index" class="wrap-break-word">
                      <template v-if="item.code">
                        <code class="px-1.5 py-0.5 font-mono text-sm font-medium rounded-md bg-elevated text-highlighted border border-default">{{ item.code }}</code>{{ ' ' }}
                      </template>{{ item.text }}
                    </li>
                  </ul>
                </div>

                <div class="space-y-3">
                  <h3 class="text-lg font-semibold text-highlighted">
                    Contributors
                  </h3>

                  <UAvatarGroup size="md" :max="5">
                    <UAvatar
                      v-for="contributor in version.contributors"
                      :key="contributor"
                      :src="`https://github.com/${contributor}.png`"
                      :alt="contributor"
                    />
                  </UAvatarGroup>
                </div>
              </div>
            </template>
          </UChangelogVersion>
        </UChangelogVersions>
      </section>
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
