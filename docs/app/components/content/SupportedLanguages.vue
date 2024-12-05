<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const props = withDefaults(defineProps<{
  default?: string
}>(), {
  default: 'en'
})

function getEmojiFlag(locale: string): string {
  // Map language codes to default country codes
  const languageToCountry: Record<string, string> = {
    en: 'gb',
    ar: 'sa',
    cs: 'cz',
    zh: 'cn',
    ja: 'jp',
    ko: 'kr'
  }

  // Get base language code before any region specifier
  const baseLanguage = locale.split('-')[0]?.toLowerCase() || locale

  // Use mapped country code or extract from locale if it contains a region
  const countryCode = languageToCountry[baseLanguage] || locale.replace(/^.*-/, '').slice(0, 2)

  return countryCode
    .split('')
    .map((char: string) => {
      const codePoint = char.toUpperCase().codePointAt(0)
      return codePoint ? String.fromCodePoint(0x1F1A5 + codePoint) : ''
    })
    .join('')
}
</script>

<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <div>
    <ProseP>
      By default, the <ProseCode>{{ props.default }}</ProseCode> locale is used.
    </ProseP>
    <div class="grid gap-6 grid-cols-2 md:grid-cols-3">
      <div v-for="locale in locales" :key="locale.code">
        <div class="flex gap-3 items-center">
          <UAvatar size="xl">
            {{ getEmojiFlag(locale.code) }}
          </UAvatar>

          <div class="text-sm">
            <div class="font-semibold">{{ locale.name }}</div>
            <div class="mt-1">Code: <ProseCode class="text-xs">{{ locale.code }}</ProseCode></div>
          </div>
        </div>
      </div>
    </div>
    <ProseNote to="https://github.com/nuxt/ui/tree/v3/src/runtime/locale" target="_blank">
      If you need additional languages, you can contribute by creating a PR to add a new locale in <ProseCode>src/runtime/locale/</ProseCode>.
    </ProseNote>
    <ProseTip>
      You can use the <ProseCode>nuxt-ui</ProseCode> CLI to create a new locale:

      <ProsePre language="bash">nuxt-ui make locale --code "en" --name "English"</ProsePre>
    </ProseTip>
  </div>
</template>
