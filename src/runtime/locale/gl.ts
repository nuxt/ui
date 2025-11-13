import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Galego',
  code: 'gl',
  messages: {
    alert: {
      close: 'Pechar'
    },
    authForm: {
      hidePassword: 'Ocultar contrasinal',
      showPassword: 'Amosar contrasinal',
      submit: 'Continuar'
    },
    banner: {
      close: 'Pechar'
    },
    calendar: {
      nextMonth: 'Mes seguinte',
      nextYear: 'Ano seguinte',
      prevMonth: 'Mes anterior',
      prevYear: 'Ano anterior'
    },
    carousel: {
      dots: 'Escoller diapositiva a amostrar',
      goto: 'Ir á diapositiva {slide}',
      next: 'Seguinte',
      prev: 'Anterior'
    },
    chatPrompt: {
      placeholder: 'Escribe a túa mensaxe aquí…'
    },
    chatPromptSubmit: {
      label: 'Enviar'
    },
    colorMode: {
      dark: 'Oscuro',
      light: 'Claro',
      switchToDark: 'Cambiar a modo oscuro',
      switchToLight: 'Cambiar a modo claro',
      system: 'Sistema'
    },
    commandPalette: {
      back: 'Atrás',
      close: 'Pechar',
      noData: 'Sen datos',
      noMatch: 'Non hai datos coincidentes',
      placeholder: 'Escribe un comando ou busca…'
    },
    contentSearch: {
      links: 'Ligazóns',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Buscar…'
    },
    contentToc: {
      title: 'Nesta páxina'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Buscar…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Contraer barra lateral',
      expand: 'Despregar barra lateral'
    },
    dashboardSidebarToggle: {
      close: 'Pechar barra lateral',
      open: 'Abrir barra lateral'
    },
    error: {
      clear: 'Volver ao inicio'
    },
    fileUpload: {
      removeFile: 'Eliminar {filename}'
    },
    header: {
      close: 'Pechar menú',
      open: 'Abrir menú'
    },
    inputMenu: {
      create: 'Crear "{label}"',
      noData: 'Sen datos',
      noMatch: 'Non hai datos coincidentes'
    },
    inputNumber: {
      decrement: 'Diminuír',
      increment: 'Aumentar'
    },
    modal: {
      close: 'Pechar'
    },
    pricingTable: {
      caption: 'Comparación de plans de prezos'
    },
    prose: {
      codeCollapse: {
        closeText: 'Contraer',
        name: 'código',
        openText: 'Despregar'
      },
      collapsible: {
        closeText: 'Ocultar',
        name: 'propiedades',
        openText: 'Amosar'
      },
      pre: {
        copy: 'Copiar código ao portapapeis'
      }
    },
    selectMenu: {
      create: 'Crear "{label}"',
      noData: 'Sen datos',
      noMatch: 'Non hai datos coincidentes',
      search: 'Buscar…'
    },
    slideover: {
      close: 'Pechar'
    },
    table: {
      noData: 'Sen datos'
    },
    toast: {
      close: 'Pechar'
    }
  }
})
