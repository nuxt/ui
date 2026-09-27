<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import tailwindColors from 'tailwindcss/colors'

// Switches a palette at runtime by writing the alias's shades on the root element
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

const primary = useState('theme-dropdown-primary', () => 'green')
const neutral = useState('theme-dropdown-neutral', () => 'slate')

function setAlias(alias: 'primary' | 'neutral', palette: string) {
  const shade = (tailwindColors as Record<string, Record<number, string>>)[palette]
  if (!shade) return
  for (const stop of shades) {
    const value = shade[stop]
    if (value) document.documentElement.style.setProperty(`--ui-color-${alias}-${stop}`, value)
  }
}

const colors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']
const neutrals = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'taupe', 'mauve', 'mist', 'olive']

const items = computed<DropdownMenuItem[]>(() => [{
  label: 'Primary',
  chip: primary.value,
  children: colors.map(color => ({
    label: color,
    chip: color,
    checked: primary.value === color,
    type: 'checkbox',
    onSelect: (e) => {
      e.preventDefault()

      primary.value = color
      setAlias('primary', color)
    }
  }))
}, {
  label: 'Neutral',
  chip: neutral.value === 'neutral' ? 'old-neutral' : neutral.value,
  children: neutrals.map(color => ({
    label: color,
    chip: color === 'neutral' ? 'old-neutral' : color,
    type: 'checkbox',
    checked: neutral.value === color,
    onSelect: (e) => {
      e.preventDefault()

      neutral.value = color
      setAlias('neutral', color)
    }
  }))
}])
</script>

<template>
  <UDropdownMenu :items="items" :content="{ side: 'right', align: 'start' }">
    <UButton
      icon="i-lucide-swatch-book"
      color="neutral"
      variant="ghost"
      class="data-[state=open]:bg-elevated"
      aria-label="Switch theme"
    />

    <template #item-leading="{ item }">
      <div class="inline-flex items-center justify-center shrink-0 size-5">
        <span
          class="rounded-full ring ring-bg bg-(--chip-light) dark:bg-(--chip-dark) size-2"
          :style="{
            '--chip-light': `var(--color-${(item as any).chip}-500)`,
            '--chip-dark': `var(--color-${(item as any).chip}-400)`
          }"
        />
      </div>
    </template>
  </UDropdownMenu>
</template>
