<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <ULandingHero :ui="{ base: 'relative z-[1]', container: 'max-w-4xl' }" class="mb-[calc(var(--header-height)*2)]">
      <template #headline>
        <UBadge variant="subtle" size="md" class="hover:bg-primary-100 dark:bg-primary-950/100 dark:hover:bg-primary-900 transition-color relative font-medium rounded-full shadow-none">
          <NuxtLink :to="`https://github.com/nuxt/ui/releases/tag/v${config.version.split('.').slice(0, -1).join('.')}.0`" target="_blank" class="focus:outline-none" aria-label="Go to last relase" tabindex="-1">
            <span class="absolute inset-0" aria-hidden="true" />
          </NuxtLink>

          <span class="flex items-center gap-1">
            Nuxt UI v{{ config.version.split('.').slice(0, -1).join('.') }} is out!
          </span>
        </UBadge>
      </template>

      <template #title>
        <span v-html="page.hero?.title" />
      </template>

      <template #description>
        <span v-html="page.hero?.description" />
      </template>

      <template #links>
        <UButton label="Get Started" trailing-icon="i-heroicons-arrow-right-20-solid" size="lg" to="/getting-started/installation" />

        <UInput
          v-model="source"
          color="gray"
          readonly
          autocomplete="off"
          icon="i-heroicons-command-line"
          class="w-72"
          input-class="focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-700"
          aria-label="Install @nuxt/ui"
          size="lg"
          :ui="{ icon: { trailing: { pointer: '' } } }"
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
        <ClientOnly>
          <HomeDemo v-if="lgAndLarger" />
        </ClientOnly>
      </template>

      <template #features>
        <ULandingGrid class="lg:-mb-20 lg:auto-rows-[3rem]">
          <ULandingCard
            v-for="(card, subIndex) of section.cards"
            :key="subIndex"
            v-bind="card"
            :ui="{
              background: 'dark:bg-gray-900/50 dark:lg:bg-gradient-to-b from-gray-700/50 to-gray-950/50',
              body: {
                base: 'flex-1',
                background: 'dark:bg-gray-800/50 dark:lg:bg-gray-900/50 backdrop-blur-lg'
              }
            }"
            class="flex flex-col"
          >
            <UColorModeImage
              :light="`${card.image.path}-light.svg`"
              :dark="`${card.image.path}-dark.svg`"
              :width="card.image.width"
              :height="card.image.height"
              :alt="card.title"
              loading="lazy"
              class="object-cover w-full"
            />
          </ULandingCard>
        </ULandingGrid>
      </template>
    </ULandingSection>

    <ULandingSection class="!pt-0 dark:bg-gradient-to-b from-gray-950/50 to-gray-900">
      <ULandingCTA
        align="left"
        :card="false"
        :ui="{
          body: {
            padding: '!p-0'
          },
          title: 'text-center lg:text-left lg:text-5xl',
          description: 'mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 lg:gap-16',
          links: '-ml-3 justify-center lg:justify-start flex-wrap gap-y-3'
        }"
      >
        <template #title>
          <span v-html="page.cta.title" />
        </template>

        <template #description>
          <NuxtLink class="text-center lg:text-left group" to="https://npmjs.org/package/@nuxt/ui" target="_blank">
            <p class="text-5xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400">
              {{ format(module.stats.downloads) }}+
            </p>
            <p>monthly downloads</p>
          </NuxtLink>

          <NuxtLink class="text-center lg:text-left group" to="https://github.com/nuxt/ui" target="_blank">
            <p class="text-5xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400">
              {{ format(module.stats.stars) }}+
            </p>
            <p>GitHub stars</p>
          </NuxtLink>
        </template>

        <template #links>
          <UButton
            v-for="user in page.cta.users"
            :key="user.username"
            :to="user.to"
            size="md"
            color="gray"
            variant="ghost"
            target="_blank"
          >
            <UAvatar
              :alt="user.username"
              :src="`https://ipx.nuxt.com/s_80x80/gh_avatar/${user.username}`"
              :srcset="`https://ipx.nuxt.com/s_160x160/gh_avatar/${user.username} 2x`"
              width="80"
              height="80"
              size="md"
              loading="lazy"
            />

            <div class="text-left">
              <p class="font-medium">
                {{ user.name }}
              </p>
              <p class="text-gray-500 dark:text-gray-400 leading-4">
                {{ `@${user.username}` }}
              </p>
            </div>
          </UButton>
        </template>

        <div class="p-5 overflow-hidden flex">
          <HomeContributors :contributors="module.contributors" />
        </div>
      </ULandingCTA>
    </ULandingSection>

    <template v-if="navigation.find(item => item._path === '/pro')">
      <ULandingHero id="pro" :links="page.pro.links" :ui="{ title: 'sm:text-6xl' }" class="bg-gradient-to-b from-gray-50 dark:from-gray-950/50 to-white dark:to-gray-900 relative">
        <template #top>
          <Gradient class="absolute inset-x-0 top-0 w-full block" />
        </template>

        <template #title>
          <span v-html="page.pro.title" />
        </template>

        <template #description>
          <span v-html="page.pro.description" />
        </template>

        <div class="bg-gray-900/5 dark:bg-white/5 ring-1 ring-inset ring-gray-900/10 dark:ring-white/10 rounded-xl lg:-m-4 p-4">
          <video preload="none" poster="https://res.cloudinary.com/nuxt/video/upload/so_3.3/v1708511800/ui-pro/video-nuxt-ui-pro_kwfbdh.jpg" controls class="rounded-lg">
            <source src="https://res.cloudinary.com/nuxt/video/upload/v1708511800/ui-pro/video-nuxt-ui-pro_kwfbdh.webm" type="video/webm">
            <source src="https://res.cloudinary.com/nuxt/video/upload/v1708511800/ui-pro/video-nuxt-ui-pro_kwfbdh.mp4" type="video/mp4">
            <source src="https://res.cloudinary.com/nuxt/video/upload/v1708511800/ui-pro/video-nuxt-ui-pro_kwfbdh.ogg" type="video/ogg">
          </video>
        </div>
      </ULandingHero>

      <ULandingSection v-for="(section, index) in page.pro.sections" :key="index" v-bind="section" class="!pt-0">
        <MDC
          v-if="section.code"
          :value="section.code"
          tag="pre"
          class="prose prose-primary dark:prose-invert max-w-none"
        />
      </ULandingSection>

      <div ref="sectionRef" :style="{ '--y': `${y}px`, '--inc': `${inc}px` }" class="_screen_xl">
        <ULandingSection class="sticky h-screen top-0 flex !pb-16" :ui="{ container: 'flex-1 sm:gap-y-12' }">
          <template #title>
            <Transition name="fade" mode="out-in">
              <span v-if="isAfterStep(steps.docs)" v-html="page.pro.docs?.title" />
              <span v-else v-html="page.pro.landing?.title" />
            </Transition>
          </template>

          <template #description>
            <Transition name="fade" mode="out-in">
              <span v-if="isAfterStep(steps.docs)" v-html="page.pro.docs?.description" />
              <span v-else v-html="page.pro.landing?.description" />
            </Transition>
          </template>

          <HomeProDemo ref="demoRef" :blocks="(blocks as HomeProBlock[])">
            <template #header-left>
              <Logo class="w-auto h-6" />
            </template>

            <template #header-center>
              <UHeaderLinks :links="headerLinks" />
            </template>

            <template #header-right>
              <div class="flex items-center gap-1.5">
                <UColorModeButton />

                <UButton
                  to="https://github.com/nuxt/ui"
                  target="_blank"
                  icon="i-simple-icons-github"
                  aria-label="GitHub"
                  class="hidden lg:inline-flex"
                  v-bind="($ui.button.secondary as any)"
                />
              </div>
            </template>

            <template #footer-left>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                Published under <NuxtLink to="https://github.com/nuxt/ui" target="_blank" class="text-gray-900 dark:text-white">
                  MIT License
                </NuxtLink>
              </span>
            </template>

            <template #footer-right>
              <div class="flex items-center gap-1.5">
                <UButton aria-label="Nuxt on X" icon="i-simple-icons-x" to="https://x.com/nuxt_js" target="_blank" v-bind="($ui.button.secondary as any)" />
                <UButton aria-label="Nuxt UI on Discord" icon="i-simple-icons-discord" to="https://discord.com/channels/473401852243869706/1153996761426300948" target="_blank" v-bind="($ui.button.secondary as any)" />
                <UButton aria-label="Nuxt UI on GitHub" icon="i-simple-icons-github" to="https://github.com/nuxt/ui" target="_blank" v-bind="($ui.button.secondary as any)" />
              </div>
            </template>

            <template #aside-top>
              <UContentSearchButton size="md" class="w-full" />
            </template>

            <template #aside-default>
              <UNavigationTree
                class="w-full h-full [&>div>div>div>nav]:border-gray-800/10 dark:[&>div>div>div>nav]:border-gray-200/10 overflow-y-auto"
                :links="navigationLinks"
              />
            </template>

            <template #page-header>
              <UPageHeader
                title="Installation"
                description="Learn how to install and configure the module in your Nuxt app."
                headline="Getting Started"
                class="!p-0 !border-0"
                :ui="{ headline: 'mb-1 text-xs', title: '!text-2xl', description: 'mt-1 text-sm' }"
              />
            </template>

            <template #page-body>
              <div class="-mt-8 prose prose-primary prose-sm dark:prose-invert max-w-none">
                <MDC :value="md" tag="div" />

              <!-- <hr class="border-gray-800/10 dark:border-gray-200/10 !mt-5"> -->
              </div>
            </template>

            <template #content-surround>
              <UContentSurround
                :surround="(surround as unknown as ParsedContent[])"
                class="w-full gap-4"
                :ui="{
                  link: {
                    wrapper: 'px-4 py-2.5 border-gray-800/10 dark:border-gray-200/10 cursor-pointer',
                    icon: {
                      wrapper: 'mb-2 p-1',
                      base: 'h-4 w-4'
                    },
                    title: 'text-sm',
                    description: 'text-xs'
                  }
                }"
              />
            </template>

            <template #content-toc>
              <div class="absolute top-0 left-0 right-0 space-y-3">
                <UContentToc :links="toc" class="bg-transparent relative max-h-full overflow-hidden top-0" :ui="({ container: { base: '!pt-0 !pb-4' } } as any)" />

                <UDivider type="dashed" :ui="{ border: { base: 'border-gray-800/10 dark:border-gray-200/10' } }" />

                <UPageLinks title="Community" :links="communityLinks" class="mt-4" />
              </div>
            </template>

            <template #landing-hero>
              <ULandingHero class="!p-0" :ui="{ title: '!text-5xl', description: 'text-base' }">
                <template #title>
                  A <span class="text-primary">UI Library</span> for<br> Modern Web Apps
                </template>

                <template #description>
                  Nuxt UI simplifies the creation of stunning and responsive web applications with its<br> comprehensive collection of fully styled and customizable UI components designed for Nuxt.
                </template>

                <template #links>
                  <UButton label="Get Started" icon="i-heroicons-rocket-launch" size="md" />

                  <UInput
                    model-value="npm i @nuxt/ui"
                    color="gray"
                    readonly
                    autocomplete="off"
                    icon="i-heroicons-command-line"
                    input-class="select-none"
                    aria-label="Install @nuxt/ui"
                    size="md"
                    :ui="{ base: 'disabled:cursor-default', icon: { trailing: { pointer: '' } } }"
                  />
                </template>
              </ULandingHero>
            </template>

            <template #landing-section>
              <ULandingSection :ui="{ title: '!text-3xl', description: 'text-base' }" class="!p-0">
                <template #title>
                  Everything you expect from a<br> <span class="text-primary">UI component library</span>
                </template>
              </ULandingSection>
            </template>

            <template #landing-card-1>
              <ULandingCard icon="i-heroicons-swatch" title="Color Palette" description="Choose a primary and a gray color from your Tailwind CSS color palette." />
            </template>
            <template #landing-card-2>
              <ULandingCard icon="i-heroicons-wrench-screwdriver" title="Fully Customizable" description="Change the style of any component in your App Config or with ui prop." />
            </template>
            <template #landing-card-3>
              <ULandingCard icon="i-heroicons-face-smile" title="Icons" description="Choose any of the 100k+ icons from the most popular icon libraries." />
            </template>
            <template #landing-card-4>
              <ULandingCard icon="i-heroicons-computer-desktop" title="Keyboard Shortcuts" description="Nuxt UI comes with a set of Vue composables to easily handle shortcuts." />
            </template>

            <template #landing-cta>
              <ULandingCTA card :links="[{ label: 'Get started', color: 'black', size: 'md' }, { label: 'Learn more', color: 'black', variant: 'link', size: 'md', trailingIcon: 'i-heroicons-arrow-right-20-solid' }]" :ui="{ title: '!text-3xl', description: 'text-base' }" class="w-full h-full rounded-md">
                <template #title>
                  Trusted and supported by our<br> amazing community
                </template>
              </ULandingCTA>
            </template>
          </HomeProDemo>
        </ULandingSection>

        <div class="h-[calc(var(--inc)*42)]" />
      </div>

      <div class="_not_screen_xl">
        <ULandingSection>
          <template #title>
            <span v-html="page.pro.landing?.title" />
          </template>
          <template #description>
            <span v-html="page.pro.landing?.description" />
          </template>
          <video preload="none" poster="https://res.cloudinary.com/nuxt/video/upload/so_14.4/v1698923423/ui-pro/nuxt-ui-pro-landing-demo_yrh6nr.jpg" controls>
            <source src="https://res.cloudinary.com/nuxt/video/upload/v1698923423/ui-pro/nuxt-ui-pro-landing-demo_yrh6nr.webm" type="video/webm">
            <source src="https://res.cloudinary.com/nuxt/video/upload/v1698923423/ui-pro/nuxt-ui-pro-landing-demo_yrh6nr.mp4" type="video/mp4">
            <source src="https://res.cloudinary.com/nuxt/video/upload/v1698923423/ui-pro/nuxt-ui-pro-landing-demo_yrh6nr.ogg" type="video/ogg">
          </video>
        </ULandingSection>
        <ULandingSection>
          <template #title>
            <span v-html="page.pro.docs?.title" />
          </template>
          <template #description>
            <span v-html="page.pro.docs?.description" />
          </template>
          <video preload="none" poster="https://res.cloudinary.com/nuxt/video/upload/v1698923398/ui-pro/nuxt-ui-pro-docs-demo_jm6ubr.jpg" controls>
            <source src="https://res.cloudinary.com/nuxt/video/upload/v1698923398/ui-pro/nuxt-ui-pro-docs-demo_jm6ubr.webm" type="video/webm">
            <source src="https://res.cloudinary.com/nuxt/video/upload/v1698923398/ui-pro/nuxt-ui-pro-docs-demo_jm6ubr.mp4" type="video/mp4">
            <source src="https://res.cloudinary.com/nuxt/video/upload/v1698923398/ui-pro/nuxt-ui-pro-docs-demo_jm6ubr.ogg" type="video/ogg">
          </video>
        </ULandingSection>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ParsedContent, NavItem } from '@nuxt/content'
