import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Nederlands',
  code: 'nl',
  messages: {
    alert: {
      close: 'Sluiten'
    },
    authForm: {
      hidePassword: 'Wachtwoord verbergen',
      showPassword: 'Wachtwoord tonen',
      submit: 'Doorgaan'
    },
    banner: {
      close: 'Sluiten'
    },
    calendar: {
      nextMonth: 'Volgende maand',
      nextYear: 'Volgend jaar',
      prevMonth: 'Vorige maand',
      prevYear: 'Vorig jaar'
    },
    carousel: {
      dots: 'Kies dia om weer te geven',
      goto: 'Ga naar dia {slide}',
      next: 'Volgende',
      prev: 'Vorige'
    },
    chatPrompt: {
      placeholder: 'Schrijf hier je bericht…'
    },
    chatPromptSubmit: {
      label: 'Versturen'
    },
    colorMode: {
      dark: 'Donker',
      light: 'Licht',
      switchToDark: 'Overschakelen naar donkere modus',
      switchToLight: 'Overschakelen naar lichte modus',
      system: 'Systeem'
    },
    commandPalette: {
      back: 'Terug',
      close: 'Sluiten',
      noData: 'Geen gegevens',
      noMatch: 'Geen overeenkomende gegevens',
      placeholder: 'Typ een commando of zoek…'
    },
    contentSearch: {
      links: 'Links',
      theme: 'Thema'
    },
    contentSearchButton: {
      label: 'Zoeken…'
    },
    contentToc: {
      title: 'Op deze pagina'
    },
    dashboardSearch: {
      theme: 'Thema'
    },
    dashboardSearchButton: {
      label: 'Zoeken…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Zijbalk invouwen',
      expand: 'Zijbalk uitvouwen'
    },
    dashboardSidebarToggle: {
      close: 'Zijbalk sluiten',
      open: 'Zijbalk openen'
    },
    error: {
      clear: 'Terug naar home'
    },
    fileUpload: {
      removeFile: '{filename} verwijderen'
    },
    header: {
      close: 'Menu sluiten',
      open: 'Menu openen'
    },
    inputMenu: {
      create: '"{label}" creëren',
      noData: 'Geen gegevens',
      noMatch: 'Geen overeenkomende gegevens'
    },
    inputNumber: {
      decrement: 'Verlagen',
      increment: 'Verhogen'
    },
    modal: {
      close: 'Sluiten'
    },
    pricingTable: {
      caption: 'Prijsplanvergelijking'
    },
    prose: {
      codeCollapse: {
        closeText: 'Invouwen',
        name: 'code',
        openText: 'Uitvouwen'
      },
      collapsible: {
        closeText: 'Verbergen',
        name: 'eigenschappen',
        openText: 'Tonen'
      },
      pre: {
        copy: 'Code naar klembord kopiëren'
      }
    },
    selectMenu: {
      create: '"{label}" creëren',
      noData: 'Geen gegevens',
      noMatch: 'Geen overeenkomende gegevens',
      search: 'Zoeken…'
    },
    slideover: {
      close: 'Sluiten'
    },
    table: {
      noData: 'Geen gegevens'
    },
    toast: {
      close: 'Sluiten'
    }
  }
})
