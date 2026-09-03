<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const appConfig = useAppConfig()
const studioIcons = useStudioIcons()

const navItems: NavigationMenuItem[] = [
  { label: 'Docs', active: true },
  { label: 'Pricing' },
  { label: 'Blog' },
  { label: 'Changelog' }
]

const heroLinks = [{
  label: 'Get started',
  trailingIcon: appConfig.ui.icons.arrowRight,
  size: 'xl' as const
}, {
  label: 'Use this template',
  icon: studioIcons.github,
  size: 'xl' as const,
  color: 'neutral' as const,
  variant: 'subtle' as const
}]

const sections = [{
  title: 'Powered by Nuxt UI Components',
  description: 'Access a complete component library with beautifully styled, accessible and customizable Vue components. Everything you need to build professional SaaS applications.',
  reverse: false,
  features: [{
    title: '100+ UI Components',
    description: 'From buttons to modals, data tables to forms - all styled with Tailwind CSS and accessible out of the box.',
    icon: studioIcons.package
  }, {
    title: 'Authentication Ready',
    description: 'Pre-built login, signup and password reset flows. Just connect your backend and start onboarding users.',
    icon: studioIcons.shield
  }, {
    title: 'TypeScript First',
    description: 'Full TypeScript support with auto-completion, type safety and IntelliSense for every component.',
    icon: studioIcons.code
  }]
}, {
  title: 'Built for Modern SaaS',
  description: 'Everything you need to launch and scale. From beautiful marketing pages to complex dashboards, ship faster with production-ready patterns.',
  reverse: true,
  features: [{
    title: 'Edge Performance',
    description: 'Optimized for Core Web Vitals with automatic code splitting, lazy loading and SSR/SSG support.',
    icon: studioIcons.zap
  }, {
    title: 'Dark Mode Ready',
    description: 'Automatic theme switching with smooth transitions. Respects system preferences and remembers user choice.',
    icon: appConfig.ui.icons.dark
  }, {
    title: 'Global Ready',
    description: 'Built-in i18n support for 50+ languages with RTL/LTR layouts and font optimization.',
    icon: studioIcons.globe
  }]
}]

const features = [{
  title: 'Beautiful design system',
  description: 'Semantic color aliases, comprehensive design tokens and Tailwind Variants for consistent styling.',
  icon: studioIcons.palette
}, {
  title: 'Accessible by default',
  description: 'Built on Reka UI for robust accessibility. WCAG compliant components that work for everyone.',
  icon: studioIcons.a11y
}, {
  title: 'Developer experience',
  description: 'Auto-imports, hot module replacement and comprehensive documentation. Build faster with less friction.',
  icon: studioIcons.terminal
}, {
  title: 'SEO optimized',
  description: 'Server-side rendering, automatic meta tags, sitemap generation and Open Graph images out of the box.',
  icon: appConfig.ui.icons.search
}, {
  title: 'Production ready',
  description: 'Error handling, loading states, form validation and security best practices built into every component.',
  icon: appConfig.ui.icons.success
}, {
  title: 'Infinitely customizable',
  description: 'Override any style with the ui prop, customize globally with AppConfig, or use Tailwind classes directly.',
  icon: studioIcons.settings
}]

// The template's pricing page: three plans over a billing cycle toggle, no
// badge, and Standard scaled up. Prices and feature lists are content/2.pricing.yml.
const billingCycle = ref<'month' | 'year'>('month')

const billingCycleItems = [
  { label: 'Monthly', value: 'month' },
  { label: 'Yearly', value: 'year' }
]

const planFeatures = (count: string) => [
  `${count} GB Storage`,
  `${count} Email Accounts`,
  `${count} Domains`,
  `${count} Websites`,
  `${count} Databases`,
  `${count} SSL Certificates`,
  `${count} Support Tickets`
]

