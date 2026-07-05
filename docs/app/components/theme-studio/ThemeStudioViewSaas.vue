<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const navItems: NavigationMenuItem[] = [
  { label: 'Docs', active: true },
  { label: 'Pricing' },
  { label: 'Blog' },
  { label: 'Changelog' }
]

const heroLinks = [{
  label: 'Get started',
  trailingIcon: 'i-lucide-arrow-right'
}, {
  label: 'Use this template',
  icon: 'i-lucide-github',
  color: 'neutral' as const,
  variant: 'subtle' as const
}]

const sections = [{
  title: 'Powered by Nuxt UI components',
  description: 'Access a complete component library with beautifully styled, accessible and customizable Vue components. Everything you need to build professional SaaS applications.',
  reverse: false,
  features: [{
    title: '100+ UI components',
    description: 'From buttons to modals, data tables to forms - all styled with Tailwind CSS and accessible out of the box.',
    icon: 'i-lucide-package'
  }, {
    title: 'Authentication ready',
    description: 'Pre-built login, signup and password reset flows. Just connect your backend and start onboarding users.',
    icon: 'i-lucide-shield'
  }, {
    title: 'TypeScript first',
    description: 'Full TypeScript support with auto-completion, type safety and IntelliSense for every component.',
    icon: 'i-lucide-code-xml'
  }]
}, {
  title: 'Built for modern SaaS',
  description: 'Everything you need to launch and scale. From beautiful marketing pages to complex dashboards, ship faster with production-ready patterns.',
  reverse: true,
  features: [{
    title: 'Edge performance',
    description: 'Optimized for Core Web Vitals with automatic code splitting, lazy loading and SSR/SSG support.',
    icon: 'i-lucide-zap'
  }, {
    title: 'Dark mode ready',
    description: 'Automatic theme switching with smooth transitions. Respects system preferences and remembers user choice.',
    icon: 'i-lucide-moon'
  }, {
    title: 'Global ready',
    description: 'Built-in i18n support for 50+ languages with RTL/LTR layouts and font optimization.',
    icon: 'i-lucide-globe'
  }]
}]

const features = [{
  title: 'Beautiful design system',
  description: 'Semantic color aliases, comprehensive design tokens and Tailwind Variants for consistent styling.',
  icon: 'i-lucide-palette'
}, {
  title: 'Accessible by default',
  description: 'Built on Reka UI for robust accessibility. WCAG compliant components that work for everyone.',
  icon: 'i-lucide-accessibility'
}, {
  title: 'Developer experience',
  description: 'Auto-imports, hot module replacement and comprehensive documentation. Build faster with less friction.',
  icon: 'i-lucide-terminal'
}, {
  title: 'SEO optimized',
  description: 'Server-side rendering, automatic meta tags, sitemap generation and Open Graph images out of the box.',
  icon: 'i-lucide-search'
}, {
  title: 'Production ready',
  description: 'Error handling, loading states, form validation and security best practices built into every component.',
  icon: 'i-lucide-circle-check'
}, {
  title: 'Infinitely customizable',
  description: 'Override any style with the ui prop, customize globally with AppConfig, or use Tailwind classes directly.',
  icon: 'i-lucide-settings'
}]

const plans = [{
  title: 'Basic',
  description: 'A basic plan for individuals.',
  price: '$9',
  features: ['1 GB storage', '1 email account', '1 domain', 'Community support'],
  button: { label: 'Get started', color: 'neutral' as const, variant: 'subtle' as const }
}, {
  title: 'Standard',
  description: 'A standard plan for small teams.',
  price: '$19',
  highlight: true,
  badge: 'Most popular',
  features: ['10 GB storage', '10 email accounts', '10 domains', 'Priority support'],
  button: { label: 'Get started' }
}, {
  title: 'Premium',
  description: 'A premium plan for large teams.',
  price: '$29',
  features: ['100 GB storage', '100 email accounts', '100 domains', 'Dedicated support'],
  button: { label: 'Get started', color: 'neutral' as const, variant: 'subtle' as const }
}]

const testimonials = [{
  quote: 'Nuxt UI transformed how we build. The component quality is exceptional - everything just works with perfect TypeScript support, accessibility and dark mode built in.',
  user: { name: 'Sarah Chen', description: 'CTO at TechScale' }
}, {
  quote: 'We shipped our MVP in 2 weeks instead of 2 months. The authentication flows and form components saved us countless hours of development time.',
  user: { name: 'Marcus Rodriguez', description: 'VP of Engineering at DataFlow' }
}, {
  quote: 'The design system with AppConfig is brilliant. We maintain brand consistency across all our products while leveraging the full component library.',
  user: { name: 'David Kumar', description: 'Security Director at SecureStack' }
}, {
  quote: 'Perfect Lighthouse scores out of the box. Our Core Web Vitals improved dramatically just by switching to Nuxt UI components.',
  user: { name: 'Emily Zhang', description: 'Lead Architect at ScaleForce' }
}]

