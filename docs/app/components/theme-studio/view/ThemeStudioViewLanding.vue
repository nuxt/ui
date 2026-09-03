<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const appConfig = useAppConfig()
const studioIcons = useStudioIcons()

/** Shared rhythm for the centered content sections. */
const sectionUi = {
  root: 'py-24 sm:py-32',
  container: 'max-w-5xl',
  headline: 'text-center font-mono font-medium text-xs text-primary uppercase tracking-[0.12em]',
  title: 'max-w-lg mx-auto',
  description: 'max-w-md mx-auto text-dimmed'
}

const navItems: NavigationMenuItem[] = [
  { label: 'Features' },
  { label: 'Metrics' }
]

type TerminalSegment = {
  text: string
  class?: string
}

const terminalLines: TerminalSegment[][] = [
  [
    { text: '$ ', class: 'text-muted' },
    { text: 'npx telemetry', class: 'text-highlighted' },
    { text: ' init', class: 'text-primary' }
  ],
  [{ text: '→ Scanning service topology...', class: 'text-muted' }],
  [
    { text: '→ Found ', class: 'text-muted' },
    { text: '23 services', class: 'text-highlighted' },
    { text: ', ', class: 'text-muted' },
    { text: '847 endpoints', class: 'text-highlighted' },
    { text: ', ', class: 'text-muted' },
    { text: '12 databases', class: 'text-highlighted' }
  ],
  [
    { text: '→ Deploying collector agents ', class: 'text-muted' },
    { text: '✓', class: 'text-success' }
  ],
  [
    { text: '→ Baseline established in ', class: 'text-muted' },
    { text: '340ms', class: 'text-primary' }
  ],
  [{ text: ' ' }],
  [
    { text: '✓ Live at ', class: 'text-success' },
    { text: 'https://app.example.com/acme-corp', class: 'text-info' }
  ]
]

const logos = [
  'i-simple-icons-vercel',
  studioIcons.github,
  'i-simple-icons-linear',
  'i-simple-icons-supabase',
  'i-simple-icons-stripe'
]

const features = [{
  icon: studioIcons.zap,
  title: 'Predictive Alerts',
  description: 'ML models trained on your baselines detect anomalies 4 minutes before they hit your SLOs.'
}, {
  icon: 'i-lucide-radar',
  title: 'Topology Mapping',
  description: 'Auto-discovers service dependencies with zero config. See how a deploy in auth-service ripples through checkout.'
}, {
  icon: 'i-lucide-layers',
  title: 'Unified Telemetry',
  description: 'Logs, metrics, and traces in one query language. Stop context-switching. Start correlating.'
}, {
  icon: 'i-lucide-git-commit-horizontal',
  title: 'Deploy Tracking',
  description: 'Every deploy is automatically correlated with performance changes. Know which commit caused the regression.'
}, {
  icon: studioIcons.filter,
  title: 'Smart Sampling',
  description: 'AI-driven sampling retains interesting traces and drops noise. Cut storage costs 10× without losing signal.'
}, {
  icon: 'i-lucide-notebook-pen',
  title: 'Team Notebooks',
  description: 'Collaborative investigation notebooks that turn incident debugging into reusable runbooks.'
}]

const metrics = [
  { value: '99.99%', label: 'Uptime SLA', class: 'text-success' },
  { value: '<50ms', label: 'P99 query', class: 'text-primary' },
  { value: '14B+', label: 'Events / day', class: 'text-info' },
  { value: '4 min', label: 'Early warning', class: 'text-warning' }
]

const footerLinks = ['Docs', 'GitHub', 'Twitter', 'Status', 'Privacy']

const { copy: copyCommand, copied } = useClipboard()

/** Fade-and-rise elements into view on scroll, like the template's `whileInView` motion. */
const vReveal = {
  mounted(el: HTMLElement & { _reveal?: IntersectionObserver }, binding: { value?: number }) {
    el.classList.add('landing-reveal')
    if (binding.value) {
      el.style.transitionDelay = `${binding.value}ms`
    }

    el._reveal = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        el.classList.add('landing-revealed')
        el._reveal?.disconnect()
      }
    }, { threshold: 0.3 })
    el._reveal.observe(el)
  },
  // below-the-fold elements never intersect when the user switches views,
  // without this their observers outlive the DOM
  unmounted(el: HTMLElement & { _reveal?: IntersectionObserver }) {
    el._reveal?.disconnect()
  }
}
</script>

