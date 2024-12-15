<script setup lang="ts">
import { Slot } from 'reka-ui'
</script>

<template>
  <Slot class="ui-only">
    <slot name="ui" />
  </Slot>
  <Slot class="ui-pro-only">
    <slot name="ui-pro" />
  </Slot>
</template>
