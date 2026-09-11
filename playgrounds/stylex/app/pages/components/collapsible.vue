<script setup lang="ts">
import { useAppConfig } from '#imports'

const pg = usePg()

const appConfig = useAppConfig()
</script>

<template>
  <Navbar />

  <UCollapsible :class="pg.flex_flex_col_gap_2_w_48">
    <UButton
      :class="pg.group"
      icon="i-lucide-lightbulb"
      :trailing-icon="appConfig.ui.icons.chevronDown"
      color="neutral"
      variant="outline"
      label="Open"
      block
      :ui="{ trailingIcon: pg.group_data_state_open_rotate_180_transition_transform_duration_200 }"
    />

    <template #content>
      <Placeholder :class="pg.h_48_w_full" />
    </template>
  </UCollapsible>
</template>
