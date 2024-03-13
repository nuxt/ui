<script lang="ts">
export interface IconProps {
  name: string
}
</script>

<script setup lang="ts">
defineProps<IconProps>()
</script>

<template>
  <Icon :name="name" />
</template>