import { useElementBounding, useWindowScroll, useElementSize, breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import type { HomeProBlock } from '~/types'

const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())
const { data: module } = await useFetch<{
  stats: {
    downloads: number
    stars: number
  }
  contributors: {
    username: string
  }[]
}>('https://api.nuxt.com/modules/ui', {
  transform: ({ stats, contributors }) => ({ stats, contributors })
})

const navigation = inject<Ref<NavItem[]>>('navigation')

useSeoMeta({
  titleTemplate: '',
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description,
  ogImage: 'https://ui.nuxt.com/social-card.png',
  twitterImage: 'https://ui.nuxt.com/social-card.png'
})

const source = ref('npx nuxi@latest module add ui')
const sectionRef = ref()
const demoRef = ref(null)
const start = ref(0)

const { $ui } = useNuxtApp()
const { height } = useElementSize(demoRef)
const { top } = useElementBounding(sectionRef)
const { y } = useWindowScroll()
const config = useRuntimeConfig().public
const { copy, copied } = useClipboard({ source })
const breakpoints = useBreakpoints(breakpointsTailwind)

const lgAndLarger = breakpoints.greaterOrEqual('lg')

const { format } = Intl.NumberFormat('en', { notation: 'compact' })

const steps = {
  header: 0,
  footer: 5,
  landing: 10,
  docs: 27
}

