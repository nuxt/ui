import type { Messages } from '../types'
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
    calendar: {
      nextMonth: 'Mes següent',
      nextYear: 'Any següent',
      prevMonth: 'Mes anterior',
      prevYear: 'Any anterior'
    },
    carousel: {
      dots: 'Tria la diapositiva a mostrar',
      goto: 'Anar a la diapositiva {slide}',
      next: 'Següent',
      prev: 'Anterior'
    },
    chatPrompt: {
      placeholder: 'Escriu el teu missatge aquí…'
    },
    chatPromptSubmit: {
      label: 'Enviar'
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
      noData: 'Sense dades',
      noMatch: 'No hi ha dades coincidents',
      placeholder: 'Escriu una ordre o cerca…'
    },
    contentSearch: {
      links: 'Enllaços',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Cercar…'
    },
    contentToc: {
      title: 'En aquesta pàgina'
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
    inputMenu: {
      create: 'Crear "{label}"',
      noData: 'Sense dades',
      noMatch: 'No hi ha dades coincidents'
    },
    inputNumber: {
      decrement: 'Decrementar',
      increment: 'Incrementar'
    },
    modal: {
      close: 'Tancar'
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
      }
    },
    selectMenu: {
      create: 'Crear "{label}"',
      noData: 'Sense dades',
      noMatch: 'No hi ha dades coincidents',
      search: 'Cerca…'
    },
    slideover: {
      close: 'Tancar'
    },
    table: {
      noData: 'Sense dades'
    },
    toast: {
      close: 'Tancar'
    }
  }
})
