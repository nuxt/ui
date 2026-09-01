<script setup lang="ts">
/** The radius select; `--ui-radius` is a rem length, so the stop IS the label. */
defineProps<{ vertical?: boolean }>()

const { radius, radiuses } = useTheme()
const { groupDirtyFlags } = useThemeStudioToolbar()
const studioIcons = useStudioIcons()

const items = radiuses.map(value => ({ label: `${value}rem`, value }))
</script>

<template>
  <ThemeStudioToolbarSelect
    v-model="radius"
    :items="items"
    :icon="studioIcons.radius"
    :dirty="groupDirtyFlags.radius.value"
    aria-label="Radius"
    :class="vertical ? 'w-full' : 'w-38'"
  />
</template>
