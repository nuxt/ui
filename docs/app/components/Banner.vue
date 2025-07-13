<template>
  <UBanner
    id="nuxtlabs-join-vercel"
    title="NuxtLabs is joining Vercel"
    icon="i-simple-icons-vercel"
    to="https://nuxtlabs.com/?utm_source=nuxt-ui&utm_medium=banner&utm_campaign=nuxtlabs-vercel"
    target="_blank"
    close
    :actions="[{
      label: 'Read the announcement',
      color: 'neutral',
      variant: 'outline',
      trailingIcon: 'i-lucide-arrow-right',
      to: 'https://nuxtlabs.com/?utm_source=nuxt-ui&utm_medium=banner&utm_campaign=nuxtlabs-vercel',
      target: '_blank',
      class: 'ring-0'
    }]"
  />
</template>
