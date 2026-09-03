<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const appConfig = useAppConfig()
const studioIcons = useStudioIcons()

// Replicates the Nuxt UI Portfolio template home page: floating pill nav,
// avatar hero with polaroid marquee, about + work experience columns,
// blog list, testimonial carousel, FAQ tabs and footer.
const navItems: NavigationMenuItem[] = [
  { label: 'Home', icon: studioIcons.home, active: true },
  { label: 'Projects', icon: appConfig.ui.icons.folder },
  { label: 'Blog', icon: appConfig.ui.icons.file },
  { label: 'Speaking', icon: studioIcons.mic },
  { label: 'About', icon: studioIcons.user }
]

const socialLinks = [
  { 'icon': 'i-simple-icons-discord', 'aria-label': 'Discord' },
  { 'icon': 'i-simple-icons-x', 'aria-label': 'X' },
  { 'icon': studioIcons.github, 'aria-label': 'GitHub' }
]

// The template scrolls travel photos in a marquee; gradient polaroids stand in
// because a tinted surface tracks the theme and a photo does not.
const heroImages = [
  { icon: studioIcons.mountain, label: 'Alps, 2024' },
  { icon: studioIcons.coffee, label: 'Café sketching' },
  { icon: studioIcons.bike, label: 'Canal ride' },
  { icon: studioIcons.camera, label: 'Street photos' },
  { icon: studioIcons.laptop, label: 'Studio desk' },
  { icon: studioIcons.trees, label: 'Veluwe hike' },
  { icon: studioIcons.palette, label: 'Color studies' },
  { icon: studioIcons.ferrisWheel, label: 'Rotterdam fair' },
  { icon: studioIcons.waves, label: 'North Sea' }
]

const about = {
  title: 'About Me',
  // \n renders as a real break via whitespace-pre-line on the description slot
  description: 'I\'m an English designer and developer based in Amsterdam. I sit right between design and engineering, which means both teams assume I\'m the other team\'s problem.'
}

const experience = [{
  date: '2025 - Present',
  position: 'Public Contributor for',
  company: { name: 'Nuxt UI', logo: 'i-simple-icons-nuxtdotjs' }
}, {
  date: '2024 - Present',
  position: 'Founder of',
  company: { name: 'Lovd', logo: 'material-symbols:bookmark-heart' }
}, {
  date: '2019 - 2021',
  position: 'Web Developer at',
  company: { name: 'Blender', logo: 'i-simple-icons-blender' }
}, {
  date: '1995 - Present',
  position: 'Human person on',
  company: { name: 'Earth', logo: studioIcons.globe }
}]

const posts = [{
  title: 'Twelve Identical Greys: A Field Guide to Choosing Your Neutral',
  description: 'They are not identical and I will die on this hill. Slate is cool, stone is warm, zinc is for when you can\'t commit - a practical taxonomy.',
  date: 'Apr 23, 2025'
}, {
  title: 'I Nudged a Border Radius by 0.125rem and Felt Something',
  description: 'A meditation on the space between rounded-md and rounded-lg, and why nobody else at the review could see the difference. They saw it. They\'re being polite.',
  date: 'Mar 15, 2025'
}, {
  title: 'My Design System Now Has Its Own Design System',
  description: 'The tokens have tokens. The naming convention has a naming convention. At some point I will ship a button - a retrospective.',
  date: 'Mar 5, 2025'
}]

// Obviously-fake reviews: the testimonial carousel demos better with famous
// dead Dutch masters than with invented product directors.
const testimonials = [{
  quote: 'At last, a man who treats the grid as a moral position. I did notice his palette editor permits more than three colors, I have chosen to forgive this.',
  author: { name: 'Piet Mondrian', description: 'Painter & grid enthusiast, 1872–1944' }
}, {
  quote: 'I asked for a simple staircase component. The popovers opened into popovers, which opened into further popovers. Honestly, I have never felt more at home.',
  author: { name: 'M.C. Escher', description: 'Staircase guy, 1898–1972' }
}, {
  quote: 'I set the primary color to chrome yellow and wept at the shades it produced. Five stars. Would have commissioned him, but our schedules never aligned.',
  author: { name: 'Vincent van Gogh', description: 'Colorist, freelance, 1853–1890' }
}]