<template>
  <div class="h-full overflow-y-auto bg-default">
    <!-- Header -->
    <header class="sticky top-0 z-10 border-b border-default bg-default/75 backdrop-blur rounded-t-[inherit]">
      <div class="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
        <div class="flex items-center gap-1.5 sm:flex-1">
          <UIcon name="i-lucide-activity" class="size-5 text-primary shrink-0" />
          <span class="text-base font-bold text-highlighted">Telemetry</span>
        </div>

        <UNavigationMenu :items="navItems" variant="link" class="hidden sm:flex" />

        <div class="flex items-center justify-end gap-1.5 sm:flex-1">
          <UButton label="Sign in" color="neutral" variant="ghost" class="hidden sm:inline-flex" />
          <UButton label="Get started" color="neutral" />
        </div>
      </div>
    </header>

    <!-- Hero -->
    <UPageHero
      :ui="{
        container: 'relative z-10 py-16 sm:py-24 lg:py-32 gap-12 sm:gap-16',
        wrapper: 'flex flex-col items-center',
        title: 'sm:text-6xl lg:text-7xl tracking-tighter leading-[1.05]',
        description: 'mt-5 max-w-xl mx-auto text-base sm:text-lg leading-relaxed text-default',
        links: 'gap-3'
      }"
    >
      <template #top>
        <div class="landing-pixels absolute inset-x-0 top-0 h-full opacity-15" aria-hidden="true" />
        <div class="landing-glow absolute top-0 left-1/2 h-1/2 w-2/3 -translate-x-1/2" aria-hidden="true" />
      </template>

      <template #headline>
        <div class="landing-enter" style="animation-delay: 200ms">
          <UBadge
            label="v2.0, Now with predictive alerting"
            color="neutral"
            variant="soft"
            class="rounded-full px-3 py-1.5 gap-1.5 bg-inverted/5 backdrop-blur"
          >
            <template #leading>
              <UChip inset standalone :ui="{ base: 'animate-pulse ring-0' }" />
            </template>
          </UBadge>
        </div>
      </template>

      <template #title>
        <span class="landing-enter inline-block" style="animation-delay: 350ms">
          Observe less.
          <br>
          <span class="landing-shimmer bg-clip-text text-transparent">Understand more.</span>
        </span>
      </template>

      <template #description>
        <span class="landing-enter inline-block" style="animation-delay: 500ms">
          Map your entire system in real-time, surface anomalies before they cascade, and eliminate the dashboards you never needed.
        </span>
      </template>

      <template #links>
        <div class="landing-enter flex flex-wrap justify-center gap-3" style="animation-delay: 650ms">
          <UButton label="Start for free" variant="solid" size="xl" class="landing-btn-glow" />
          <UButton label="View demo" color="neutral" variant="soft" size="xl" />
        </div>
      </template>

      <div class="landing-enter max-w-2xl mx-auto w-full" style="animation-delay: 850ms">
        <div class="rounded-xl border border-default bg-elevated/50 backdrop-blur overflow-hidden">
          <div class="flex items-center gap-1.5 border-b border-default p-4 sm:px-6">
            <span class="size-2.5 rounded-full border border-default bg-muted" />
            <span class="size-2.5 rounded-full border border-default bg-muted" />
            <span class="size-2.5 rounded-full border border-default bg-muted" />
          </div>

          <div class="min-h-[200px] p-5 sm:p-6 font-mono text-[13px] leading-[1.8] text-start">
            <p
              v-for="(line, index) in terminalLines"
              :key="index"
              class="landing-terminal-line truncate"
              :style="{ animationDelay: `${1400 + index * 400}ms` }"
            >
              <span v-for="(segment, segmentIndex) in line" :key="segmentIndex" :class="segment.class">{{ segment.text }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="landing-enter max-w-lg mx-auto w-full" style="animation-delay: 950ms">
        <UPageLogos
          title="Trusted by engineering teams at"
          :items="logos"
          :ui="{
            title: 'font-mono uppercase text-xs tracking-[0.12em] text-dimmed',
            logo: 'text-muted size-6'
          }"
        />
      </div>
    </UPageHero>

    <!-- Features -->
    <UPageSection
      :ui="sectionUi"
    >
      <template #headline>
        <span v-reveal class="inline-block">Capabilities</span>
      </template>

      <template #title>
        <span v-reveal="100" class="inline-block">Every signal, one surface.</span>
      </template>

      <template #description>
        <span v-reveal="200" class="inline-block">No more tab-switching between metrics, traces, and logs. Correlate everything into a single explorable topology.</span>
      </template>

      <div class="rounded-2xl border border-default bg-default overflow-hidden">
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px">
          <UPageCard
            v-for="(feature, index) in features"
            :key="feature.title"
            v-reveal="index * 80"
            :icon="feature.icon"
            :title="feature.title"
            :description="feature.description"
            class="rounded-none duration-300 hover:bg-elevated/50"
            :ui="{
              leading: 'mb-5 flex size-9 items-center justify-center rounded-lg bg-primary/10',
              title: 'text-sm tracking-tight',
              description: 'text-sm leading-relaxed text-dimmed'
            }"
          />
        </div>
      </div>
    </UPageSection>

    <!-- Metrics -->
    <UPageSection
      :ui="sectionUi"
    >
      <template #headline>
        <span v-reveal class="inline-block">By the numbers</span>
      </template>

      <template #title>
        <span v-reveal="100" class="inline-block">Built for scale you haven't hit yet.</span>
      </template>

      <template #description>
        <span v-reveal="200" class="inline-block">Process billions of events per day across thousands of production environments with an architecture designed for the workloads of 2030.</span>
      </template>

      <div class="rounded-2xl border border-default bg-default overflow-hidden">
        <div class="grid grid-cols-2 xl:grid-cols-4 gap-px">
          <UPageCard
            v-for="(metric, index) in metrics"
            :key="metric.label"
            v-reveal="index * 80"
            :title="metric.value"
            :description="metric.label"
            class="rounded-none duration-300 hover:bg-elevated/50"
            :ui="{
              root: 'text-center',
              wrapper: 'items-center',
              title: ['text-3xl sm:text-4xl font-bold tracking-tight leading-none', metric.class],
              description: 'font-mono text-xs uppercase tracking-[0.06em] text-dimmed mt-3'
            }"
          />
        </div>
      </div>
    </UPageSection>

    <!-- CTA -->
    <UPageCTA
      variant="naked"
      :ui="{
        root: 'py-24 sm:py-32',
        container: 'max-w-3xl text-center',
        title: 'lg:text-5xl tracking-tighter',
        description: 'mx-auto max-w-sm leading-relaxed text-dimmed'
      }"
    >
      <template #top>
        <div class="landing-glow absolute bottom-0 left-1/2 h-1/2 w-2/3 -translate-x-1/2" aria-hidden="true" />
      </template>

      <template #title>
        <span v-reveal class="inline-block">Ready to stop<br>firefighting?</span>
      </template>

      <template #description>
        <span v-reveal="100" class="inline-block">Free for up to 5 services. No credit card. Deploys in under a minute.</span>
      </template>

      <template #links>
        <div v-reveal="200" class="flex flex-col items-center justify-center gap-6">
          <UButton label="Start for free" variant="solid" size="xl" class="landing-btn-glow" />

          <UButton
            label="npx telemetry init"
            :trailing-icon="copied ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy"
            color="neutral"
            variant="subtle"
            size="xl"
            class="font-mono font-light text-toned gap-4"
            :ui="{ trailingIcon: 'size-5' }"
            @click="copyCommand('npx telemetry init')"
          />
        </div>
      </template>
    </UPageCTA>

    <!-- Footer -->
    <UFooter :ui="{ container: 'border-t border-default lg:py-8', right: 'gap-x-0 flex-wrap justify-end' }">
      <template #left>
        <p class="text-sm text-dimmed">
          Built with Nuxt UI • © 2026
        </p>
      </template>

      <template #right>
        <UButton
          v-for="link in footerLinks"
          :key="link"
          :label="link"
          color="neutral"
          variant="link"
          size="sm"
          class="font-light"
        />
      </template>
    </UFooter>
  </div>
