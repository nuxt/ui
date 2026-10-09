import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'navigačná cesta'
    },
    calendar: {
      label: 'Dátum udalosti',
      monthPicker: 'Výber mesiaca',
      nextMonth: 'Nasledujúci mesiac',
      nextYear: 'Nasledujúci rok',
      prevMonth: 'Predchádzajúci mesiac',
      prevYear: 'Predchádzajúci rok',
      yearPicker: 'Výber roka'
    },
    carousel: {
      dots: 'Vyberte snímku na zobrazenie',
      goto: 'Prejsť na {slide}',
      next: 'Nasledujúci',
      prev: 'Predchádzajúci',
      roledescription: 'karusel',
      slide: 'snímka'
    },
    chatMessages: {
      autoScroll: 'Posunúť nadol'
    },
    chatPrompt: {
      placeholder: 'Tu napíšte svoje správu…'
    },
    chatPromptSubmit: {
      label: 'Odoslať',
      reload: 'Skúsiť znova',
      stop: 'Zastaviť generovanie'
    },
    chatReasoning: {
      thinking: 'Premýšľa…',
      thought: 'Premýšľal',
      thoughtFor: 'Premýšľal {duration}'
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
      search: 'Výsledky',
      theme: 'Farebný režim'
    },
    contentSearchButton: {
      label: 'Hľadať…'
    },
    contentToc: {
      title: 'Na tejto stránke'
    },
    dropdownMenu: {
      noMatch: 'Žiadna zhoda',
      search: 'Hľadať…'
    },
    dashboardSearch: {
      theme: 'Farebný režim'
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
    drawer: {
      close: 'Zatvoriť'
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
    inputDate: {
      day: 'deň',
      dayPeriod: 'AM/PM',
      era: 'letopočet',
      hour: 'hodina',
      minute: 'minúta',
      month: 'mesiac',
      second: 'sekunda',
      timeZoneName: 'časové pásmo',
      year: 'rok'
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
    inputRating: {
      rate: 'Ohodnotiť na {value} z {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'hodina',
      minute: 'minúta',
      second: 'sekunda',
      timeZoneName: 'časové pásmo'
    },
    listbox: {
      noData: 'Žiadne dáta',
      noMatch: 'Žiadna zhoda',
      search: 'Hľadať…'
    },
    modal: {
      close: 'Zatvoriť'
    },
    pagination: {
      first: 'Prvá stránka',
      last: 'Posledná stránka',
      next: 'Ďalšia stránka',
      page: 'Stránka {page}',
      prev: 'Predchádzajúca stránka'
    },
    pinInput: {
      input: 'PIN kód, znak {index} z {length}'
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
      },
      prompt: {
        copy: 'Kopírovať výzvu',
        openIn: 'Otvoriť v {name}'
      }
    },
    sidebar: {
      close: 'Zatvoriť',
      toggle: 'Prepnúť'
    },
    selectMenu: {
      create: 'Vytvoriť "{label}"',
      noData: 'Žiadne dáta',
      noMatch: 'Žiadna zhoda',
      search: 'Hľadať…'
    },
    skeleton: {
      label: 'načítava sa'
    },
    slideover: {
      close: 'Zatvoriť'
    },
    slider: {
      max: 'Maximum',
      min: 'Minimum',
      thumb: 'Posúvač',
      value: 'Hodnota {index} z {total}'
    },
    table: {
      noData: 'Žiadne dáta'
    },
    toast: {
      close: 'Zatvoriť'
    },
    toaster: {
      label: 'Oznámenie',
      viewport: 'Oznámenia ({hotkey})'
    }
  }
})
