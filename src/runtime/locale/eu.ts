import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Euskera',
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
    calendar: {
      nextMonth: 'Hurrengo hilabetea',
      nextYear: 'Hurrengo urtea',
      prevMonth: 'Aurretiko hilabetea',
      prevYear: 'Aurretiko urtea'
    },
    carousel: {
      dots: 'Erakutsi beharreko diapositiba aukeratu',
      goto: 'Joan diapositibara {slide}',
      next: 'Hurrengoa',
      prev: 'Aurretikoa'
    },
    chatPrompt: {
      placeholder: 'Idatzi zure mezua hemen...'
    },
    chatPromptSubmit: {
      label: 'Bidali'
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
      placeholder: 'Idatzi komando bat edo bilatu...'
    },
    contentSearch: {
      links: 'Estekak',
      theme: 'Gaia'
    },
    contentSearchButton: {
      label: 'Bilatu…'
    },
    contentToc: {
      title: 'Orri honetan'
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
    inputMenu: {
      create: 'Sortu {label}',
      noData: 'Daturik gabe',
      noMatch: 'Ez da datu bat ere aurkitu'
    },
    inputNumber: {
      decrement: 'Murriztu',
      increment: 'Handitu'
    },
    modal: {
      close: 'Itxi'
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
      }
    },
    selectMenu: {
      create: 'Sortu {label}',
      noData: 'Daturik gabe',
      noMatch: 'Ez da datu bat ere aurkitu',
      search: 'Bilatu…'
    },
    slideover: {
      close: 'Itxi'
    },
    table: {
      noData: 'Daturik gabe'
    },
    toast: {
      close: 'Itxi'
    }
  }
})
