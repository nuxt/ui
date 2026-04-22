<script setup>
import { useAppConfig } from "#imports";
import Callout from "../Callout.vue";
const appConfig = useAppConfig();
</script>

<template>
  <Callout color="error" :icon="appConfig.ui.icons.caution">
    <slot mdc-unwrap="p" />
  </Callout>
</template>
