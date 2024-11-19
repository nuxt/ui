<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'
import type { Locale } from '@nuxt/ui'

type LocaleKey = keyof typeof locales

const props = withDefaults(defineProps<{
  default?: string
}>(), {
  default: 'en'
})

const getLocaleKeys = Object.keys(locales) as LocaleKey[]
const localesList = getLocaleKeys.map<[LocaleKey, Locale]>(locale => [locale, locales[locale]])
</script>

<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <div>
    <ProseP>
      By default, the <ProseCode>{{ props.default }}</ProseCode> locale is used
    </ProseP>
    <ProseTable>
      <ProseThead>
        <ProseTr>
          <ProseTh>
            Language
          </ProseTh>
          <ProseTh>
            Code
          </ProseTh>
          <ProseTh>
            Direction
          </ProseTh>
        </ProseTr>
      </ProseThead>
      <ProseTbody>
        <ProseTr v-for="[key, locale] in localesList" :key="key">
          <ProseTd>
            {{ locale.name }}
          </ProseTd>
          <ProseTd>
            <ProseCode>
              {{ locale.code }}
            </ProseCode>
          </ProseTd>
          <ProseTd>
            <ProseCode>
              {{ locale.dir }}
            </ProseCode>
          </ProseTd>
        </ProseTr>
      </ProseTbody>
    </ProseTable>
    <Note to="https://github.com/nuxt/ui/tree/v3/src/runtime/locale" target="_blank">
      If you need additional languages, you can contribute by creating a PR to add a new locale in <ProseCode>src/runtime/locale/</ProseCode>.
    </Note>
    <Tip>
      You can use the <ProseCode>nuxt-ui</ProseCode> CLI to create a new locale:

      <ProsePre language="bash">nuxt-ui make locale --code "en" --name "English"</ProsePre>
    </Tip>
  </div>
</template>
