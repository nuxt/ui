<script setup lang="ts">
const studioIcons = useStudioIcons()
</script>

<template>
  <UEmpty
    :icon="studioIcons.landmark"
    title="Connect your bank"
    description="Link your account to receive monthly payouts automatically."
    :actions="[{ label: 'Set up payouts', icon: studioIcons.plug }]"
    variant="naked"
  />
</template>
