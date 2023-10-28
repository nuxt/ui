<template>
  <UMain>
    <ULandingHero>
      <template #top>
        <svg class="hidden dark:block absolute inset-0 -z-10 h-full w-full stroke-white/5 [mask-image:radial-gradient(100%_100%_at_top,white,transparent)]" aria-hidden="true">
          <defs>
            <pattern
              id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
              width="200"
              height="200"
              x="50%"
              y="-1"
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y="-1" class="overflow-visible fill-gray-800/20">
            <path d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z" stroke-width="0" />
          </svg>
          <rect width="100%" height="100%" stroke-width="0" fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" />
        </svg>

        <svg class="dark:hidden absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top,white,transparent)]" aria-hidden="true">
          <defs>
            <pattern
              id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
              width="200"
              height="200"
              x="50%"
              y="-1"
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" stroke-width="0" fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)" />
        </svg>

        <div class="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)] right-0" aria-hidden="true">
          <div class="aspect-[1108/632] w-full bg-gradient-to-r from-[rgb(var(--color-primary-DEFAULT))] to-white/20 opacity-20" style="clip-path: polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)" />
        </div>
      </template>

      <template #badges>
        <UBadge color="primary" size="lg" variant="subtle">
          Coming Soon 🚀
        </UBadge>
      </template>

      <template #links>
        <UButton
          trailing-icon="i-heroicons-arrow-right"
          color="gray"
          size="md"
          variant="solid"
          to="https://ui.nuxt.com/pro/purchase"
        >
          Early access
        </UButton>
      </template>

      <template #title>
        The <span class="text-primary">Building Blocks</span> for<br>Modern Web Apps
      </template>

      <template #description>
        Nuxt UI Pro is a collection of premium components built on top of Nuxt UI to create beautiful & responsive Nuxt applications in minutes.<br>It includes all primitives to build landing pages, documentation, blogs, changelog, dashboards or entire SaaS products.
      </template>

      <MDC
        :value="pro.code"
        tag="pre"
        class="prose prose-primary dark:prose-invert max-w-none -mt-6"
      />
    </ULandingHero>
  </UMain>
</template>

<script setup>
const title = 'Nuxt UI Pro: The Building Blocks for Modern Web Apps'
const description = 'Nuxt UI Pro is a collection of premium components built on top of Nuxt UI to create beautiful & responsive Nuxt applications in minutes. It includes all primitives to build landing pages, marketing pages, blogs, documentations or entire SaaS products.'

useSeoMeta({
  titleTemplate: '',
  title: title,
  ogTitle: `${title} - Nuxt UI`,
  description: description,
  ogDescription: description
})
</script>
