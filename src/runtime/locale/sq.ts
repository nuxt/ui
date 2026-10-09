import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'shtegu i navigimit'
    },
    calendar: {
      label: 'Data e ngjarjes',
      monthPicker: 'Zgjedhësi i muajit',
      nextMonth: 'Muaji tjetër',
      nextYear: 'Viti tjetër',
      prevMonth: 'Muaji i kaluar',
      prevYear: 'Viti i kaluar',
      yearPicker: 'Zgjedhësi i vitit'
    },
    carousel: {
      dots: 'Zgjidh slajdin për të shfaqur',
      goto: 'Shko te slajdi {slide}',
      next: 'Tjetri',
      prev: 'Para',
      roledescription: 'karusel',
      slide: 'slajd'
    },
    chatMessages: {
      autoScroll: 'Lëviz poshtë'
    },
    chatPrompt: {
      placeholder: 'Shkruaj mesazhin tënd këtu…'
    },
    chatPromptSubmit: {
      label: 'Dërgo mesazhin',
      reload: 'Provo përsëri',
      stop: 'Ndalo gjenerimin'
    },
    chatReasoning: {
      thinking: 'Po mendon…',
      thought: 'Mendoi',
      thoughtFor: 'Mendoi për {duration}'
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
      search: 'Rezultatet',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Kërko…'
    },
    contentToc: {
      title: 'Në këtë faqe'
    },
    dropdownMenu: {
      noMatch: 'Nuk ka të dhëna që përputhen',
      search: 'Kërko…'
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
    drawer: {
      close: 'Mbyll'
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
    inputDate: {
      day: 'ditë',
      dayPeriod: 'AM/PM',
      era: 'epokë',
      hour: 'orë',
      minute: 'minutë',
      month: 'muaj',
      second: 'sekondë',
      timeZoneName: 'zona kohore',
      year: 'vit'
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
    inputRating: {
      rate: 'Vlerëso me {value} nga {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'orë',
      minute: 'minutë',
      second: 'sekondë',
      timeZoneName: 'zona kohore'
    },
    listbox: {
      noData: 'Nuk ka të dhëna',
      noMatch: 'Nuk ka të dhëna që përputhen',
      search: 'Kërko…'
    },
    modal: {
      close: 'Mbyll'
    },
    pagination: {
      first: 'Faqja e parë',
      last: 'Faqja e fundit',
      next: 'Faqja tjetër',
      page: 'Faqja {page}',
      prev: 'Faqja e mëparshme'
    },
    pinInput: {
      input: 'kodi PIN, karakteri {index} nga {length}'
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
      },
      prompt: {
        copy: 'Kopjo komandën',
        openIn: 'Hap në {name}'
      }
    },
    sidebar: {
      close: 'Mbyll',
      toggle: 'Ndërro'
    },
    selectMenu: {
      create: 'Krijo "{label}"',
      noData: 'Nuk ka të dhëna',
      noMatch: 'Nuk ka të dhëna që përputhen',
      search: 'Kërko…'
    },
    skeleton: {
      label: 'po ngarkohet'
    },
    slideover: {
      close: 'Mbyll'
    },
    slider: {
      max: 'Maksimumi',
      min: 'Minimumi',
      thumb: 'Rrëshqitësi',
      value: 'Vlera {index} nga {total}'
    },
    table: {
      noData: 'Nuk ka të dhëna'
    },
    toast: {
      close: 'Mbyll'
    },
    toaster: {
      label: 'Njoftim',
      viewport: 'Njoftime ({hotkey})'
    }
  }
})
