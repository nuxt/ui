import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Čeština',
  code: 'cs',
  messages: {
    alert: {
      close: 'Zavřít'
    },
    authForm: {
      hidePassword: 'Skrýt heslo',
      showPassword: 'Zobrazit heslo',
      submit: 'Pokračovat'
    },
    banner: {
      close: 'Zavřít'
    },
    calendar: {
      nextMonth: 'Další měsíc',
      nextYear: 'Další rok',
      prevMonth: 'Předchozí měsíc',
      prevYear: 'Předchozí rok'
    },
    carousel: {
      dots: 'Vyberte snímek k zobrazení',
      goto: 'Přejít na {slide}',
      next: 'Další',
      prev: 'Předchozí'
    },
    chatPrompt: {
      placeholder: 'Zde napište svůj text…'
    },
    chatPromptSubmit: {
      label: 'Odeslat'
    },
    colorMode: {
      dark: 'Tmavý',
      light: 'Světlý',
      switchToDark: 'Přepnout na tmavý režim',
      switchToLight: 'Přepnout na světlý režim',
      system: 'Systémový'
    },
    commandPalette: {
      back: 'Zpět',
      close: 'Zavřít',
      noData: 'Žádná data',
      noMatch: 'Žádná shoda',
      placeholder: 'Zadejte příkaz nebo hledejte…'
    },
    contentSearch: {
      links: 'Odkazy',
      theme: 'Téma'
    },
    contentSearchButton: {
      label: 'Hledat…'
    },
    contentToc: {
      title: 'Na této stránce'
    },
    dashboardSearch: {
      theme: 'Téma'
    },
    dashboardSearchButton: {
      label: 'Hledat…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Sbalit postranní panel',
      expand: 'Rozbalit postranní panel'
    },
    dashboardSidebarToggle: {
      close: 'Zavřít postranní panel',
      open: 'Otevřít postranní panel'
    },
    error: {
      clear: 'Zpět na úvod'
    },
    fileUpload: {
      removeFile: 'Odebrat {filename}'
    },
    header: {
      close: 'Zavřít menu',
      open: 'Otevřít menu'
    },
    inputMenu: {
      create: 'Vytvořit "{label}"',
      noData: 'Žádná data',
      noMatch: 'Žádná shoda'
    },
    inputNumber: {
      decrement: 'Snížit',
      increment: 'Zvýšit'
    },
    modal: {
      close: 'Zavřít'
    },
    pricingTable: {
      caption: 'Porovnání cenových plánů'
    },
    prose: {
      codeCollapse: {
        closeText: 'Sbalit',
        name: 'kód',
        openText: 'Rozbalit'
      },
      collapsible: {
        closeText: 'Skrýt',
        name: 'vlastnosti',
        openText: 'Zobrazit'
      },
      pre: {
        copy: 'Kopírovat kód do schránky'
      }
    },
    selectMenu: {
      create: 'Vytvořit "{label}"',
      noData: 'Žádná data',
      noMatch: 'Žádná shoda',
      search: 'Hledat…'
    },
    slideover: {
      close: 'Zavřít'
    },
    table: {
      noData: 'Žádná data'
    },
    toast: {
      close: 'Zavřít'
    }
  }
})
