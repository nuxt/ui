<script setup lang="ts">
const { data: page } = await useAsyncData('team', () => queryCollection('team').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title: page.value.title,
  description: page.value.description,
  ogTitle: `${page.value.title} - Nuxt UI`,
  ogDescription: page.value.description
})

useCanonical()

if (import.meta.server) {
  defineOgImage('Docs.takumi', {
    title: page.value.title,
    description: page.value.description
  })
}

const [{ data: module }, { data: github }] = await Promise.all([
  useFetch('/api/module.json'),
  useFetch('/api/github/contributors.json')
])

const { format } = Intl.NumberFormat('en')
const { format: formatCompact } = Intl.NumberFormat('en', { notation: 'compact' })

// Every human contributor on GitHub, the round figure when the server had no
// token to count them.
const total = computed(() => (github.value?.total ? format(github.value.total) : '300+'))

const stats = computed(() => [{
  value: `${formatCompact(module.value?.stats?.downloads ?? 0)}+`,
  label: 'monthly downloads',
  to: 'https://npm.chart.dev/@nuxt/ui'
}, {
  value: `${formatCompact(module.value?.stats?.stars ?? 0)}+`,
  label: 'GitHub stars',
  to: 'https://github.com/nuxt/ui'
}, {
  value: total.value,
  label: 'contributors',
  to: 'https://github.com/nuxt/ui/graphs/contributors'
}])

const SOCIAL_ICONS: Record<string, string> = {
  twitter: 'i-simple-icons-x',
  bluesky: 'i-simple-icons-bluesky',
  linkedin: 'i-simple-icons-linkedin',
  mastodon: 'i-simple-icons-mastodon',
  youtube: 'i-simple-icons-youtube',
  twitch: 'i-simple-icons-twitch',
  instagram: 'i-simple-icons-instagram',
  facebook: 'i-simple-icons-facebook',
  reddit: 'i-simple-icons-reddit',
  npm: 'i-simple-icons-npm'
}

const people = computed(() => (github.value?.contributors ?? []).map((contributor, index) => {
  const name = contributor.name || contributor.username

  return {
    ...contributor,
    name,
    rank: String(index + 1).padStart(2, '0'),
    links: [
      ...(contributor.socialAccounts ?? []).map(account => ({
        icon: SOCIAL_ICONS[account.provider] ?? 'i-lucide-link',
        to: account.url,
        label: `${name} on ${account.provider}`
      })),
      { icon: 'i-simple-icons-github', to: `https://github.com/${contributor.username}`, label: `${name} on GitHub` },
      ...(contributor.websiteUrl ? [{ icon: 'i-lucide-link', to: contributor.websiteUrl, label: `${name}'s website` }] : [])
    ]
  }
}))
</script>

