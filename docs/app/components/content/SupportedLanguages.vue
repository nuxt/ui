<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const props = withDefaults(defineProps<{
  default?: string
}>(), {
  default: 'en'
})

const getLocaleKeys = () => Object.keys(locales) as Array<keyof typeof locales>
const localesList = getLocaleKeys().map(locale => [locale, locales[locale].name])
</script>

<template>
  <div>
    <ProseUl>
      <ProseLi v-for="[key, label] in localesList" :key="key">
        <ProseCode>{{ key }}</ProseCode> - {{ label }}
        <template v-if="key === props.default">
          (default)
        </template>
      </ProseLi>
    </ProseUl>
    <ProseP>
      If you need any other languages, a
      <ProseA href="https://github.com/nuxt/ui/pulls" target="_blank">
        PR
      </ProseA>
      is always welcome, you only need to add a language file
      <ProseA href="https://github.com/nuxt/ui/tree/v3/src/runtime/locale" target="_blank">
        here
      </ProseA>
    </ProseP>
    <Tip>
      Use CLI command <ProseCode>nuxt-ui make locale</ProseCode> to create a new locale
      <ProsePre language="bash">
        nuxt-ui make locale --code "en" --name "English"
      </ProsePre>
    </Tip>
  </div>
</template>
