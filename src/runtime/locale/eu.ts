import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Euskara',
  code: 'eu',
  messages: {
    alert: {
      close: 'Itxi'
    },
    authForm: {
      hidePassword: 'Pasahitza ezkutatu',
      showPassword: 'Pasahitza erakutsi',
      submit: 'Jarraitu'
    },
    banner: {
      close: 'Itxi'
    },
    breadcrumb: {
      label: 'nabigazio-bidea'
    },
    calendar: {
      label: 'Gertaeraren data',
      monthPicker: 'Hilabete-hautatzailea',
      nextMonth: 'Hurrengo hilabetea',
      nextYear: 'Hurrengo urtea',
      prevMonth: 'Aurretiko hilabetea',
      prevYear: 'Aurretiko urtea',
      yearPicker: 'Urte-hautatzailea'
    },
    carousel: {
      dots: 'Erakutsi beharreko diapositiba aukeratu',
      goto: 'Joan diapositibara {slide}',
      next: 'Hurrengoa',
      prev: 'Aurretikoa',
      roledescription: 'karrusela',
      slide: 'diapositiba'
    },
    chatMessages: {
      autoScroll: 'Korritu behera'
    },
    chatPrompt: {
      placeholder: 'Idatzi zure mezua hemen…'
    },
    chatPromptSubmit: {
      label: 'Bidali',
      reload: 'Saiatu berriro',
      stop: 'Gelditu sortzea'
    },
    chatReasoning: {
      thinking: 'Pentsatzen…',
      thought: 'Pentsatu du',
      thoughtFor: '{duration} pentsatzen'
    },
    colorMode: {
      dark: 'Iluna',
      light: 'Argia',
      switchToDark: 'Aldatu ilunera',
      switchToLight: 'Aldatu argira',
      system: 'Sistema'
    },
    commandPalette: {
      back: 'Atzera',
      close: 'Itxi',
      noData: 'Daturik gabe',
      noMatch: 'Ez da datu bat ere aurkitu',
      placeholder: 'Idatzi komando bat edo bilatu…'
    },
    contentSearch: {
      links: 'Estekak',
      search: 'Emaitzak',
      theme: 'Gaia'
    },
    contentSearchButton: {
      label: 'Bilatu…'
    },
    contentToc: {
      title: 'Orri honetan'
    },
    dropdownMenu: {
      noMatch: 'Ez da datu bat ere aurkitu',
      search: 'Bilatu…'
    },
    dashboardSearch: {
      theme: 'Gaia'
    },
    dashboardSearchButton: {
      label: 'Bilatu…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Alboko barra itxi',
      expand: 'Alboko barra zabaldu'
    },
    dashboardSidebarToggle: {
      close: 'Alboko barra itxi',
      open: 'Alboko barra zabaldu'
    },
    drawer: {
      close: 'Itxi'
    },
    error: {
      clear: 'Hasierara itzuli'
    },
    fileUpload: {
      removeFile: 'Ezabatu {filename}'
    },
    header: {
      close: 'Menua itxi',
      open: 'Menua zabaldu'
    },
    inputDate: {
      day: 'eguna',
      dayPeriod: 'AM/PM',
      era: 'aroa',
      hour: 'ordua',
      minute: 'minutua',
      month: 'hilabetea',
      second: 'segundoa',
      timeZoneName: 'ordu-zona',
      year: 'urtea'
    },
    inputMenu: {
      create: 'Sortu {label}',
      noData: 'Daturik gabe',
      noMatch: 'Ez da datu bat ere aurkitu'
    },
    inputNumber: {
      decrement: 'Murriztu',
      increment: 'Handitu'
    },
    inputRating: {
      rate: 'Baloratu {length}(e)tik {value}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'ordua',
      minute: 'minutua',
      second: 'segundoa',
      timeZoneName: 'ordu-zona'
    },
    listbox: {
      noData: 'Daturik gabe',
      noMatch: 'Ez da datu bat ere aurkitu',
      search: 'Bilatu…'
    },
    modal: {
      close: 'Itxi'
    },
    pagination: {
      first: 'Lehen orria',
      last: 'Azken orria',
      next: 'Hurrengo orria',
      page: '{page}. orria',
      prev: 'Aurreko orria'
    },
    pinInput: {
      input: 'PIN kodea, {length}(e)tik {index}. karakterea'
    },
    pricingTable: {
      caption: 'Prezio-plana alderatzea'
    },
    prose: {
      codeCollapse: {
        closeText: 'Murriztu',
        name: 'kodea',
        openText: 'Zabaldu'
      },
      collapsible: {
        closeText: 'Ezkutatu',
        name: 'propietateak',
        openText: 'Erakutsi'
      },
      pre: {
        copy: 'Kopiatu kodea clipboard-era'
      },
      prompt: {
        copy: 'Kopiatu prompt',
        openIn: '{name}(e)n ireki'
      }
    },
    sidebar: {
      close: 'Itxi',
      toggle: 'Txandakatu'
    },
    selectMenu: {
      create: 'Sortu {label}',
      noData: 'Daturik gabe',
      noMatch: 'Ez da datu bat ere aurkitu',
      search: 'Bilatu…'
    },
    skeleton: {
      label: 'kargatzen'
    },
    slideover: {
      close: 'Itxi'
    },
    slider: {
      max: 'Maximoa',
      min: 'Minimoa',
      thumb: 'Graduatzailea',
      value: '{total}(e)tik {index}. balioa'
    },
    table: {
      noData: 'Daturik gabe'
    },
    toast: {
      close: 'Itxi'
    },
    toaster: {
      label: 'Jakinarazpena',
      viewport: 'Jakinarazpenak ({hotkey})'
    }
  }
})