</template>

<style scoped>
/* Pixelated plasma backdrop, CSS stand-in for the template's HeroShaders (Plasma + Pixelate). */
.landing-pixels {
  pointer-events: none;
  background-image:
    radial-gradient(ellipse 80% 55% at 50% 0%, var(--ui-primary), transparent 70%),
    radial-gradient(ellipse 45% 45% at 12% 18%, var(--ui-primary), transparent 70%),
    radial-gradient(ellipse 45% 45% at 88% 28%, var(--ui-primary), transparent 70%);
  mask-image:
    repeating-linear-gradient(0deg, black 0 9px, transparent 9px 13px),
    repeating-linear-gradient(90deg, black 0 9px, transparent 9px 13px),
    linear-gradient(to bottom, black 20%, transparent 95%);
  mask-composite: intersect;
  animation: landing-plasma 16s ease-in-out infinite alternate;
}

@keyframes landing-plasma {
  0% {
    background-position: 0 0, 0 0, 0 0;
  }
  100% {
    background-position: 0 2rem, 3rem 1rem, -3rem 2rem;
  }
}

/* Radial primary glow, port of the template's GradientGlow component. */
.landing-glow {
  pointer-events: none;
  background: radial-gradient(ellipse at center, color-mix(in oklch, var(--ui-primary) 6%, transparent) 0%, transparent 70%);
}

