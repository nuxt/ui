<script setup lang="ts">
const appConfig = useAppConfig()
const studioIcons = useStudioIcons()
</script>

<template>
  <UBanner
    id="nuxt-ui-v5-alpha"
    title="Nuxt UI v5 is available in alpha!"
    to="/docs/getting-started/migration/v5"
    :icon="studioIcons.rocket"
    close
    :actions="[{
      label: 'Follow the progress',
      color: 'neutral',
      variant: 'outline',
      trailingIcon: appConfig.ui.icons.arrowRight,
      to: 'https://github.com/nuxt/ui/issues/6918',
      target: '_blank',
      class: 'ring-0'
    }]"
  />
</template>