const plans = computed(() => {
  const yearly = billingCycle.value === 'year'

  return [{
    title: 'Basic',
    description: 'A basic plan for individuals.',
    price: yearly ? '$99.9' : '$9.9',
    features: planFeatures('1'),
    button: { label: 'Get Started', color: 'neutral' as const, variant: 'subtle' as const }
  }, {
    title: 'Standard',
    description: 'A standard plan for small teams.',
    price: yearly ? '$199.9' : '$19.9',
    highlight: true,
    scale: true,
    features: planFeatures('10'),
    button: { label: 'Get Started' }
  }, {
    title: 'Premium',
    description: 'A premium plan for large teams.',
    price: yearly ? '$299.9' : '$29.9',
    features: planFeatures('100'),
    button: { label: 'Get Started', color: 'neutral' as const, variant: 'subtle' as const }
  }]
})

const faqItems = [
  { label: 'Is this a secure service?', content: 'Every request is served over HTTPS, secrets stay server side, and sessions are signed and rotated. Nothing in the client bundle can read another tenant\'s data.' },
  { label: 'How can I cancel my subscription?', content: 'From the billing page, in one click. You keep access until the end of the period you already paid for, and nothing is deleted for thirty days after that.' },
  { label: 'How does the free trial work?', content: 'Fourteen days on the Standard plan, no card required. When it ends you pick a plan or the workspace goes read only until you do.' },
  { label: 'Can I switch plans later?', content: 'Up or down, at any time. Upgrades apply immediately and are prorated, downgrades take effect at the start of the next cycle.' },
  { label: 'Do you offer refunds?', content: 'Within thirty days of a charge, for any reason. Reply to the receipt and we refund the whole invoice.' },
  { label: 'Do you offer support?', content: 'Every plan includes email support. Standard adds priority routing and Premium adds a shared channel with the engineers who build the product.' }
]

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
}, {
  quote: 'The Tailwind Variants system makes customization so intuitive. We can override any component style while keeping the functionality intact.',
  user: { name: 'James Wilson', description: 'DevOps Lead at CloudPro' }
}, {
  quote: 'From the SaaS template to production in days. The pre-built layouts, navigation and content structure accelerated our launch.',
  user: { name: 'Lisa Patel', description: 'CEO at AutoScale' }
}]

const ctaLinks = [{
  label: 'Start building',
  trailingIcon: appConfig.ui.icons.arrowRight
}, {
  label: 'View on GitHub',
  icon: studioIcons.github,
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

// Hero background beam fades in on mount, like the template's HeroBackground.
const heroAppear = ref(false)
const heroAppeared = ref(false)

// The zero delay pushes the class flip past first paint so the fade-in
// transition actually runs.
let appearTimeout: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  appearTimeout = setTimeout(() => {
    heroAppear.value = true
    appearTimeout = setTimeout(() => {
      heroAppeared.value = true
    }, 1000)
  }, 0)
})
onUnmounted(() => clearTimeout(appearTimeout))

// Rising stars behind the CTA, ported from the template's StarsBg.
interface Star {
  x: number
  y: number
  size: number
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.floor(Math.random() * 2000),
    y: Math.floor(Math.random() * 2000),
    size: Math.random() + 1
  }))
}

// Seeded on mount: Math.random() at setup scope would render one sky on the
// server and another on the client, mismatching every star's inline style.
const starLayers = ref<{ stars: Star[], duration: number, opacity: number }[]>([])
onMounted(() => {
  starLayers.value = [
    { stars: generateStars(80), duration: 100, opacity: 1 },
    { stars: generateStars(60), duration: 150, opacity: 0.75 },
    { stars: generateStars(60), duration: 200, opacity: 0.5 }
  ]
})
</script>