const ctaLinks = [{
  label: 'Start building',
  trailingIcon: 'i-lucide-arrow-right'
}, {
  label: 'View on GitHub',
  icon: 'i-lucide-github',
  variant: 'subtle' as const
}]

const footerColumns = [{
  label: 'Resources',
  children: [
    { label: 'Help center' },
    { label: 'Docs' },
    { label: 'Roadmap' },
    { label: 'Changelog' }
  ]
}, {
  label: 'Features',
  children: [
    { label: 'Affiliates' },
    { label: 'Portal' },
    { label: 'Jobs' },
    { label: 'Sponsors' }
  ]
}, {
  label: 'Company',
  children: [
    { label: 'About' },
    { label: 'Pricing' },
    { label: 'Careers' },
    { label: 'Blog' }
  ]
}]

const email = ref('')
</script>

<template>
  <!-- A mini landing page: the pane is the scroll container, so the header sticks to it. -->
  <div class="h-full overflow-y-auto bg-default">
    <UHeader :toggle="false">
      <template #left>
        <div class="flex items-center gap-1.5">
          <UIcon name="i-lucide-rocket" class="size-6 text-primary shrink-0" />
          <span class="text-xl font-bold text-highlighted">SaaS</span>
        </div>
      </template>

      <UNavigationMenu :items="navItems" variant="link" />

      <template #right>
        <UButton label="Sign in" color="neutral" variant="outline" class="hidden lg:inline-flex" />
        <UButton label="Sign up" color="neutral" trailing-icon="i-lucide-arrow-right" />
      </template>
    </UHeader>

    <UPageHero
      description="Build production-ready SaaS applications with powerful components, authentication flows and enterprise features."
      :links="heroLinks"
    >
      <template #headline>
        <UBadge variant="subtle" icon="i-lucide-sparkles">
          Nuxt UI v4 is out
        </UBadge>
      </template>

      <template #title>
        Ship your <span class="text-primary">SaaS</span> at light speed
      </template>
    </UPageHero>

    <UPageSection
      v-for="(section, index) in sections"
      :key="index"
      :title="section.title"
      :description="section.description"
      orientation="horizontal"
      :reverse="section.reverse"
      :features="section.features"
    >
      <div class="aspect-video w-full rounded-lg bg-elevated/50 ring ring-default flex items-center justify-center">
        <UIcon name="i-lucide-image" class="size-8 text-dimmed" />
      </div>
    </UPageSection>

    <UPageSection
      title="Everything you need to ship"
      description="Stop building from scratch. Focus on your unique features while Nuxt UI handles the foundations with battle-tested components and patterns."
    >
      <UPageGrid>
        <UPageCard
          v-for="feature in features"
          :key="feature.title"
          v-bind="feature"
          spotlight
        />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      title="A plan for every need"
      description="Our plans are designed to meet the requirements of both individuals and teams. Get the right plan that suits you."
    >
      <UPricingPlans>
        <UPricingPlan
          v-for="plan in plans"
          :key="plan.title"
          v-bind="plan"
          billing-cycle="/month"
        />
      </UPricingPlans>
    </UPageSection>

    <UPageSection
      headline="Trusted by developers"
      title="Join thousands building with Nuxt UI"
      description="See why developers choose Nuxt UI to ship their SaaS applications faster and with more confidence."
    >
      <UPageColumns class="lg:columns-2">
        <UPageCard
          v-for="testimonial in testimonials"
          :key="testimonial.user.name"
          variant="subtle"
          :description="testimonial.quote"
          :ui="{ description: 'before:content-[open-quote] after:content-[close-quote]' }"
        >
          <template #footer>
            <UUser
              v-bind="testimonial.user"
              :avatar="{ alt: testimonial.user.name }"
              size="lg"
            />
          </template>
        </UPageCard>
      </UPageColumns>
    </UPageSection>

    <USeparator />

    <UPageCTA
      title="Ready to build an amazing SaaS?"
      description="Join thousands of developers building with Nuxt and Nuxt UI. Get this template and start shipping today."
      :links="ctaLinks"
      variant="naked"
    />

    <USeparator icon="i-lucide-rocket" class="h-px" />

    <UFooter :ui="{ top: 'border-b border-default' }">
      <template #top>
        <UContainer>
          <UFooterColumns :columns="footerColumns">
            <template #right>
              <UFormField name="email" label="Subscribe to our newsletter" size="lg">
                <UInput v-model="email" type="email" placeholder="Enter your email" class="w-full">
                  <template #trailing>
                    <UButton size="xs" color="neutral" label="Subscribe" />
                  </template>
                </UInput>
              </UFormField>
            </template>
          </UFooterColumns>
        </UContainer>
      </template>

      <template #left>
        <p class="text-muted text-sm">
          Built with Nuxt UI • © 2026
        </p>
      </template>

      <template #right>
        <UButton icon="i-lucide-github" aria-label="GitHub" color="neutral" variant="ghost" />
        <UButton icon="i-lucide-twitter" aria-label="X" color="neutral" variant="ghost" />
      </template>
    </UFooter>
  </div>
</template>
