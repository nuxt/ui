import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Română',
  code: 'ro',
  messages: {
    alert: {
      close: 'Închide'
    },
    authForm: {
      hidePassword: 'Ascunde parola',
      showPassword: 'Arată parola',
      submit: 'Continuă'
    },
    banner: {
      close: 'Închide'
    },
    calendar: {
      nextMonth: 'Luna următoare',
      nextYear: 'Anul următor',
      prevMonth: 'Luna precedentă',
      prevYear: 'Anul precedent'
    },
    carousel: {
      dots: 'Alegeți diapozitivul de afișat',
      goto: 'Mergi la diapozitivul {slide}',
      next: 'Următor',
      prev: 'Anterior'
    },
    chatPrompt: {
      placeholder: 'Scrieți mesajul dvs. aici…'
    },
    chatPromptSubmit: {
      label: 'Trimite'
    },
    colorMode: {
      dark: 'Întunecat',
      light: 'Luminos',
      switchToDark: 'Comută la modul întunecat',
      switchToLight: 'Comută la modul luminos',
      system: 'Sistem'
    },
    commandPalette: {
      back: 'Înapoi',
      close: 'Închide',
      noData: 'Nu există date',
      noMatch: 'Nu există date corespunzătoare',
      placeholder: 'Tastează o comandă sau caută…'
    },
    contentSearch: {
      links: 'Linkuri',
      theme: 'Temă'
    },
    contentSearchButton: {
      label: 'Caută…'
    },
    contentToc: {
      title: 'Pe această pagină'
    },
    dashboardSearch: {
      theme: 'Temă'
    },
    dashboardSearchButton: {
      label: 'Caută…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Restrânge bara laterală',
      expand: 'Extinde bara laterală'
    },
    dashboardSidebarToggle: {
      close: 'Închide bara laterală',
      open: 'Deschide bara laterală'
    },
    error: {
      clear: 'Înapoi la pagina principală'
    },
    fileUpload: {
      removeFile: 'Elimină {filename}'
    },
    header: {
      close: 'Închide meniul',
      open: 'Deschide meniul'
    },
    inputMenu: {
      create: 'Creează "{label}"',
      noData: 'Nu există date',
      noMatch: 'Nu există date corespunzătoare'
    },
    inputNumber: {
      decrement: 'Scade',
      increment: 'Crește'
    },
    modal: {
      close: 'Închide'
    },
    pricingTable: {
      caption: 'Comparare prețuri'
    },
    prose: {
      codeCollapse: {
        closeText: 'Restrânge',
        name: 'cod',
        openText: 'Extinde'
      },
      collapsible: {
        closeText: 'Ascunde',
        name: 'proprietăți',
        openText: 'Afișează'
      },
      pre: {
        copy: 'Copiază codul în clipboard'
      }
    },
    selectMenu: {
      create: 'Creează "{label}"',
      noData: 'Nu există date',
      noMatch: 'Nu există date corespunzătoare',
      search: 'Caută…'
    },
    slideover: {
      close: 'Închide'
    },
    table: {
      noData: 'Nu există date'
    },
    toast: {
      close: 'Închide'
    }
  }
})
