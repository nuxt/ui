import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Icelandic',
  code: 'is',
  messages: {
    alert: {
      close: 'Loka'
    },
    authForm: {
      hidePassword: 'Fela lykilorð',
      showPassword: 'Sýna lykilorð',
      submit: 'Áfram'
    },
    banner: {
      close: 'Loka'
    },
    calendar: {
      nextMonth: 'Næsti mánuður',
      nextYear: 'Næsta ár',
      prevMonth: 'Fyrri mánuður',
      prevYear: 'Fyrra ár'
    },
    carousel: {
      dots: 'Veldu mynd til að sýna',
      goto: 'Fara á mynd {slide}',
      next: 'Næsta',
      prev: 'Fyrri'
    },
    chatPrompt: {
      placeholder: 'Skrifaðu skilaboðin þín hér…'
    },
    chatPromptSubmit: {
      label: 'Senda fyrirspurn'
    },
    chatReasoning: {
      thinking: 'Hugsar…',
      thought: 'Hugsaði',
      thoughtFor: 'Hugsaði í {duration}'
    },
    colorMode: {
      dark: 'Dökkt',
      light: 'Ljóst',
      switchToDark: 'Skipta yfir í dökkan ham',
      switchToLight: 'Skipta yfir í ljósan ham',
      system: 'Kerfi'
    },
    commandPalette: {
      back: 'Til baka',
      close: 'Loka',
      noData: 'Engin gögn',
      noMatch: 'Engin gögn fundust',
      placeholder: 'Sláðu inn skipun eða leitaðu…'
    },
    contentSearch: {
      links: 'Tenglar',
      theme: 'Þema'
    },
    contentSearchButton: {
      label: 'Leita…'
    },
    contentToc: {
      title: 'Á þessari síðu'
    },
    dropdownMenu: {
      noMatch: 'Engin gögn fundust',
      search: 'Leita…'
    },
    dashboardSearch: {
      theme: 'Þema'
    },
    dashboardSearchButton: {
      label: 'Leita…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Fella hliðarstiku saman',
      expand: 'Stækka hliðarstiku'
    },
    dashboardSidebarToggle: {
      close: 'Loka hliðarstiku',
      open: 'Opna hliðarstiku'
    },
    error: {
      clear: 'Til baka heim'
    },
    fileUpload: {
      removeFile: 'Fjarlægja {filename}'
    },
    header: {
      close: 'Loka valmynd',
      open: 'Opna valmynd'
    },
    inputMenu: {
      create: 'Búa til "{label}"',
      noData: 'Engin gögn',
      noMatch: 'Engin gögn fundust'
    },
    inputNumber: {
      decrement: 'Minnka',
      increment: 'Auka'
    },
    modal: {
      close: 'Loka'
    },
    pricingTable: {
      caption: 'Samanburður verðflokka'
    },
    prose: {
      codeCollapse: {
        closeText: 'Fella saman',
        name: 'kóði',
        openText: 'Stækka'
      },
      collapsible: {
        closeText: 'Fela',
        name: 'eiginleikar',
        openText: 'Sýna'
      },
      pre: {
        copy: 'Afrita kóða á klippiborð'
      }
    },
    sidebar: {
      close: 'Loka',
      toggle: 'Skipta'
    },
    selectMenu: {
      create: 'Búa til "{label}"',
      noData: 'Engin gögn',
      noMatch: 'Engin gögn fundust',
      search: 'Leita…'
    },
    slideover: {
      close: 'Loka'
    },
    table: {
      noData: 'Engin gögn'
    },
    toast: {
      close: 'Loka'
    }
  }
})
