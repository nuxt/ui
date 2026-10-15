import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Català',
  code: 'ca',
  messages: {
    alert: {
      close: 'Tancar'
    },
    authForm: {
      hidePassword: 'Amagar contrasenya',
      showPassword: 'Mostrar contrasenya',
      submit: 'Continuar'
    },
    banner: {
      close: 'Tancar'
    },
    breadcrumb: {
      label: 'ruta de navegació'
    },
    calendar: {
      label: 'Data de l\'esdeveniment',
      monthPicker: 'Selector de mes',
      nextMonth: 'Mes següent',
      nextYear: 'Any següent',
      prevMonth: 'Mes anterior',
      prevYear: 'Any anterior',
      yearPicker: 'Selector d\'any'
    },
    carousel: {
      dots: 'Tria la diapositiva a mostrar',
      goto: 'Anar a la diapositiva {slide}',
      next: 'Següent',
      prev: 'Anterior',
      roledescription: 'carrusel',
      slide: 'diapositiva'
    },
    chatAttachment: {
      uploading: 'S\'està pujant',
      error: 'No s\'ha pogut pujar'
    },
    chatMessages: {
      autoScroll: 'Desplaçar cap avall'
    },
    chatPrompt: {
      placeholder: 'Escriu el teu missatge aquí…',
      queue: 'Missatges a la cua',
      sendNow: 'Envia ara',
      edit: 'Edita',
      remove: 'Elimina'
    },
    chatPromptSubmit: {
      label: 'Enviar',
      reload: 'Tornar a provar',
      stop: 'Aturar la generació'
    },
    chatReasoning: {
      thinking: 'Pensant…',
      thought: 'Ha pensat',
      thoughtFor: 'Ha pensat durant {duration}'
    },
    colorMode: {
      dark: 'Fosc',
      light: 'Clar',
      switchToDark: 'Canviar a mode fosc',
      switchToLight: 'Canviar a mode clar',
      system: 'Sistema'
    },
    commandPalette: {
      back: 'Enrere',
      close: 'Tancar',
      filterPlaceholder: 'Escriu una ordre o cerca…',
      noData: 'Sense dades',
      noMatch: 'No hi ha dades coincidents',
      results: 'Resultats'
    },
    contentSearch: {
      links: 'Enllaços',
      search: 'Resultats',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Cercar…'
    },
    contentToc: {
      title: 'En aquesta pàgina'
    },
    dropdownMenu: {
      filterPlaceholder: 'Cerca…',
      noMatch: 'No hi ha dades coincidents'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Cercar…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Contraure barra lateral',
      expand: 'Expandir barra lateral'
    },
    dashboardSidebarToggle: {
      close: 'Tancar barra lateral',
      open: 'Obrir barra lateral'
    },
    drawer: {
      close: 'Tancar'
    },
    error: {
      clear: 'Tornar a l\'inici'
    },
    fileUpload: {
      removeFile: 'Eliminar {filename}'
    },
    header: {
      close: 'Tancar menú',
      open: 'Obrir menú'
    },
    inputDate: {
      day: 'dia',
      dayPeriod: 'AM/PM',
      era: 'era',
      hour: 'hora',
      minute: 'minut',
      month: 'mes',
      second: 'segon',
      timeZoneName: 'zona horària',
      year: 'any'
    },
    inputMenu: {
      create: 'Crear "{label}"',
      noData: 'Sense dades',
      noMatch: 'No hi ha dades coincidents',
      trigger: 'Mostra les opcions'
    },
    inputNumber: {
      decrement: 'Decrementar',
      increment: 'Incrementar',
      roledescription: 'camp numèric'
    },
    inputRating: {
      rate: 'Valorar {value} de {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'hora',
      minute: 'minut',
      second: 'segon',
      timeZoneName: 'zona horària'
    },
    listbox: {
      filterPlaceholder: 'Cerca…',
      noData: 'Sense dades',
      noMatch: 'No hi ha dades coincidents'
    },
    modal: {
      close: 'Tancar'
    },
    pagination: {
      first: 'Primera pàgina',
      last: 'Última pàgina',
      next: 'Pàgina següent',
      page: 'Pàgina {page}',
      prev: 'Pàgina anterior'
    },
    pinInput: {
      input: 'codi PIN, caràcter {index} de {length}'
    },
    pricingTable: {
      caption: 'Comparació de plans de preu'
    },
    prose: {
      codeCollapse: {
        closeText: 'Replega',
        name: 'codi',
        openText: 'Desplega'
      },
      collapsible: {
        closeText: 'Amaga',
        name: 'propietats',
        openText: 'Mostra'
      },
      pre: {
        copy: 'Copiar codi al portapapers'
      },
      prompt: {
        copy: 'Copiar instrucció',
        openIn: 'Obrir a {name}'
      }
    },
    sidebar: {
      close: 'Tancar',
      toggle: 'Canviar'
    },
    selectMenu: {
      create: 'Crear "{label}"',
      filterPlaceholder: 'Cerca…',
      noData: 'Sense dades',
      noMatch: 'No hi ha dades coincidents'
    },
    skeleton: {
      label: 'carregant'
    },
    slideover: {
      close: 'Tancar'
    },
    slider: {
      max: 'Màxim',
      min: 'Mínim',
      thumb: 'Cursor',
      value: 'Valor {index} de {total}'
    },
    stepper: {
      label: 'progrés'
    },
    table: {
      noData: 'Sense dades'
    },
    toast: {
      close: 'Tancar'
    },
    toaster: {
      label: 'Notificació',
      viewport: 'Notificacions ({hotkey})'
    }
  }
})