// Computed

const inc = computed(() => (height.value - 32 - 64 - 32 - 32) / 4)

const landingBlocks = computed(() => isAfterStep(steps.landing) && isBeforeStep(steps.docs)
  ? [{
      class: 'inset-x-0 top-20 bottom-20 overflow-hidden',
      inactive: true,
      children: [{
        name: 'ULandingHero',
        to: '/pro/components/landing-hero',
        class: [
          'inset-4',
          isAfterStep(steps.landing + 2) && '-top-[calc(var(--y)-var(--step-y)-1rem)] bottom-[calc(var(--y)-var(--step-y)+1rem)]'
        ].filter(Boolean).join(' '),
        style: {
          '--step-y': `${getStepY(steps.landing + 2)}px`
        },
        inactive: isAfterStep(steps.landing + 1),
        children: [{
          slot: 'landing-hero',
          class: 'inset-4'
        }]
      }, isAfterStep(steps.landing + 2) && {
        name: 'ULandingSection',
        to: '/pro/components/landing-section',
        class: [
          'inset-4',
          isBeforeStep(steps.landing + 6) && '-top-[calc(var(--y)-var(--prev-step-y)-var(--height)-1rem)] bottom-[calc(var(--y)-var(--prev-step-y)-var(--height)+1rem)]',
          isAfterStep(steps.landing + 10) && '-top-[calc(var(--y)-var(--step-y)-1rem)] bottom-[calc(var(--y)-var(--step-y)+1rem)]'
        ].filter(Boolean).join(' '),
        style: {
          '--height': (inc.value * 4) + 'px',
          '--step-y': `${getStepY(steps.landing + 10)}px`,
          '--prev-step-y': `${getStepY(steps.landing + 2)}px`
        },
        inactive: isAfterStep(steps.landing + 7),
        children: [{
          slot: 'landing-section',
          class: 'inset-x-4 top-16'
        }, {
          name: 'ULandingGrid',
          to: '/pro/components/landing-grid',
          class: ['inset-x-4 bottom-4 top-48', isAfterStep(steps.landing + 8) && 'grid grid-cols-4 gap-4 p-4'].filter(Boolean).join(' '),
          inactive: isAfterStep(steps.landing + 8),
          children: [isAfterStep(steps.landing + 9)
            ? {
                slot: 'landing-card-1',
                class: '!relative'
              }
            : {
                name: 'ULandingCard',
                to: '/pro/components/landing-card',
                class: '!relative h-full',
                inactive: false
              }, isAfterStep(steps.landing + 9)
            ? {
                slot: 'landing-card-2',
                class: '!relative h-full'
              }
            : {
                name: 'ULandingCard',
                to: '/pro/components/landing-card',
                class: '!relative h-full',
                inactive: false
              }, isAfterStep(steps.landing + 9)
            ? {
                slot: 'landing-card-3',
                class: '!relative h-full'
              }
            : {
                name: 'ULandingCard',
                to: '/pro/components/landing-card',
                class: '!relative h-full',
                inactive: false
              }, isAfterStep(steps.landing + 9)
            ? {
                slot: 'landing-card-4',
                class: '!relative h-full'
              }
            : {
                name: 'ULandingCard',
                to: '/pro/components/landing-card',
                class: '!relative h-full',
                inactive: false
              }]
        }]
      }, isAfterStep(steps.landing + 10) && {
        name: 'ULandingSection',
        to: '/pro/components/landing-section',
        class: [
          'inset-4',
          isBeforeStep(steps.landing + 14) && '-top-[calc(var(--y)-var(--prev-step-y)-var(--height)-1rem)] bottom-[calc(var(--y)-var(--prev-step-y)-var(--height)+1rem)]'
        ].filter(Boolean).join(' '),
        style: {
          '--height': (inc.value * 4) + 'px',
          '--step-y': `${getStepY(steps.landing + 18)}px`,
          '--prev-step-y': `${getStepY(steps.landing + 10)}px`
        },
        inactive: isAfterStep(steps.landing + 15),
        children: [{
          name: 'ULandingCTA',
          class: 'inset-4',
          inactive: isAfterStep(steps.landing + 16),
          children: [{
            slot: 'landing-cta',
            class: 'inset-0'
          }]
        }]
      }].filter(Boolean)
    }]
  : [])

