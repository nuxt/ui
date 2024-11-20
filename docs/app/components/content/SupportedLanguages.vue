<script setup lang="ts">
import type { Locale } from '@nuxt/ui'
import * as locales from '@nuxt/ui/locale'

type LocaleKey = keyof typeof locales
type LocaleComputed = Locale & { flag: string }

const props = withDefaults(defineProps<{
  default?: string
}>(), {
  default: 'en'
})

const countries = await $fetch('/api/locales.json')

const getLocaleKeys = Object.keys(locales) as LocaleKey[]
const localesList = getLocaleKeys.map<LocaleComputed>((code) => {
  const locale: Locale = locales[code]

  return {
    ...locale,
    flag: countries[locale.code] || ''
  }
})
</script>

<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <div>
    <ProseP>
      By default, the <ProseCode>{{ props.default }}</ProseCode> locale is used.
    </ProseP>

    <div class="grid gap-6 grid-cols-2 md:grid-cols-3">
      <div v-for="locale in localesList" :key="locale.code">
        <div class="flex gap-3 items-center">
          <UAvatar :text="locale.flag" size="xl" />
          <div class="text-sm">
            <div class="font-semibold">{{ locale.name }}</div>
            <div class="mt-1">Code: <ProseCode class="text-xs">{{ locale.code }}</ProseCode></div>
          </div>
        </div>
      </div>
    </div>

    <Note to="https://github.com/nuxt/ui/tree/v3/src/runtime/locale" target="_blank">
      If you need additional languages, you can contribute by creating a PR to add a new locale in <ProseCode>src/runtime/locale/</ProseCode>.
    </Note>
    <Tip>
      You can use the <ProseCode>nuxt-ui</ProseCode> CLI to create a new locale:

      <ProsePre language="bash">nuxt-ui make locale --code "en" --name "English"</ProsePre>
    </Tip>
  </div>
</template>
