import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Svenska',
  code: 'sv',
  messages: {
    alert: {
      close: 'Stäng'
    },
    authForm: {
      hidePassword: 'Dölj lösenord',
      showPassword: 'Visa lösenord',
      submit: 'Fortsätt'
    },
    banner: {
      close: 'Stäng'
    },
    calendar: {
      nextMonth: 'Nästa månad',
      nextYear: 'Nästa år',
      prevMonth: 'Föregående månad',
      prevYear: 'Föregående år'
    },
    carousel: {
      dots: 'Välj bild att visa',
      goto: 'Gå till {slide}',
      next: 'Nästa',
      prev: 'Föregående'
    },
    chatPrompt: {
      placeholder: 'Skriv ditt meddelande här…'
    },
    chatPromptSubmit: {
      label: 'Skicka'
    },
    colorMode: {
      dark: 'Mörkt',
      light: 'Ljust',
      switchToDark: 'Byt till mörkt läge',
      switchToLight: 'Byt till ljust läge',
      system: 'System'
    },
    commandPalette: {
      back: 'Tillbaka',
      close: 'Stäng',
      noData: 'Inga data',
      noMatch: 'Inga matchande data',
      placeholder: 'Skriv ett kommando eller sök…'
    },
    contentSearch: {
      links: 'Länkar',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Sök…'
    },
    contentToc: {
      title: 'På denna sida'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Sök…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Minimera sidofältet',
      expand: 'Expandera sidofältet'
    },
    dashboardSidebarToggle: {
      close: 'Stäng sidofältet',
      open: 'Öppna sidofältet'
    },
    error: {
      clear: 'Tillbaka till startsidan'
    },
    fileUpload: {
      removeFile: 'Ta bort {filename}'
    },
    header: {
      close: 'Stäng menyn',
      open: 'Öppna menyn'
    },
    inputMenu: {
      create: 'Skapa "{label}"',
      noData: 'Inga data',
      noMatch: 'Inga matchande data'
    },
    inputNumber: {
      decrement: 'Minska',
      increment: 'Öka'
    },
    modal: {
      close: 'Stäng'
    },
    pricingTable: {
      caption: 'Prisplanering'
    },
    prose: {
      codeCollapse: {
        closeText: 'Minimera',
        name: 'kod',
        openText: 'Expandera'
      },
      collapsible: {
        closeText: 'Dölj',
        name: 'egenskaper',
        openText: 'Visa'
      },
      pre: {
        copy: 'Kopiera kod till urklipp'
      }
    },
    selectMenu: {
      create: 'Skapa "{label}"',
      noData: 'Inga data',
      noMatch: 'Inga matchande data',
      search: 'Sök…'
    },
    slideover: {
      close: 'Stäng'
    },
    table: {
      noData: 'Inga data'
    },
    toast: {
      close: 'Stäng'
    }
  }
})