const docsBlocks = computed(() => [isAfterStep(steps.docs) && {
  name: 'UPage',
  to: '/pro/components/page',
  class: 'inset-x-0 top-20 bottom-20',
  inactive: isAfterStep(steps.docs + 1),
  children: [isAfterStep(steps.docs + 2)
    ? {
        name: 'UAside',
        to: '/pro/components/aside',
        class: 'left-4 inset-y-4 w-64',
        inactive: isAfterStep(steps.docs + 3),
        children: [isAfterStep(steps.docs + 4)
          ? {
              slot: 'aside-top',
              class: 'inset-x-4 top-4'
            }
          : {
              name: '#top',
              class: 'inset-x-4 top-4 h-9'
            }, isAfterStep(steps.docs + 5)
          ? {
              name: 'UNavigationTree',
              to: '/pro/components/navigation-tree',
              class: ['inset-x-4 top-[4.25rem] bottom-4', isAfterStep(steps.docs + 6) && '!bg-transparent !border-0'].join(' '),
              inactive: isAfterStep(steps.docs + 6),
              children: [{
                slot: 'aside-default',
                class: 'inset-0'
              }]
            }
          : {
              name: '#default',
              class: 'inset-x-4 top-[4.25rem] bottom-4'
            }]
      }
    : {
        name: '#left',
        class: 'left-4 inset-y-4 w-64'
      }, isAfterStep(steps.docs + 7)
    ? {
        name: 'UPage',
        to: '/pro/components/page',
        class: 'left-72 right-4 inset-y-4',
        inactive: isAfterStep(steps.docs + 8),
        children: [...(isAfterStep(steps.docs + 9)
          ? [{
              name: 'UPageHeader',
              to: '/pro/components/page-header',
              class: 'top-4 left-4 right-72 h-32',
              inactive: isAfterStep(steps.docs + 10),
              children: [{
                slot: 'page-header',
                class: 'inset-4 justify-start'
              }]
            }, {
              name: 'UPageBody',
              to: '/pro/components/page-body',
              class: 'top-40 left-4 right-72 bottom-4 overflow-y-auto',
              inactive: isAfterStep(steps.docs + 11),
              children: [{
                slot: 'page-body',
                class: 'inset-x-4 top-4 justify-start'
              }, isAfterStep(steps.docs + 12)
                ? {
                    slot: 'content-surround',
                    class: 'bottom-4 inset-x-4 h-28'
                  }
                : {
                    name: 'UContentSurround',
                    to: '/pro/components/content-surround',
                    class: 'bottom-4 inset-x-4 h-28',
                    inactive: false
                  }]
            }]
          : [{
              name: '#default',
              class: 'left-4 right-72 inset-y-4'
            }]), isAfterStep(steps.docs + 13)
          ? {
              name: 'UContentToc',
              to: '/pro/components/content-toc',
              class: 'right-4 inset-y-4 w-64',
              inactive: isAfterStep(steps.docs + 14),
              children: [{
                slot: 'content-toc',
                class: 'inset-4 overflow-y-auto'
              }]
            }
          : {
              name: '#right',
              class: 'right-4 inset-y-4 w-64'
            }]
      }
    : {
        name: '#default',
        class: 'left-72 right-4 inset-y-4'
      }]
}].filter(Boolean))

