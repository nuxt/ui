<script setup lang="ts">
import { THEME_DEFAULTS } from '../../../utils/theme/engine/types'

/** The radius select; `--ui-radius` is a rem length, so the stop IS the label. */
defineProps<{ vertical?: boolean }>()

const { radius, radiuses } = useTheme()
const { groupDirtyFlags } = useThemeStudioToolbar()
const studioIcons = useStudioIcons()

const items = radiuses.map(value => ({ label: `${value}rem`, value }))

// The saved radius is client-only: report the stock stop until mounted, like
// the other triggers, so hydration adopts the server's label.
const mounted = useMounted()
const selected = computed({
  get: () => (mounted.value ? radius.value : THEME_DEFAULTS.radius),
  set: (value: number) => (radius.value = value)
})
</script>

<template>
  <ThemeStudioToolbarSelect
    v-model="selected"
    :items="items"
    :icon="studioIcons.radius"
    :dirty="groupDirtyFlags.radius.value"
    aria-label="Radius"
    :vertical="vertical"
    :class="vertical ? 'w-full' : 'w-38'"
  />
</template>
