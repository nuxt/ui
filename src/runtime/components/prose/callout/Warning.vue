<script setup lang="ts">
import Callout from '../Callout.vue'
import { useThemeConfig } from '../../../composables/useComponentProps'

const appConfig = useThemeConfig()
</script>

<template>
  <Callout color="warning" :icon="appConfig.ui.icons.warning">
    <slot mdc-unwrap="p" />
  </Callout>
</template>