const blocks = computed(() => [isAfterStep(steps.header) && {
  name: 'UHeader',
  to: '/pro/components/header',
  class: 'h-16 inset-x-0 top-0',
  inactive: isAfterStep(steps.header + 1),
  children: [isAfterStep(steps.header + 2)
    ? {
        slot: 'header-left',
        class: 'left-4 top-4'
      }
    : {
        name: '#left',
        class: 'left-4 inset-y-4 w-64'
      }, isAfterStep(steps.header + 3)
    ? {
        slot: 'header-center',
        class: 'inset-x-72 top-5'
      }
    : {
        name: '#center',
        class: 'inset-x-72 inset-y-4'
      }, isAfterStep(steps.header + 4)
    ? {
        slot: 'header-right',
        class: 'right-4 top-4'
      }
    : {
        name: '#right',
        class: 'right-4 inset-y-4 w-64'
      }]
}, isAfterStep(steps.footer) && {
  name: 'UFooter',
  to: '/pro/components/footer',
  class: 'h-16 inset-x-0 bottom-0',
  inactive: isAfterStep(steps.footer + 1),
  children: [isAfterStep(steps.footer + 2)
    ? {
        slot: 'footer-left',
        class: 'left-4 bottom-5'
      }
    : {
        name: '#left',
        class: 'left-4 inset-y-4 w-64'
      }, isAfterStep(steps.footer + 3)
    ? {
        slot: 'footer-center',
        class: 'inset-x-72 bottom-5'
      }
    : {
        name: '#center',
        class: 'inset-x-72 inset-y-4'
      }, isAfterStep(steps.footer + 4)
    ? {
        slot: 'footer-right',
        class: 'right-4 bottom-4'
      }
    : {
        name: '#right',
        class: 'right-4 inset-y-4 w-64'
      }]
}, ...landingBlocks.value, ...docsBlocks.value].filter(Boolean))