<template>
  <main v-if="page">
    <section class="relative overflow-hidden border-b border-default">
      <!-- A dot grid fading out from the top center, with the primary glow behind the title. -->
      <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(var(--ui-border-accented)_1px,transparent_1px)] bg-[size:28px_28px] opacity-55 [mask-image:radial-gradient(70%_80%_at_50%_0%,black,transparent_70%)]" />
      <div class="absolute -top-70 left-1/2 -translate-x-1/2 w-[1000px] h-[540px] pointer-events-none bg-radial from-primary/20 to-transparent to-70%" />

      <UContainer class="relative max-w-7xl pt-20 sm:pt-25 flex flex-col gap-6">
        <UBadge
          color="neutral"
          variant="outline"
          size="lg"
          icon="i-lucide-git-pull-request-arrow"
          label="Built in the open · MIT licensed"
          class="self-start rounded-full bg-default font-medium text-muted"
          :ui="{ leadingIcon: 'text-primary' }"
        />

        <h1 class="max-w-[900px] text-6xl sm:text-8xl lg:text-[112px] font-extrabold leading-[.92] tracking-tighter text-highlighted">
          Meet the <span class="font-[family-name:Instrument_Serif] font-normal italic tracking-tight text-primary">Team</span>
        </h1>

        <p class="max-w-[520px] text-lg sm:text-[19px] leading-relaxed text-muted text-pretty">
          {{ page.hero.description }}
        </p>
      </UContainer>

      <UContainer class="relative max-w-7xl mt-16 sm:mt-22 pb-8 flex flex-wrap items-end gap-x-12 gap-y-8 lg:gap-x-16">
        <NuxtLink
          v-for="stat in stats"
          :key="stat.label"
          :to="stat.to"
          target="_blank"
          class="group flex flex-col gap-1.5 focus-visible:outline-primary"
        >
          <span class="text-4xl sm:text-5xl lg:text-[52px] font-bold leading-[.9] tracking-[-.045em] tabular-nums text-highlighted group-hover:text-primary transition-colors">
            {{ stat.value }}
          </span>
          <span class="text-xs font-medium uppercase tracking-widest text-muted whitespace-nowrap">
            {{ stat.label }}
          </span>
        </NuxtLink>

        <span class="ms-auto text-xs text-muted whitespace-nowrap">From GitHub and npm</span>
      </UContainer>
    </section>

    <UContainer class="max-w-7xl pt-16 lg:pt-19">
      <div class="flex items-baseline gap-3.5 mb-1.5">
        <h2 class="text-xs font-medium uppercase tracking-widest text-muted whitespace-nowrap">
          Everyone who ships it
        </h2>
        <span class="flex-1 h-px bg-(--ui-border) mb-1" />
        <span class="text-xs text-muted whitespace-nowrap">{{ people.length }} people · by contributions</span>
      </div>

      <ul>
        <li
          v-for="person in people"
          :key="person.username"
          class="flex items-center gap-4 sm:gap-6 py-4 sm:py-5 px-2 sm:px-3 border-b border-default hover:bg-elevated/50 transition-colors"
        >
          <span class="hidden sm:block w-5.5 shrink-0 font-mono text-xs text-muted">{{ person.rank }}</span>

          <UAvatar
            :src="`https://ipx.nuxt.com/f_auto,s_104x104/gh_avatar/${person.username}`"
            :srcset="`https://ipx.nuxt.com/f_auto,s_208x208/gh_avatar/${person.username} 2x`"
            :alt="`${person.name} avatar`"
            size="3xl"
            class="size-13 shrink-0 ring ring-default"
            loading="lazy"
          />

          <div class="flex-1 md:flex-none md:w-72 min-w-0 flex flex-col gap-0.5">
            <span class="text-lg sm:text-xl font-bold leading-tight tracking-tight text-highlighted truncate">{{ person.name }}</span>
            <span v-if="person.location" class="flex items-center gap-1.5 text-[13px] text-muted whitespace-nowrap">
              <UIcon name="i-lucide-map-pin" class="size-3 text-dimmed" />
              {{ person.location }}
            </span>
          </div>

          <div class="hidden md:flex gap-0.5">
            <UButton
              v-for="link in person.links"
              :key="link.to"
              :to="link.to"
              :icon="link.icon"
              :aria-label="link.label"
              target="_blank"
              color="neutral"
              variant="ghost"
              size="sm"
              square
              class="text-muted hover:text-highlighted"
            />
          </div>

          <div class="ms-auto flex items-baseline gap-2 shrink-0">
            <span class="text-lg sm:text-[22px] font-bold leading-none tracking-tight tabular-nums text-highlighted">{{ format(person.contributions) }}</span>
            <span class="text-xs text-muted whitespace-nowrap">contributions</span>
          </div>

          <!-- The slot is reserved even without a listing so the counts line up. -->
          <div class="hidden sm:flex justify-end w-24 shrink-0">
            <UButton
              v-if="person.sponsorsListing"
              :to="person.sponsorsListing"
              target="_blank"
              color="neutral"
              variant="outline"
              size="sm"
              icon="i-lucide-heart"
              label="Sponsor"
              class="rounded-[10px] hover:bg-pink-500/5 hover:ring-pink-500/30 hover:text-pink-600 dark:hover:text-pink-400"
              :ui="{ leadingIcon: 'text-pink-500' }"
            />
          </div>
        </li>
      </ul>

      <div class="flex justify-center pt-6.5">
        <UButton
          :label="`See all ${total} contributors`"
          trailing-icon="i-lucide-arrow-right"
          to="https://github.com/nuxt/ui/graphs/contributors"
          target="_blank"
          color="neutral"
          variant="outline"
          size="lg"
          class="rounded-[10px]"
          :ui="{ trailingIcon: 'text-dimmed' }"
        />
      </div>
    </UContainer>

    <UContainer class="max-w-7xl py-18 lg:pb-26">
      <div class="relative overflow-hidden rounded-[22px] border border-default bg-linear-to-b from-(--ui-bg) to-(--ui-bg-elevated)/60 px-8 py-10 sm:px-13 sm:py-12 flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-10">
        <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(var(--ui-border-accented)_1px,transparent_1px)] bg-[size:26px_26px] opacity-50 [mask-image:radial-gradient(80%_120%_at_90%_50%,black,transparent_70%)]" />

        <div class="relative flex flex-col gap-2">
          <h2 class="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-highlighted">
            {{ total }} people have shipped Nuxt UI
          </h2>
          <p class="text-[15px] text-muted">
            Issues, docs, translations and pull requests all count.
          </p>
        </div>

        <div class="relative lg:ms-auto flex flex-wrap gap-2.5 shrink-0">
          <UButton
            size="lg"
            icon="i-simple-icons-github"
            label="Contribute"
            to="https://github.com/nuxt/ui"
            target="_blank"
            class="rounded-[11px]"
          />
          <UButton
            size="lg"
            color="neutral"
            variant="outline"
            icon="i-lucide-heart"
            label="Become a sponsor"
            to="https://github.com/sponsors/benjamincanac"
            target="_blank"
            class="rounded-[11px]"
            :ui="{ leadingIcon: 'text-pink-500' }"
          />
        </div>
      </div>
    </UContainer>
  </main>
</template>
