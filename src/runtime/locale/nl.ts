import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'kruimelpad'
    },
    calendar: {
      label: 'Evenementdatum',
      monthPicker: 'Maandkiezer',
      nextMonth: 'Volgende maand',
      nextYear: 'Volgend jaar',
      prevMonth: 'Vorige maand',
      prevYear: 'Vorig jaar',
      yearPicker: 'Jaarkiezer'
    },
    carousel: {
      dots: 'Kies dia om weer te geven',
      goto: 'Ga naar dia {slide}',
      next: 'Volgende',
      prev: 'Vorige',
      roledescription: 'carrousel',
      slide: 'dia'
    },
    chatMessages: {
      autoScroll: 'Naar beneden scrollen'
    },
    chatPrompt: {
      placeholder: 'Schrijf hier je bericht…'
    },
    chatPromptSubmit: {
      label: 'Versturen',
      reload: 'Opnieuw proberen',
      stop: 'Genereren stoppen'
    },
    chatReasoning: {
      thinking: 'Aan het denken…',
      thought: 'Nagedacht',
      thoughtFor: '{duration} nagedacht'
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
      search: 'Resultaten',
      theme: 'Thema'
    },
    contentSearchButton: {
      label: 'Zoeken…'
    },
    contentToc: {
      title: 'Op deze pagina'
    },
    dropdownMenu: {
      noMatch: 'Geen overeenkomende gegevens',
      search: 'Zoeken…'
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
    drawer: {
      close: 'Sluiten'
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
    inputDate: {
      day: 'dag',
      dayPeriod: 'AM/PM',
      era: 'tijdperk',
      hour: 'uur',
      minute: 'minuut',
      month: 'maand',
      second: 'seconde',
      timeZoneName: 'tijdzone',
      year: 'jaar'
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
    inputRating: {
      rate: 'Beoordeel met {value} van {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'uur',
      minute: 'minuut',
      second: 'seconde',
      timeZoneName: 'tijdzone'
    },
    listbox: {
      noData: 'Geen gegevens',
      noMatch: 'Geen overeenkomende gegevens',
      search: 'Zoeken…'
    },
    modal: {
      close: 'Sluiten'
    },
    pagination: {
      first: 'Eerste pagina',
      last: 'Laatste pagina',
      next: 'Volgende pagina',
      page: 'Pagina {page}',
      prev: 'Vorige pagina'
    },
    pinInput: {
      input: 'pincode, teken {index} van {length}'
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
      },
      prompt: {
        copy: 'Prompt kopiëren',
        openIn: 'Openen in {name}'
      }
    },
    sidebar: {
      close: 'Sluiten',
      toggle: 'Schakelen'
    },
    selectMenu: {
      create: '"{label}" creëren',
      noData: 'Geen gegevens',
      noMatch: 'Geen overeenkomende gegevens',
      search: 'Zoeken…'
    },
    skeleton: {
      label: 'laden'
    },
    slideover: {
      close: 'Sluiten'
    },
    slider: {
      max: 'Maximum',
      min: 'Minimum',
      thumb: 'Schuifregelaar',
      value: 'Waarde {index} van {total}'
    },
    table: {
      noData: 'Geen gegevens'
    },
    toast: {
      close: 'Sluiten'
    },
    toaster: {
      label: 'Melding',
      viewport: 'Meldingen ({hotkey})'
    }
  }
})