// Methods

function isBeforeStep(i = 0) {
  return y.value < (start.value + (i * inc.value))
}

function isAfterStep(i = 0) {
  return y.value >= (start.value + (i * inc.value))
}

function getStepY(step: number) {
  return start.value + (step * inc.value)
}

// Hooks

onMounted(() => {
  setTimeout(() => {
    start.value = top.value + y.value
  }, 100)
})

// Slots Data

const headerLinks = [{
  label: 'Documentation',
  active: true
}, {
  label: 'Playground'
}, {
  label: 'Roadmap'
}, {
  label: 'Pro'
}]

const navigationLinks = [{
  label: 'Getting Started',
  children: [{
    label: 'Introduction'
  }, {
    label: 'Installation',
    active: true
  }, {
    label: 'Theming'
  }, {
    label: 'Shortcuts'
  }, {
    label: 'Examples'
  }, {
    label: 'Roadmap'
  }]
}, {
  label: 'Elements',
  children: [{
    label: 'Alert'
  }, {
    label: 'Avatar'
  }, {
    label: 'Badge'
  }, {
    label: 'Button'
  }]
}]

const surround = [{
  title: 'Introduction',
  description: 'Fully styled and customizable components for Nuxt.',
  _path: '/'
}, {
  title: 'Theming',
  description: 'Learn how to customize the look and feel of the components.',
  _path: '/'
}]

const md = `
## Edge

To use the latest updates pushed on the [\`dev\`](https://github.com/nuxt/ui/tree/dev) branch, you can use \`@nuxt/ui-edge\`.
`

const toc = [{
  id: 'quick-start',
  depth: 2,
  text: 'Quick Start'
}, {
  id: 'intellisense',
  depth: 2,
  text: 'IntelliSense'
}, {
  id: 'options',
  depth: 2,
  text: 'Options'
}, {
  id: 'edge',
  depth: 2,
  text: 'Edge'
}]

const communityLinks = [{
  icon: 'i-heroicons-pencil-square',
  label: 'Edit this page'
}, {
  icon: 'i-heroicons-star',
  label: 'Star on GitHub',
  to: 'https://github.com/nuxt/ui',
  target: '_blank'
}, {
  icon: 'i-heroicons-book-open',
  label: 'Nuxt documentation',
  to: 'https://nuxt.com',
  target: '_blank'
}]
</script>

<style scoped lang="postcss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

._screen_xl {
  display: none;
}
@media (min-width: 1280px) and (min-height: 955px) {
  ._screen_xl {
    display: block;
  }
  ._not_screen_xl {
    display: none;
  }
}
</style>