const faqCategories = [{
  label: 'Services & Process',
  questions: [{
    label: 'What services do you offer?',
    content: 'Design systems, UX/UI design and front-end development - designed in Figma, built in Nuxt. I also cover the surrounding craft: branding, print, photography, video and animation.'
  }, {
    label: 'What is your design process like?',
    content: 'Iterative: sketch, build, squint at it in dark mode, nudge a slider by 0.125rem, declare it the final tweak. Repeat until shipped, or until someone gently takes the slider away.'
  }, {
    label: 'Do you work with startups?',
    content: 'Absolutely - I run one. The daily standup is me and a wall of post-it notes, and the post-its are consistently flaking.'
  }]
}, {
  label: 'Pricing & Timelines',
  questions: [{
    label: 'How much does a project typically cost?',
    content: 'This theme editor is free and takes payment in GitHub stars. For anything else: it depends - an answer that has never once been wrong.'
  }, {
    label: 'What are your payment terms?',
    content: 'Stroopwafels, baked beans, or sincere compliments about my border-radius choices. Bank transfer is also, grudgingly, accepted.'
  }, {
    label: 'How long does a typical project take?',
    content: 'Somewhere between one focused afternoon and "I rebuilt the design system twice, it\'s better now, please don\'t ask." Discovery narrows this down considerably.'
  }]
}, {
  label: 'About Me',
  questions: [{
    label: 'What do you enjoy most about your work?',
    content: 'Watching someone use a thing I built and say "oh, I found a bug". Bridging user needs and technical constraints is the puzzle that keeps me here while the users scare me away.'
  }, {
    label: 'What are your hobbies outside of work?',
    content: 'Arts and crafts, film photography, hunting down good curry in Amsterdam and contributing to open-source UI tooling.'
  }]
}]

// Template's Motion blur-in on the hero, replayed as staggered CSS transitions.
const heroAppear = ref(false)
let appearTimeout: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  appearTimeout = setTimeout(() => {
    heroAppear.value = true
  }, 0)
})
onUnmounted(() => clearTimeout(appearTimeout))
</script>

