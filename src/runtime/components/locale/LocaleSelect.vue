<script lang="ts">
import type { SelectMenuProps } from '../../types'
import type { Locale } from '../../types/locale'

export interface LocaleSelectProps extends Omit<SelectMenuProps<Locale<any>[], 'code', false>, 'items' | 'modelValue'> {
  locales?: Locale<any>[]
}
</script>

<script setup lang="ts">
import { useForwardProps } from 'reka-ui'
import { reactiveOmit } from '@vueuse/core'
import USelectMenu from '../SelectMenu.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<LocaleSelectProps>(), {
  searchInput: false,
  valueKey: 'code',
  labelKey: 'name'
})

const selectMenuProps = useForwardProps(reactiveOmit(props, 'locales'))

const modelValue = defineModel<string>({ required: true })

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
    gl: 'es', // Galician -> Spain
    he: 'il', // Hebrew -> Israel
    hi: 'in', // Hindi -> India
    hy: 'am', // Armenian -> Armenia
    ja: 'jp', // Japanese -> Japan
    ka: 'ge', // Georgian -> Georgia
    kk: 'kz', // Kazakh -> Kazakhstan
    km: 'kh', // Khmer -> Cambodia
    ko: 'kr', // Korean -> South Korea
    ky: 'kg', // Kyrgyz -> Kyrgyzstan
    lb: 'lu', // Luxembourgish -> Luxembourg
    ms: 'my', // Malay -> Malaysia
    nb: 'no', // Norwegian Bokmål -> Norway
    sl: 'si', // Slovenian -> Slovenia
    sq: 'al', // Albanian -> Albania
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

<template>
  <USelectMenu
    v-model="modelValue"
    v-bind="{ ...selectMenuProps, ...$attrs }"
    :items="locales"
  >
    <template #leading>
      <span v-if="modelValue" class="size-5 text-center">
        {{ getEmojiFlag(modelValue) }}
      </span>
    </template>

    <template #item-leading="{ item }">
      <span class="size-5 text-center">
        {{ getEmojiFlag(item.code) }}
      </span>
    </template>
  </USelectMenu>
</template>
