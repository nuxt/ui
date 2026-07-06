<script setup lang="ts">
import type { AccordionItem, NavigationMenuItem } from '@nuxt/ui'

const navItems: NavigationMenuItem[] = [
  { label: 'Features' },
  { label: 'Metrics' },
  { label: 'FAQ' }
]

type TerminalSegment = {
  text: string
  class?: string
}

const terminalLines: TerminalSegment[][] = [
  [
    { text: '$ ', class: 'text-dimmed' },
    { text: 'npx telemetry', class: 'text-highlighted' },
    { text: ' init', class: 'text-primary' }
  ],
  [{ text: '→ Scanning service topology...', class: 'text-dimmed' }],
  [
    { text: '→ Found ', class: 'text-dimmed' },
    { text: '23 services', class: 'text-highlighted' },
    { text: ', ', class: 'text-dimmed' },
    { text: '847 endpoints', class: 'text-highlighted' },
    { text: ', ', class: 'text-dimmed' },
    { text: '12 databases', class: 'text-highlighted' }
  ],
  [
    { text: '→ Deploying collector agents ', class: 'text-dimmed' },
    { text: '✓', class: 'text-success' }
  ],
  [
    { text: '→ Baseline established in ', class: 'text-dimmed' },
    { text: '340ms', class: 'text-success' }
  ],
  [
    { text: '✓ Live at ', class: 'text-success' },
    { text: 'https://app.example.com/acme-corp', class: 'text-primary underline underline-offset-2' }
  ]
]

const logos = [
  'i-lucide-triangle',
  'i-lucide-github',
  'i-lucide-pentagon',
  'i-lucide-zap',
  'i-lucide-aperture'
]

const features = [{
  icon: 'i-lucide-zap',
  title: 'Predictive Alerts',
  description: 'Models trained on your own baselines flag anomalies minutes before they reach your SLOs.'
}, {
  icon: 'i-lucide-radar',
  title: 'Topology Mapping',
  description: 'Service dependencies discovered with zero config, so you see how one deploy ripples through checkout.'
}, {
  icon: 'i-lucide-layers',
  title: 'Unified Telemetry',
  description: 'Logs, metrics and traces share one query language. Stop context-switching, start correlating.'
}, {
  icon: 'i-lucide-git-commit-horizontal',
  title: 'Deploy Tracking',
  description: 'Every deploy is correlated with performance changes, so you know which commit caused the regression.'
}, {
  icon: 'i-lucide-filter',
  title: 'Smart Sampling',
  description: 'Interesting traces are retained and noise is dropped, cutting storage costs without losing signal.'
}, {
  icon: 'i-lucide-notebook-pen',
  title: 'Team Notebooks',
  description: 'Collaborative investigation notebooks turn incident debugging into reusable runbooks.'
}]

const metrics = [
  { value: '99.99%', label: 'Uptime SLA', class: 'text-success' },
  { value: '<50ms', label: 'P99 query', class: 'text-primary' },
  { value: '14B+', label: 'Events / day', class: 'text-info' },
  { value: '4 min', label: 'Early warning', class: 'text-warning' }
]

const faqItems: AccordionItem[] = [{
  label: 'How long does setup take?',
  content: 'Most teams are live in under five minutes. Run the init command, and the collector discovers your services, endpoints and databases automatically — no manual instrumentation required.'
}, {
  label: 'Do I need to change my code?',
  content: 'No. The collector attaches at the infrastructure layer and works with OpenTelemetry out of the box. If you already emit traces, we ingest them as-is.'
}, {
  label: 'What does it cost at scale?',
  content: 'Pricing is based on retained events after sampling, not raw ingest. Smart sampling keeps the interesting traces and drops the noise, so most teams pay for a fraction of their raw volume.'
}, {
  label: 'Can I self-host the platform?',
  content: 'Yes. The full platform ships as a Helm chart for Kubernetes, with the same feature set as the cloud version and no phone-home requirements.'
}, {
  label: 'Is there a free tier?',
  content: 'Free for up to 5 services with 7-day retention — no credit card required. Upgrade only when you need longer retention or more services.'
}]

const footerLinks = ['Docs', 'GitHub', 'Twitter', 'Status', 'Privacy']
</script>