<template>
  <!-- A mini landing page: the pane is the scroll container, so the header sticks to it. -->
  <div class="h-full overflow-y-auto bg-default">
    <UHeader :toggle="false" class="rounded-t-[inherit]">
      <template #left>
        <div class="flex items-center gap-1.5">
          <UIcon :name="studioIcons.saas" class="size-6 text-primary shrink-0" />
          <span class="text-xl font-bold text-highlighted">SaaS</span>
        </div>
      </template>

      <UNavigationMenu :items="navItems" variant="link" />

      <template #right>
        <!-- UColorModeButton renders the pack's moon/sun pair; the studio toolbar owns the real toggle. -->
        <UButton color="neutral" variant="ghost" aria-label="Color mode">
          <template #leading="{ ui }">
            <UIcon :name="appConfig.ui.icons.dark" :class="ui.leadingIcon({ class: 'hidden dark:inline-block' })" />
            <UIcon :name="appConfig.ui.icons.light" :class="ui.leadingIcon({ class: 'dark:hidden' })" />
          </template>
        </UButton>
        <UButton label="Sign in" color="neutral" variant="outline" class="hidden lg:inline-flex" />
        <UButton label="Sign up" color="neutral" :trailing-icon="appConfig.ui.icons.arrowRight" />
      </template>
    </UHeader>

    <UPageHero
      description="Build production-ready SaaS applications with Nuxt UI's powerful components, authentication flows, and enterprise features. The same component library trusted by the entire Nuxt ecosystem."
      :links="heroLinks"
    >
      <template #top>
        <!-- Template's HeroBackground: a primary beam along the header with a fading glow. -->
        <div
          class="absolute w-full -top-px transition-all text-primary shrink-0 pointer-events-none"
          :class="[
            heroAppear ? '' : 'opacity-0',
            heroAppeared ? 'duration-[400ms]' : 'duration-1000'
          ]"
        >
          <svg viewBox="0 0 1440 181" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="saas-hero-mask" fill="white">
              <path d="M0 0H1440V181H0V0Z" />
            </mask>
            <path d="M0 0H1440V181H0V0Z" fill="url(#saas-hero-glow)" fill-opacity="0.22" />
            <path d="M0 2H1440V-2H0V2Z" fill="url(#saas-hero-beam)" mask="url(#saas-hero-mask)" />
            <defs>
              <linearGradient
                id="saas-hero-glow"
                x1="720"
                y1="0"
                x2="720"
                y2="181"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="currentColor" />
                <stop offset="1" stop-color="currentColor" stop-opacity="0" />
              </linearGradient>
              <linearGradient
                id="saas-hero-beam"
                x1="0"
                y1="90.5"
                x2="1440"
                y2="90.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="currentColor" stop-opacity="0" />
                <stop offset="0.395" stop-color="currentColor" />
                <stop offset="1" stop-color="currentColor" stop-opacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </template>

      <template #title>
        Ship your <span class="text-primary">SaaS</span> at light speed
      </template>

      <!-- Template's PromotionalVideo: a framed media card below the hero copy. -->
      <UPageCard variant="subtle" class="rounded-2xl">
        <div class="relative aspect-video w-full rounded-xl overflow-hidden bg-elevated flex items-center justify-center">
          <div class="absolute inset-0" style="background: radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--ui-primary) 15%, transparent), transparent 70%)" />
          <UButton
            :icon="studioIcons.play"
            size="xl"
            color="neutral"
            variant="outline"
            aria-label="Play video"
            class="rounded-full"
          />
        </div>
      </UPageCard>
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
      <!-- Template's ImagePlaceholder: a framed card with a diagonal-stripes pattern. -->
      <UPageCard variant="subtle">
        <div class="relative overflow-hidden rounded-sm border border-dashed border-accented opacity-75 px-4 flex items-center justify-center aspect-video">
          <svg class="absolute inset-0 h-full w-full stroke-inverted/10" fill="none">
            <defs>
              <pattern
                :id="`saas-stripes-${index}`"
                x="0"
                y="0"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3" />
              </pattern>
            </defs>
            <rect stroke="none" :fill="`url(#saas-stripes-${index})`" width="100%" height="100%" />
          </svg>
        </div>
      </UPageCard>
    </UPageSection>

    <UPageSection
      title="Everything You Need to Ship"
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
      headline="Trusted by Developers"
      title="Join Thousands Building with Nuxt UI"
      description="See why developers choose Nuxt UI to ship their SaaS applications faster and with more confidence."
    >
      <UPageColumns class="lg:columns-2 xl:columns-3">
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

    <UPageSection
      title="A Plan for Every Need"
      description="Our plans are designed to meet the requirements of both beginners and players. Get the right plan that suits you."
      :ui="{ links: 'justify-center' }"
    >
      <template #links>
        <UTabs
          v-model="billingCycle"
          :items="billingCycleItems"
          :content="false"
          color="neutral"
          size="xs"
          class="w-48"
          :ui="{ list: 'ring ring-accented rounded-full', indicator: 'rounded-full', trigger: 'w-1/2' }"
        />
      </template>

      <UPricingPlans scale>
        <UPricingPlan
          v-for="plan in plans"
          :key="plan.title"
          v-bind="plan"
          :billing-cycle="billingCycle === 'year' ? '/year' : '/month'"
        />
      </UPricingPlans>
    </UPageSection>

    <UPageSection title="Frequently Asked Questions">
      <UAccordion
        :items="faqItems"
        type="multiple"
        :default-value="['0']"
        :unmount-on-hide="false"
        class="max-w-3xl mx-auto"
        :ui="{ trigger: 'text-base text-highlighted', body: 'text-base text-muted' }"
      />
    </UPageSection>

    <UPageCTA
      title="Ready to build an amazing SaaS?"
      description="Join thousands of developers building with Nuxt and Nuxt UI. Get this template and start shipping today."
      :links="ctaLinks"
      variant="naked"
      class="overflow-hidden"
    >
      <!-- Template's StarsBg: rising primary stars under a radial glow. -->
      <div class="absolute pointer-events-none z-[-1] inset-y-0 inset-x-5 sm:inset-x-7 lg:inset-x-9 overflow-hidden">
        <svg class="absolute inset-0 pointer-events-none size-full" viewBox="0 0 1017 181" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <g opacity="0.5">
            <path d="M0 0H1017V181H0V0Z" fill="url(#saas-stars-glow)" fill-opacity="0.22" />
          </g>
          <defs>
            <radialGradient
              id="saas-stars-glow"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(508.999 19.5) rotate(90.177) scale(161.501 509.002)"
            >
              <stop stop-color="var(--ui-primary)" />
              <stop offset="1" stop-color="var(--ui-primary)" stop-opacity="0" />
            </radialGradient>
          </defs>
        </svg>

        <div class="stars size-full absolute inset-x-0 top-0">
          <div
            v-for="(layer, index) in starLayers"
            :key="index"
            class="star-layer"
            :style="{
              '--star-duration': `${layer.duration}s`,
              '--star-opacity': layer.opacity
            }"
          >
            <div
              v-for="(star, starIndex) in layer.stars"
              :key="starIndex"
              class="absolute rounded-full bg-primary"
              :style="{
                left: `${star.x}px`,
                top: `${star.y}px`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: 'var(--star-opacity)'
              }"
            />
          </div>
        </div>
      </div>
    </UPageCTA>

    <USeparator :icon="studioIcons.saas" class="h-px" />

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
        <UButton :icon="studioIcons.github" aria-label="GitHub" color="neutral" variant="ghost" />
        <UButton icon="i-simple-icons-x" aria-label="X" color="neutral" variant="ghost" />
      </template>
    </UFooter>
  </div>
</template>

<style scoped>
.stars {
  left: 50%;
  transform: translate(-50%);
  mask-image: linear-gradient(180deg,
      rgba(217, 217, 217, 0) 0%,
      rgba(217, 217, 217, 0.8) 25%,
      #d9d9d9 50%,
      rgba(217, 217, 217, 0.8) 75%,
      rgba(217, 217, 217, 0) 100%);
  mask-size: cover;
}

.star-layer {
  animation: risingStarsAnimation linear infinite;
  animation-duration: var(--star-duration);
  will-change: transform;
}

@keyframes risingStarsAnimation {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-2000px);
  }
}
</style>
