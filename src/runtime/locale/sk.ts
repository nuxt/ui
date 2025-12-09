import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Slovenčina',
  code: 'sk',
  messages: {
    alert: {
      close: 'Zatvoriť'
    },
    authForm: {
      hidePassword: 'Skryť heslo',
      showPassword: 'Zobraziť heslo',
      submit: 'Pokračovať'
    },
    banner: {
      close: 'Zatvoriť'
    },
    calendar: {
      nextMonth: 'Nasledujúci mesiac',
      nextYear: 'Nasledujúci rok',
      prevMonth: 'Predchádzajúci mesiac',
      prevYear: 'Predchádzajúci rok'
    },
    carousel: {
      dots: 'Vyberte snímku na zobrazenie',
      goto: 'Prejsť na {slide}',
      next: 'Nasledujúci',
      prev: 'Predchádzajúci'
    },
    chatPrompt: {
      placeholder: 'Tu napíšte svoje správu…'
    },
    chatPromptSubmit: {
      label: 'Odoslať'
    },
    colorMode: {
      dark: 'Tmavý',
      light: 'Svetlý',
      switchToDark: 'Prepnúť na tmavý režim',
      switchToLight: 'Prepnúť na svetlý režim',
      system: 'Systém'
    },
    commandPalette: {
      back: 'Späť',
      close: 'Zavrieť',
      noData: 'Žiadne dáta',
      noMatch: 'Žiadna zhoda',
      placeholder: 'Zadajte príkaz alebo vyhľadajte…'
    },
    contentSearch: {
      links: 'Odkazy',
      theme: 'Téma'
    },
    contentSearchButton: {
      label: 'Hľadať…'
    },
    contentToc: {
      title: 'Na tejto stránke'
    },
    dashboardSearch: {
      theme: 'Téma'
    },
    dashboardSearchButton: {
      label: 'Hľadať…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Zbaliť bočný panel',
      expand: 'Rozbaliť bočný panel'
    },
    dashboardSidebarToggle: {
      close: 'Zatvoriť bočný panel',
      open: 'Otvoriť bočný panel'
    },
    error: {
      clear: 'Späť na domovskú stránku'
    },
    fileUpload: {
      removeFile: 'Odobrať {filename}'
    },
    header: {
      close: 'Zatvoriť menu',
      open: 'Otvoriť menu'
    },
    inputMenu: {
      create: 'Vytvoriť "{label}"',
      noData: 'Žiadne dáta',
      noMatch: 'Žiadna zhoda'
    },
    inputNumber: {
      decrement: 'Znížiť',
      increment: 'Zvýšiť'
    },
    modal: {
      close: 'Zatvoriť'
    },
    pricingTable: {
      caption: 'Porovnanie cien'
    },
    prose: {
      codeCollapse: {
        closeText: 'Zbaliť',
        name: 'kód',
        openText: 'Rozbaliť'
      },
      collapsible: {
        closeText: 'Skryť',
        name: 'vlastnosti',
        openText: 'Zobraziť'
      },
      pre: {
        copy: 'Kopírovať kód do schránky'
      }
    },
    selectMenu: {
      create: 'Vytvoriť "{label}"',
      noData: 'Žiadne dáta',
      noMatch: 'Žiadna zhoda',
      search: 'Hľadať…'
    },
    slideover: {
      close: 'Zatvoriť'
    },
    table: {
      noData: 'Žiadne dáta'
    },
    toast: {
      close: 'Zatvoriť'
    }
  }
})