/* Shimmering gradient text on the hero title's second line: primary against a
   lighter shade of itself. Mixed off --ui-primary rather than ramp stops:
   black-as-primary has no ramp, and the stops keep painting the last palette.
   Dark mixes toward black instead, where the primary may itself be white. */
.landing-shimmer {
  background-image: linear-gradient(135deg, var(--ui-primary), color-mix(in oklch, var(--ui-primary) 65%, black), var(--ui-primary), color-mix(in oklch, var(--ui-primary) 65%, black), var(--ui-primary));
  background-size: 200% auto;
  animation: landing-shimmer 10s ease-in-out infinite alternate;
}

.dark .landing-shimmer {
  background-image: linear-gradient(135deg, var(--ui-primary), color-mix(in oklch, var(--ui-primary) 65%, white), var(--ui-primary), color-mix(in oklch, var(--ui-primary) 65%, white), var(--ui-primary));
}

@keyframes landing-shimmer {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
}

/* Glowing primary buttons, port of the template's app.config button compoundVariant. */
.landing-btn-glow {
  box-shadow: 0 0 20px color-mix(in oklch, var(--ui-primary) 25%, transparent);
  transition: all 0.2s;
}

.landing-btn-glow:hover {
  box-shadow: 0 0 30px color-mix(in oklch, var(--ui-primary) 35%, transparent);
  transform: translateY(-1px);
}

.landing-btn-glow:active {
  transform: translateY(0);
}

/* Hero entrance, port of the template's enter motion (fade + rise, staggered). */
.landing-enter {
  /* backwards, not both: a retained transform (even identity) would form a
     backdrop root and blind children's backdrop-blur after the entrance */
  animation: landing-enter 0.6s ease backwards;
}

@keyframes landing-enter {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* Terminal lines type in one at a time. */
.landing-terminal-line {
  animation: landing-terminal-line 0.4s ease both;
}

@keyframes landing-terminal-line {
  from {
    opacity: 0;
    transform: translateX(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Scroll reveal, classes applied by the v-reveal directive. */
.landing-reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.landing-reveal.landing-revealed {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .landing-pixels,
  .landing-shimmer,
  .landing-enter,
  .landing-terminal-line {
    animation: none;
  }

  .landing-reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
