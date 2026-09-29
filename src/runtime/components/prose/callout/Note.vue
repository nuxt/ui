<script setup lang="ts">
import Callout from '../Callout.vue'
import { useThemeConfig } from '../../../composables/useComponentProps'

const appConfig = useThemeConfig()
</script>

<template>
  <Callout color="info" :icon="appConfig.ui.icons.info">
    <slot mdc-unwrap="p" />
  </Callout>
</template>
