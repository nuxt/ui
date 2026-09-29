<script setup lang="ts">
import Callout from '../Callout.vue'
import { useThemeConfig } from '../../../composables/useComponentProps'

const appConfig = useThemeConfig()
</script>

<template>
  <Callout color="success" :icon="appConfig.ui.icons.tip">
    <slot mdc-unwrap="p" />
  </Callout>
</template>
