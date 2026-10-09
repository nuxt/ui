import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'traseu de navigare'
    },
    calendar: {
      label: 'Data evenimentului',
      monthPicker: 'Selector de lună',
      nextMonth: 'Luna următoare',
      nextYear: 'Anul următor',
      prevMonth: 'Luna precedentă',
      prevYear: 'Anul precedent',
      yearPicker: 'Selector de an'
    },
    carousel: {
      dots: 'Alegeți diapozitivul de afișat',
      goto: 'Mergi la diapozitivul {slide}',
      next: 'Următor',
      prev: 'Anterior',
      roledescription: 'carusel',
      slide: 'diapozitiv'
    },
    chatMessages: {
      autoScroll: 'Derulează în jos'
    },
    chatPrompt: {
      placeholder: 'Scrieți mesajul dvs. aici…'
    },
    chatPromptSubmit: {
      label: 'Trimite',
      reload: 'Încearcă din nou',
      stop: 'Oprește generarea'
    },
    chatReasoning: {
      thinking: 'Se gândește…',
      thought: 'A gândit',
      thoughtFor: 'A gândit {duration}'
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
      search: 'Rezultate',
      theme: 'Temă'
    },
    contentSearchButton: {
      label: 'Caută…'
    },
    contentToc: {
      title: 'Pe această pagină'
    },
    dropdownMenu: {
      noMatch: 'Nu există date corespunzătoare',
      search: 'Caută…'
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
    drawer: {
      close: 'Închide'
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
    inputDate: {
      day: 'zi',
      dayPeriod: 'AM/PM',
      era: 'eră',
      hour: 'oră',
      minute: 'minut',
      month: 'lună',
      second: 'secundă',
      timeZoneName: 'fus orar',
      year: 'an'
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
    inputRating: {
      rate: 'Evaluează cu {value} din {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'oră',
      minute: 'minut',
      second: 'secundă',
      timeZoneName: 'fus orar'
    },
    listbox: {
      noData: 'Nu există date',
      noMatch: 'Nu există date corespunzătoare',
      search: 'Caută…'
    },
    modal: {
      close: 'Închide'
    },
    pagination: {
      first: 'Prima pagină',
      last: 'Ultima pagină',
      next: 'Pagina următoare',
      page: 'Pagina {page}',
      prev: 'Pagina anterioară'
    },
    pinInput: {
      input: 'cod PIN, caracterul {index} din {length}'
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
      },
      prompt: {
        copy: 'Copiază promptul',
        openIn: 'Deschide în {name}'
      }
    },
    sidebar: {
      close: 'Închide',
      toggle: 'Comutare'
    },
    selectMenu: {
      create: 'Creează "{label}"',
      noData: 'Nu există date',
      noMatch: 'Nu există date corespunzătoare',
      search: 'Caută…'
    },
    skeleton: {
      label: 'se încarcă'
    },
    slideover: {
      close: 'Închide'
    },
    slider: {
      max: 'Maxim',
      min: 'Minim',
      thumb: 'Cursor',
      value: 'Valoarea {index} din {total}'
    },
    table: {
      noData: 'Nu există date'
    },
    toast: {
      close: 'Închide'
    },
    toaster: {
      label: 'Notificare',
      viewport: 'Notificări ({hotkey})'
    }
  }
})