<template>
  <!-- A mini portfolio: the pane is the scroll container, so the pill nav sticks to it. -->
  <div class="h-full overflow-y-auto bg-default" style="--ui-container: var(--container-4xl)">
    <!-- Template's AppHeader: a floating centered pill navigation. -->
    <div class="sticky top-2 sm:top-4 z-10 h-0 flex items-start justify-center pointer-events-none">
      <UNavigationMenu
        :items="navItems"
        variant="link"
        color="neutral"
        class="pointer-events-auto bg-muted/80 backdrop-blur-sm rounded-full px-2 sm:px-4 border border-muted/50 shadow-lg shadow-neutral-950/5"
        :ui="{
          link: 'px-2 py-1',
          linkLeadingIcon: 'hidden'
        }"
      >
        <template #list-trailing>
          <!-- Static: the studio toolbar owns color mode. -->
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            class="rounded-full"
            aria-label="Color mode"
          >
            <template #leading="{ ui }">
              <UIcon :name="appConfig.ui.icons.dark" :class="ui.leadingIcon({ class: 'hidden dark:inline-block' })" />
              <UIcon :name="appConfig.ui.icons.light" :class="ui.leadingIcon({ class: 'dark:hidden' })" />
            </template>
          </UButton>
        </template>
      </UNavigationMenu>
    </div>

    <UContainer class="sm:border-x border-default pt-10">
      <UPageHero
        title="Hey, I'm Mike Newbon Design Engineer"
        description="Based in Amsterdam, I craft intuitive digital products, where design meets fun-ctionality. Like this theme editor!"
        :ui="{
          container: 'py-18 sm:py-24 lg:py-32',
          headline: 'flex items-center justify-center',
          title: 'text-shadow-md max-w-lg mx-auto text-pretty text-3xl sm:text-4xl lg:text-5xl',
          description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted',
          links: 'mt-4 flex-col justify-center items-center'
        }"
      >
        <template #headline>
          <UAvatar
            alt="Mike Newbon"
            size="3xl"
            src="https://github.com/mikenewbon.png"
            class="size-18 ring ring-default ring-offset-3 ring-offset-bg transition-all duration-600"
            :class="heroAppear ? 'opacity-100 blur-none scale-100' : 'opacity-0 blur-lg scale-110'"
          />
        </template>

        <template #links>
          <div class="flex items-center gap-2">
            <UButton :icon="studioIcons.github" label="View Github" color="neutral" to="https://github.com/mikenewbon/" target="_blank" />
            <UButton color="success" variant="ghost" class="gap-2" label="Always online">
              <template #leading>
                <span class="relative flex size-2">
                  <span class="absolute inline-flex size-full rounded-full opacity-75 bg-success animate-ping" />
                  <span class="relative inline-flex size-2 scale-90 rounded-full bg-success" />
                </span>
              </template>
            </UButton>
          </div>

          <div class="gap-x-4 inline-flex mt-4">
            <UButton
              v-for="(link, index) of socialLinks"
              :key="index"
              v-bind="{ size: 'md', color: 'neutral', variant: 'ghost', ...link }"
            />
          </div>
        </template>

        <UMarquee pause-on-hover class="py-2 -mx-8 sm:-mx-12 lg:-mx-16 [--duration:40s]">
          <div
            v-for="(img, index) in heroImages"
            :key="index"
            class="w-[234px] aspect-square shrink-0 rounded-lg overflow-hidden relative bg-elevated flex flex-col items-center justify-center gap-3"
            :class="index % 2 === 0 ? '-rotate-2' : 'rotate-2'"
          >
            <div
              class="absolute inset-0"
              :style="{ background: `radial-gradient(ellipse at ${index % 2 === 0 ? '30% 20%' : '70% 80%'}, color-mix(in srgb, var(--ui-primary) ${12 + (index % 3) * 6}%, transparent), transparent 70%)` }"
            />
            <UIcon :name="img.icon" class="size-10 text-dimmed relative" />
            <span class="text-xs text-muted font-medium relative">{{ img.label }}</span>
          </div>
        </UMarquee>
      </UPageHero>

      <!-- About + work experience share a two-column section on the template home. -->
      <UPageSection :ui="{ container: 'pt-0! lg:grid lg:grid-cols-2 lg:gap-8' }">
        <UPageSection
          :title="about.title"
          :description="about.description"
          :ui="{
            container: 'p-0!',
            title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
            description: 'text-left mt-3 text-sm sm:text-md lg:text-sm text-muted whitespace-pre-line'
          }"
        />

        <UPageSection
          title="Work Experience"
          :ui="{
            container: 'p-0! gap-4 sm:gap-4',
            title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
            description: 'mt-2'
          }"
        >
          <template #description>
            <div class="flex flex-col gap-2">
              <div
                v-for="(item, index) in experience"
                :key="index"
                class="text-muted flex items-center text-nowrap gap-2"
              >
                <p class="text-sm">
                  {{ item.date }}
                </p>
                <USeparator />
                <span class="flex items-center gap-1">
                  <span class="text-sm">{{ item.position }}</span>
                  <span class="inline-flex items-center gap-1 text-highlighted">
                    <span class="font-medium text-sm">{{ item.company.name }}</span>
                    <UIcon :name="item.company.logo" />
                  </span>
                </span>
              </div>
            </div>
          </template>
        </UPageSection>
      </UPageSection>

      <UPageSection
        title="Latest Articles"
        description="Some of my recent thoughts"
        :ui="{
          container: 'px-0 pt-0! sm:gap-6 lg:gap-8',
          title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
          description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted'
        }"
      >
        <UBlogPosts orientation="vertical" class="gap-4 lg:gap-y-4">
          <UBlogPost
            v-for="(post, index) in posts"
            :key="index"
            orientation="horizontal"
            variant="naked"
            v-bind="post"
            to="#"
            :ui="{
              root: 'group relative lg:items-start lg:flex ring-0 hover:ring-0',
              body: 'px-0!',
              header: 'hidden'
            }"
          >
            <template #footer>
              <UButton size="xs" variant="link" class="px-0 gap-0" label="Read Article">
                <template #trailing>
                  <UIcon
                    :name="appConfig.ui.icons.arrowRight"
                    class="size-4 text-primary transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </template>
              </UButton>
            </template>
          </UBlogPost>
        </UBlogPosts>
      </UPageSection>

      <UPageSection :ui="{ container: 'px-0 pt-0!' }">
        <UCarousel
          v-slot="{ item }"
          :items="testimonials"
          :autoplay="{ delay: 4000 }"
          loop
          dots
          :ui="{ viewport: '-mx-4 sm:-mx-12 lg:-mx-16 bg-elevated/50 max-w-(--ui-container)' }"
        >
          <UPageCTA
            :description="item.quote"
            variant="naked"
            class="rounded-none"
            :ui="{
              container: 'sm:py-12 lg:py-12 sm:gap-8',
              description: 'text-base! text-balance before:content-[open-quote] before:text-5xl lg:before:text-7xl before:inline-block before:text-dimmed before:absolute before:-ml-6 lg:before:-ml-10 before:-mt-2 lg:before:-mt-4 after:content-[close-quote] after:text-5xl lg:after:text-7xl after:inline-block after:text-dimmed after:absolute after:mt-1 lg:after:mt-0 after:ml-1 lg:after:ml-2'
            }"
          >
            <UUser
              v-bind="item.author"
              :avatar="{ alt: item.author.name }"
              size="xl"
              class="justify-center"
            />
          </UPageCTA>
        </UCarousel>
      </UPageSection>

      <UPageSection
        title="Frequently Asked Questions"
        description="Answers to common questions about my process and services."
        :ui="{
          container: 'px-0 pt-0! gap-4 sm:gap-4',
          title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
          description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted'
        }"
      >
        <UTabs
          :items="faqCategories"
          orientation="horizontal"
          :ui="{
            root: 'flex items-center gap-4 w-full',
            list: 'relative flex bg-transparent dark:bg-transparent gap-2 px-0',
            indicator: 'absolute top-[4px] duration-200 ease-out focus:outline-none rounded-lg bg-elevated/60',
            trigger: 'px-3 py-2 rounded-lg hover:bg-muted/50 data-[state=active]:text-highlighted data-[state=inactive]:text-muted',
            label: 'truncate'
          }"
        >
          <template #content="{ item }">
            <UAccordion
              :trailing-icon="appConfig.ui.icons.plus"
              :items="item.questions"
              :unmount-on-hide="false"
              :ui="{
                item: 'border-none',
                trigger: 'mb-2 border-0 group px-4 transform-gpu rounded-lg bg-elevated/60 will-change-transform hover:bg-muted/50 text-base',
                body: 'px-4',
                trailingIcon: 'group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-135 text-base text-muted'
              }"
            />
          </template>
        </UTabs>
      </UPageSection>

      <UFooter class="z-10 bg-default" :ui="{ left: 'text-muted text-xs' }">
        <template #left>
          Built with Nuxt UI • © 2026
        </template>

        <template #right>
          <UButton
            v-for="(link, index) of socialLinks"
            :key="index"
            v-bind="{ size: 'xs', color: 'neutral', variant: 'ghost', ...link }"
          />
        </template>
      </UFooter>
    </UContainer>
  </div>
</template>
