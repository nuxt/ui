<script setup lang="ts">
import Callout from '../Callout.vue'
import { useThemeConfig } from '../../../composables/useComponentProps'

const appConfig = useThemeConfig()
</script>

<template>
  <Callout color="error" :icon="appConfig.ui.icons.caution">
    <slot mdc-unwrap="p" />
  </Callout>
</template>
