import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Shqip',
  code: 'sq',
  messages: {
    alert: {
      close: 'Mbyll'
    },
    authForm: {
      hidePassword: 'Fshih fjalëkalimin',
      showPassword: 'Shfaq fjalëkalimin',
      submit: 'Vazhdo'
    },
    banner: {
      close: 'Mbyll'
    },
    calendar: {
      nextMonth: 'Muaji tjetër',
      nextYear: 'Viti tjetër',
      prevMonth: 'Muaji i kaluar',
      prevYear: 'Viti i kaluar'
    },
    carousel: {
      dots: 'Zgjidh slajdin për të shfaqur',
      goto: 'Shko te slajdi {slide}',
      next: 'Tjetri',
      prev: 'Para'
    },
    chatPrompt: {
      placeholder: 'Shkruaj mesazhin tënd këtu…'
    },
    chatPromptSubmit: {
      label: 'Dërgo mesazhin'
    },
    colorMode: {
      dark: 'Errët',
      light: 'Ndritshëm',
      switchToDark: 'Kalo në modalitetin e errët',
      switchToLight: 'Kalo në modalitetin e ndritshëm',
      system: 'Sistem'
    },
    commandPalette: {
      back: 'Pas',
      close: 'Mbyll',
      noData: 'Nuk ka të dhëna',
      noMatch: 'Nuk ka të dhëna që përputhen',
      placeholder: 'Shkruaj një komandë ose kërko…'
    },
    contentSearch: {
      links: 'Lidhje',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Kërko…'
    },
    contentToc: {
      title: 'Në këtë faqe'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Kërko…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Palos panelin anësor',
      expand: 'Zgjero panelin anësor'
    },
    dashboardSidebarToggle: {
      close: 'Mbyll panelin anësor',
      open: 'Hap panelin anësor'
    },
    error: {
      clear: 'Kthehu në kryefaqe'
    },
    fileUpload: {
      removeFile: 'Hiq {filename}'
    },
    header: {
      close: 'Mbyll menunë',
      open: 'Hap menunë'
    },
    inputMenu: {
      create: 'Krijo "{label}"',
      noData: 'Nuk ka të dhëna',
      noMatch: 'Nuk ka të dhëna që përputhen'
    },
    inputNumber: {
      decrement: 'Zvogëlo',
      increment: 'Rrit'
    },
    modal: {
      close: 'Mbyll'
    },
    pricingTable: {
      caption: 'Krahasimi i planeve të çmimeve'
    },
    prose: {
      codeCollapse: {
        closeText: 'Palos',
        name: 'kodi',
        openText: 'Zgjero'
      },
      collapsible: {
        closeText: 'Fshih',
        name: 'vetitë',
        openText: 'Shfaq'
      },
      pre: {
        copy: 'Kopjo kodin në kujtesë'
      }
    },
    selectMenu: {
      create: 'Krijo "{label}"',
      noData: 'Nuk ka të dhëna',
      noMatch: 'Nuk ka të dhëna që përputhen',
      search: 'Kërko…'
    },
    slideover: {
      close: 'Mbyll'
    },
    table: {
      noData: 'Nuk ka të dhëna'
    },
    toast: {
      close: 'Mbyll'
    }
  }
})