<template>
  <div class="h-full overflow-y-auto bg-default">
    <!-- Header -->
    <header class="sticky top-0 z-10 border-b-[length:var(--studio-border-width,1px)] border-default bg-default/75 backdrop-blur">
      <div class="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
        <div class="flex items-center gap-1.5">
          <UIcon name="i-lucide-activity" class="size-5 text-primary shrink-0" />
          <span class="text-base font-bold text-highlighted">Telemetry</span>
        </div>

        <UNavigationMenu :items="navItems" variant="link" class="hidden sm:flex" />

        <div class="flex items-center gap-1.5">
          <UButton label="Sign in" color="neutral" variant="ghost" class="hidden sm:inline-flex" />
          <UButton label="Get started" color="neutral" />
        </div>
      </div>
    </header>

    <!-- Hero -->
    <UPageHero
      title="Observe less. Understand more."
      description="Map your entire system in real-time, surface anomalies before they cascade, and eliminate the dashboards you never needed."
      :ui="{
        container: 'py-16 sm:py-24 lg:py-24 gap-8 sm:gap-12',
        title: 'tracking-tighter',
        links: 'gap-3'
      }"
    >
      <template #headline>
        <UBadge
          label="v2.0 — Now with predictive alerting"
          color="neutral"
          variant="soft"
          class="rounded-full px-3 py-1.5 gap-1.5"
        >
          <template #leading>
            <UChip inset standalone :ui="{ base: 'animate-pulse ring-0' }" />
          </template>
        </UBadge>
      </template>

      <template #links>
        <UButton label="Start for free" size="xl" />
        <UButton label="View demo" color="neutral" variant="soft" size="xl" />
      </template>

      <div class="max-w-2xl mx-auto w-full">
        <div class="rounded-xl border-[length:var(--studio-border-width,1px)] border-default bg-elevated/50 overflow-hidden font-mono text-xs sm:text-sm">
          <div class="flex items-center gap-1.5 border-b-[length:var(--studio-border-width,1px)] border-default px-4 py-2.5">
            <span class="size-2.5 rounded-full bg-error/60" />
            <span class="size-2.5 rounded-full bg-warning/60" />
            <span class="size-2.5 rounded-full bg-success/60" />
            <span class="ms-2 text-dimmed text-xs">terminal</span>
          </div>

          <div class="flex flex-col gap-1.5 p-4 text-start">
            <p v-for="(line, index) in terminalLines" :key="index" class="truncate">
              <span v-for="(segment, segmentIndex) in line" :key="segmentIndex" :class="segment.class">{{ segment.text }}</span>
            </p>
          </div>
        </div>
      </div>

      <UPageLogos
        title="Trusted by engineering teams at"
        :items="logos"
        class="max-w-lg mx-auto w-full"
        :ui="{
          title: 'font-mono uppercase text-xs tracking-widest text-dimmed',
          logo: 'text-muted size-6'
        }"
      />
    </UPageHero>

    <!-- Features -->
    <UPageSection
      headline="Capabilities"
      title="Every signal, one surface."
      description="No more tab-switching between metrics, traces, and logs. Correlate everything into a single explorable topology."
      :ui="{
        root: 'py-16 sm:py-24',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-widest',
        description: 'text-dimmed'
      }"
    >
      <div class="rounded-2xl border-[length:var(--studio-border-width,1px)] border-default bg-default overflow-hidden">
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[var(--studio-border-width,1px)]">
          <UPageCard
            v-for="feature in features"
            :key="feature.title"
            :icon="feature.icon"
            :title="feature.title"
            :description="feature.description"
            class="rounded-none"
            :ui="{
              leading: 'mb-4 flex size-9 items-center justify-center rounded-lg bg-primary/10',
              title: 'text-sm tracking-tight',
              description: 'text-sm leading-relaxed text-dimmed'
            }"
          />
        </div>
      </div>
    </UPageSection>

    <!-- Metrics -->
    <UPageSection
      headline="By the numbers"
      title="Built for scale you haven't hit yet."
      description="Process billions of events per day across thousands of production environments."
      :ui="{
        root: 'py-16 sm:py-24',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-widest',
        description: 'text-dimmed'
      }"
    >
      <div class="rounded-2xl border-[length:var(--studio-border-width,1px)] border-default bg-default overflow-hidden">
        <div class="grid grid-cols-2 xl:grid-cols-4 gap-[var(--studio-border-width,1px)]">
          <UPageCard
            v-for="metric in metrics"
            :key="metric.label"
            :title="metric.value"
            :description="metric.label"
            class="rounded-none"
            :ui="{
              root: 'text-center',
              wrapper: 'items-center',
              title: ['text-3xl sm:text-4xl font-bold tracking-tight leading-none', metric.class],
              description: 'font-mono text-xs uppercase tracking-wide text-dimmed mt-3'
            }"
          />
        </div>
      </div>
    </UPageSection>

    <!-- FAQ -->
    <UPageSection
      headline="FAQ"
      title="Questions, answered."
      description="Everything you need to know before your first deploy."
      :ui="{
        root: 'py-16 sm:py-24',
        container: 'max-w-3xl',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-widest',
        description: 'text-dimmed'
      }"
    >
      <UAccordion
        :items="faqItems"
        default-value="0"
        :unmount-on-hide="false"
        :ui="{
          trigger: 'text-base text-highlighted',
          body: 'text-muted leading-relaxed'
        }"
      />
    </UPageSection>

    <!-- CTA -->
    <UPageCTA
      variant="naked"
      title="Ready to stop firefighting?"
      description="Free for up to 5 services. No credit card. Deploys in under a minute."
      :ui="{
        root: 'py-16 sm:py-24',
        container: 'max-w-3xl',
        title: 'tracking-tighter',
        description: 'text-dimmed'
      }"
    >
      <template #links>
        <div class="flex flex-col items-center gap-4">
          <UButton label="Start for free" size="xl" />

          <UButton
            label="npx telemetry init"
            trailing-icon="i-lucide-copy"
            color="neutral"
            variant="subtle"
            size="xl"
            class="font-mono font-light text-toned"
          />
        </div>
      </template>
    </UPageCTA>

    <!-- Footer -->
    <UFooter :ui="{ container: 'border-t-[length:var(--studio-border-width,1px)] border-default', right: 'gap-x-0 flex-wrap justify-end' }">
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
