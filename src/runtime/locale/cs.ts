import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'drobečková navigace'
    },
    calendar: {
      label: 'Datum události',
      monthPicker: 'Výběr měsíce',
      nextMonth: 'Další měsíc',
      nextYear: 'Další rok',
      prevMonth: 'Předchozí měsíc',
      prevYear: 'Předchozí rok',
      yearPicker: 'Výběr roku'
    },
    carousel: {
      dots: 'Vyberte snímek k zobrazení',
      goto: 'Přejít na {slide}',
      next: 'Další',
      prev: 'Předchozí',
      roledescription: 'karusel',
      slide: 'snímek'
    },
    chatAttachment: {
      uploading: 'Nahrávání',
      error: 'Nahrání se nezdařilo'
    },
    chatMessages: {
      autoScroll: 'Posunout dolů'
    },
    chatPrompt: {
      placeholder: 'Zde napište svůj text…',
      queue: 'Zprávy ve frontě',
      sendNow: 'Odeslat nyní',
      edit: 'Upravit',
      remove: 'Odebrat'
    },
    chatPromptSubmit: {
      label: 'Odeslat',
      reload: 'Zkusit znovu',
      stop: 'Zastavit generování'
    },
    chatReasoning: {
      thinking: 'Přemýšlí…',
      thought: 'Přemýšlel',
      thoughtFor: 'Přemýšlel {duration}'
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
      filterPlaceholder: 'Zadejte příkaz nebo hledejte…',
      noData: 'Žádná data',
      noMatch: 'Žádná shoda',
      results: 'Výsledky'
    },
    contentSearch: {
      links: 'Odkazy',
      search: 'Výsledky',
      theme: 'Barevný režim'
    },
    contentSearchButton: {
      label: 'Hledat…'
    },
    contentToc: {
      title: 'Na této stránce'
    },
    dropdownMenu: {
      filterPlaceholder: 'Hledat…',
      noMatch: 'Žádná shoda'
    },
    dashboardSearch: {
      theme: 'Barevný režim'
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
    drawer: {
      close: 'Zavřít'
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
    inputDate: {
      day: 'den',
      dayPeriod: 'AM/PM',
      era: 'letopočet',
      hour: 'hodina',
      minute: 'minuta',
      month: 'měsíc',
      second: 'sekunda',
      timeZoneName: 'časové pásmo',
      year: 'rok'
    },
    inputMenu: {
      create: 'Vytvořit "{label}"',
      noData: 'Žádná data',
      noMatch: 'Žádná shoda',
      trigger: 'Zobrazit možnosti'
    },
    inputNumber: {
      decrement: 'Snížit',
      increment: 'Zvýšit',
      roledescription: 'číselné pole'
    },
    inputRating: {
      rate: 'Ohodnotit {value} z {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'hodina',
      minute: 'minuta',
      second: 'sekunda',
      timeZoneName: 'časové pásmo'
    },
    listbox: {
      filterPlaceholder: 'Hledat…',
      noData: 'Žádná data',
      noMatch: 'Žádná shoda'
    },
    modal: {
      close: 'Zavřít'
    },
    pagination: {
      first: 'První stránka',
      last: 'Poslední stránka',
      next: 'Další stránka',
      page: 'Stránka {page}',
      prev: 'Předchozí stránka'
    },
    pinInput: {
      input: 'PIN kód, znak {index} z {length}'
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
      },
      prompt: {
        copy: 'Kopírovat prompt',
        openIn: 'Otevřít v {name}'
      }
    },
    sidebar: {
      close: 'Zavřít',
      toggle: 'Přepnout'
    },
    selectMenu: {
      create: 'Vytvořit "{label}"',
      filterPlaceholder: 'Hledat…',
      noData: 'Žádná data',
      noMatch: 'Žádná shoda'
    },
    skeleton: {
      label: 'načítání'
    },
    slideover: {
      close: 'Zavřít'
    },
    slider: {
      max: 'Maximum',
      min: 'Minimum',
      thumb: 'Posuvník',
      value: 'Hodnota {index} z {total}'
    },
    stepper: {
      label: 'průběh'
    },
    table: {
      noData: 'Žádná data'
    },
    toast: {
      close: 'Zavřít'
    },
    toaster: {
      label: 'Oznámení',
      viewport: 'Oznámení ({hotkey})'
    }
  }
})
