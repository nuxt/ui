<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const props = withDefaults(defineProps<{
  default?: string
}>(), {
  default: 'en'
})

function getEmojiFlag(locale: string): string {
  const languageToCountry: Record<string, string> = {
    ar: 'sa', // Arabic -> Saudi Arabia
    bn: 'bd', // Bengali -> Bangladesh
    ca: 'es', // Catalan -> Spain
    ckb: 'iq', // Central Kurdish -> Iraq
    cs: 'cz', // Czech -> Czech Republic (note: modern country code is actually 'cz')
    da: 'dk', // Danish -> Denmark
    el: 'gr', // Greek -> Greece
    en: 'gb', // English -> Great Britain
    et: 'ee', // Estonian -> Estonia
    he: 'il', // Hebrew -> Israel
    hi: 'in', // Hindi -> India
    hy: 'am', // Armenian -> Armenia
    ja: 'jp', // Japanese -> Japan
    km: 'kh', // Khmer -> Cambodia
    ko: 'kr', // Korean -> South Korea
    nb: 'no', // Norwegian Bokmål -> Norway
    sv: 'se', // Swedish -> Sweden
    uk: 'ua', // Ukrainian -> Ukraine
    ur: 'pk', // Urdu -> Pakistan
    vi: 'vn' // Vietnamese -> Vietnam
  }

  const baseLanguage = locale.split('-')[0]?.toLowerCase() || locale
  const countryCode = languageToCountry[baseLanguage] || locale.replace(/^.*-/, '').slice(0, 2)

  return countryCode.toUpperCase()
    .split('')
    .map(char => String.fromCodePoint(0x1F1A5 + char.charCodeAt(0)))
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
