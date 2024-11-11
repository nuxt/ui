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

<!-- eslint-disable vue/singleline-html-element-content-newline -->
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
    <Note to="https://github.com/nuxt/ui/tree/v3/src/runtime/locale" target="_blank">
      If you need additional languages, you can contribute by creating a PR to add a new locale in <ProseCode>src/runtime/locale/</ProseCode>.
    </Note>
    <Tip>
      You can use the <ProseCode>nuxt-ui</ProseCode> CLI to create a new locale:

      <ProsePre language="bash">nuxt-ui make locale --code "en" --name "English"</ProsePre>
    </Tip>
  </div>
</template>
