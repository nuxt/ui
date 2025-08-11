<script setup lang="ts">
const testimonials = ref([
  {
    user: {
      name: 'Evan You',
      description: 'Author of Vue.js and Vite',
      avatar: {
        src: 'https://avatars.githubusercontent.com/u/499550?v=4',
        alt: 'Evan You'
      }
    },
    quote: 'Nuxt on Cloudflare infra with minimal effort - this is huge!'
  },
  {
    user: {
      name: 'Igor Minar',
      description: 'Software Engineer at Cloudflare',
      avatar: {
        src: 'https://avatars.githubusercontent.com/u/216296?v=4',
        alt: 'Igor Minar'
      }
    },
    quote: 'I love the polish and the batteries-included approach. NuxtHub takes web framework and hosting integration to a new level!'
  },
  {
    user: {
      name: 'Charlie Hield',
      description: 'Senior Creative Technologist',
      avatar: {
        src: 'https://avatars.githubusercontent.com/u/527849?v=4',
        alt: 'Charlie Hield'
      }
    },
    quote: 'NuxtHub is hands down the easiest way to get a project from zero to production on the Cloudflare stack!'
  },
  {
    user: {
      name: 'Israel Ortuño',
      description: 'Co-founder of VueJobs',
      avatar: {
        src: 'https://avatars.githubusercontent.com/u/1769417?v=4',
        alt: 'Israel Ortuño'
      }
    },
    quote: 'I can\'t find an excuse to not go full-stack with Nuxt from now on. Ship fast the Nuxt way, zero config. Just plug & deploy.'
  },
  {
    user: {
      name: 'Fayaz Ahmed',
      description: 'Indie Hacker',
      avatar: {
        src: 'https://avatars.githubusercontent.com/u/15716057?v=4',
        alt: 'Fayaz Ahmed'
      }
    },
    quote: 'Took me less than 90 seconds to deploy an app with DB, KV, File storage and Caching, all on the edge with just a single command.'
  },
  {
    user: {
      name: 'Tommy J. Vedvik',
      description: 'UX Developer',
      avatar: {
        src: 'https://avatars.githubusercontent.com/u/48070?v=4',
        alt: 'Tommy J. Vedvik'
      }
    },
    quote: 'Nuxt is becoming the best framework for bootstrappers imo. NuxtHub is a layer on top of Cloudflare services for cheap & fast full-stack edge hosting.'
  },
  {
    user: {
      name: 'Dario Piotrowicz',
      description: 'Web Developer at Cloudflare',
      avatar: {
        src: 'https://avatars.githubusercontent.com/u/61631103?v=4',
        alt: 'Dario Piotrowicz'
      }
    },
    quote: 'I love how NuxtHub combines, amplifies and simplifies the Cloudflare tooling with the wide and mature Nuxt ecosystem. I cannot wait to see how it will evolve and expand in the future!'
  },
  {
    user: {
      name: 'Markus Oberlehner',
      description: 'Web Developer',
      avatar: {
        src: 'https://avatars.githubusercontent.com/u/6883314?v=4',
        alt: 'Markus Oberlehner'
      }
    },
    quote: 'Just deployed my first site to Cloudflare using NuxtHub. Very sleek experience!'
  },
  {
    user: {
      name: 'Anthony Fu',
      description: 'Core team Vue.js, Vite & Nuxt',
      avatar: {
        src: 'https://avatars.githubusercontent.com/u/11247099?v=4',
        alt: 'Anthony Fu'
      }
    },
    quote: 'It\'s amazing to be able to run a single command and get existing Nuxt project deployed on edge within minutes! It felt like unlocking the missing infrastructure and UI for Cloudflare, enhancing the developer experience in such an extraordinary way.'
  },
  {
    user: {
      name: 'Jonathan Beckman',
      description: 'Founder of GuaranTee Time',
      avatar: {
        src: 'https://avatars.githubusercontent.com/u/90707158?v=4',
        alt: 'Jonathan Beckman'
      }
    },
    quote: 'NuxtHub and Cloudflare are my go to for full stack apps. The DX is joyous and far superior to any other platform I\'ve used. My team is able to iterate quickly, and build beautiful, performant apps with ease.'
  },
  {
    user: {
      name: 'Eckhardt Dreyer',
      description: 'Lead Developer at YG',
      avatar: {
        src: 'https://avatars.githubusercontent.com/u/37825447?v=4',
        alt: 'Eckhardt Dreyer'
      }
    },
    quote: 'At YG, our team recently grew and that meant more seats on all the tools we use. Migrating our hosting workflow to NuxtHub not only took just a few minutes but saved us money from our previous provider. NuxtHub provides an excellent management layer on top of our infrastructure and we\'re super happy about the move!'
  }
])
</script>

<template>
  <UPageColumns>
    <UPageCard
      variant="solid"
      to="https://cloudflare.com"
      icon="i-logos-cloudflare-icon"
      title="Cloudflare's Workers LaunchPad"
      description="NuxtHub is part of the Cloudflare's Workers Launchpad Cohort to make sure you get a first-class experience on top of Cloudflare's network."
      :ui="{ leadingIcon: 'size-10' }"
    />

    <UPageCard
      v-for="(testimonial, index) in testimonials"
      :key="index"
      variant="subtle"
      :description="testimonial.quote"
      :ui="{ description: 'before:content-[open-quote] after:content-[close-quote]' }"
    >
      <template #footer>
        <UUser v-bind="testimonial.user" size="xl" />
      </template>
    </UPageCard>
  </UPageColumns>
</template>
