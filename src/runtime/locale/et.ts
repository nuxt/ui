import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Eesti',
  code: 'et',
  messages: {
    alert: {
      close: 'Sulge'
    },
    authForm: {
      hidePassword: 'Peida parool',
      showPassword: 'Näita parooli',
      submit: 'Jätka'
    },
    banner: {
      close: 'Sulge'
    },
    breadcrumb: {
      label: 'navigeerimisrada'
    },
    calendar: {
      label: 'Sündmuse kuupäev',
      monthPicker: 'Kuu valik',
      nextMonth: 'Järgmine kuu',
      nextYear: 'Järgmine aasta',
      prevMonth: 'Eelmine kuu',
      prevYear: 'Eelmine aasta',
      yearPicker: 'Aasta valik'
    },
    carousel: {
      dots: 'Valige kuvatav slaid',
      goto: 'Mine slaidile {slide}',
      next: 'Järg',
      prev: 'Eel',
      roledescription: 'karussell',
      slide: 'slaid'
    },
    chatAttachment: {
      uploading: 'Üleslaadimine',
      error: 'Üleslaadimine ebaõnnestus'
    },
    chatMessages: {
      autoScroll: 'Keri alla'
    },
    chatPrompt: {
      placeholder: 'Siia kirjutage oma sõnum…',
      queue: 'Järjekorras sõnumid',
      sendNow: 'Saada kohe',
      edit: 'Muuda',
      remove: 'Eemalda'
    },
    chatPromptSubmit: {
      label: 'Saada',
      reload: 'Proovi uuesti',
      stop: 'Peata genereerimine'
    },
    chatReasoning: {
      thinking: 'Mõtleb…',
      thought: 'Mõtles',
      thoughtFor: 'Mõtles {duration}'
    },
    colorMode: {
      dark: 'Tume',
      light: 'Hele',
      switchToDark: 'Lülitu tumedasse režiimi',
      switchToLight: 'Lülitu heledasse režiimi',
      system: 'Süsteem'
    },
    commandPalette: {
      back: 'Tagasi',
      close: 'Sulge',
      filterPlaceholder: 'Sisesta käsk või otsi…',
      noData: 'Pole andmeid',
      noMatch: 'Pole vastavaid andmeid',
      results: 'Tulemused'
    },
    contentSearch: {
      links: 'Lingid',
      search: 'Tulemused',
      theme: 'Teema'
    },
    contentSearchButton: {
      label: 'Otsi…'
    },
    contentToc: {
      title: 'Sellel lehel'
    },
    dropdownMenu: {
      filterPlaceholder: 'Otsi…',
      noMatch: 'Pole vastavaid andmeid'
    },
    dashboardSearch: {
      theme: 'Teema'
    },
    dashboardSearchButton: {
      label: 'Otsi…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Ahenda külgriba',
      expand: 'Laienda külgriba'
    },
    dashboardSidebarToggle: {
      close: 'Sulge külgriba',
      open: 'Ava külgriba'
    },
    drawer: {
      close: 'Sulge'
    },
    error: {
      clear: 'Tagasi avalehele'
    },
    fileUpload: {
      removeFile: 'Eemalda {filename}'
    },
    header: {
      close: 'Sulge menüü',
      open: 'Ava menüü'
    },
    inputDate: {
      day: 'päev',
      dayPeriod: 'AM/PM',
      era: 'ajastu',
      hour: 'tund',
      minute: 'minut',
      month: 'kuu',
      second: 'sekund',
      timeZoneName: 'ajavöönd',
      year: 'aasta'
    },
    inputMenu: {
      create: 'Loo "{label}"',
      noData: 'Pole andmeid',
      noMatch: 'Pole vastavaid andmeid',
      trigger: 'Kuva valikud'
    },
    inputNumber: {
      decrement: 'Vähenda',
      increment: 'Suurenda',
      roledescription: 'numbriväli'
    },
    inputRating: {
      rate: 'Hinnang {value} {length}-st'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'tund',
      minute: 'minut',
      second: 'sekund',
      timeZoneName: 'ajavöönd'
    },
    listbox: {
      filterPlaceholder: 'Otsi…',
      noData: 'Pole andmeid',
      noMatch: 'Pole vastavaid andmeid'
    },
    modal: {
      close: 'Sulge'
    },
    pagination: {
      first: 'Esimene lehekülg',
      last: 'Viimane lehekülg',
      next: 'Järgmine lehekülg',
      page: 'Lehekülg {page}',
      prev: 'Eelmine lehekülg'
    },
    pinInput: {
      input: 'PIN-kood, märk {index} {length}-st'
    },
    pricingTable: {
      caption: 'Hinna plaanide võrdlus'
    },
    prose: {
      codeCollapse: {
        closeText: 'Ahenda',
        name: 'kood',
        openText: 'Laienda'
      },
      collapsible: {
        closeText: 'Peida',
        name: 'omadused',
        openText: 'Näita'
      },
      pre: {
        copy: 'Kopeeri kood lõikelauale'
      },
      prompt: {
        copy: 'Kopeeri viip',
        openIn: 'Ava rakenduses {name}'
      }
    },
    sidebar: {
      close: 'Sulge',
      toggle: 'Lülita'
    },
    selectMenu: {
      create: 'Loo "{label}"',
      filterPlaceholder: 'Otsi…',
      noData: 'Pole andmeid',
      noMatch: 'Pole vastavaid andmeid'
    },
    skeleton: {
      label: 'laadimine'
    },
    slideover: {
      close: 'Sulge'
    },
    slider: {
      max: 'Maksimum',
      min: 'Miinimum',
      thumb: 'Liugur',
      value: 'Väärtus {index} {total}-st'
    },
    stepper: {
      label: 'edenemine'
    },
    table: {
      noData: 'Pole andmeid'
    },
    toast: {
      close: 'Sulge'
    },
    toaster: {
      label: 'Teavitus',
      viewport: 'Teavitused ({hotkey})'
    }
  }
})
