<script setup>
import { useAppConfig } from "#imports";
import Callout from "../Callout.vue";
const appConfig = useAppConfig();
</script>

<template>
  <Callout color="warning" :icon="appConfig.ui.icons.warning">
    <slot mdc-unwrap="p" />
  </Callout>
</template>
