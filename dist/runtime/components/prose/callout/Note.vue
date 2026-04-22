<script setup>
import { useAppConfig } from "#imports";
import Callout from "../Callout.vue";
const appConfig = useAppConfig();
</script>

<template>
  <Callout color="info" :icon="appConfig.ui.icons.info">
    <slot mdc-unwrap="p" />
  </Callout>
</template>
