import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Español',
  code: 'es',
  messages: {
    alert: {
      close: 'Cerrar'
    },
    authForm: {
      hidePassword: 'Ocultar contraseña',
      showPassword: 'Mostrar contraseña',
      submit: 'Continuar'
    },
    banner: {
      close: 'Cerrar'
    },
    calendar: {
      nextMonth: 'Mes siguiente',
      nextYear: 'Año siguiente',
      prevMonth: 'Mes anterior',
      prevYear: 'Año anterior'
    },
    carousel: {
      dots: 'Elegir diapositiva a mostrar',
      goto: 'Ir a la diapositiva {slide}',
      next: 'Siguiente',
      prev: 'Anterior'
    },
    chatPrompt: {
      placeholder: 'Escribe tu mensaje aquí…'
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
      close: 'Cerrar',
      noData: 'Sin datos',
      noMatch: 'No hay datos coincidentes',
      placeholder: 'Escribe un comando o busca…'
    },
    contentSearch: {
      links: 'Enlaces',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Buscar…'
    },
    contentToc: {
      title: 'En esta página'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Buscar…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Colapsar barra lateral',
      expand: 'Expandir barra lateral'
    },
    dashboardSidebarToggle: {
      close: 'Cerrar barra lateral',
      open: 'Abrir barra lateral'
    },
    error: {
      clear: 'Volver al inicio'
    },
    fileUpload: {
      removeFile: 'Eliminar {filename}'
    },
    header: {
      close: 'Cerrar menú',
      open: 'Abrir menú'
    },
    inputMenu: {
      create: 'Crear "{label}"',
      noData: 'Sin datos',
      noMatch: 'No hay datos coincidentes'
    },
    inputNumber: {
      decrement: 'Decrementar',
      increment: 'Incrementar'
    },
    modal: {
      close: 'Cerrar'
    },
    pricingTable: {
      caption: 'Comparación de planes de precios'
    },
    prose: {
      codeCollapse: {
        closeText: 'Colapsar',
        name: 'código',
        openText: 'Expandir'
      },
      collapsible: {
        closeText: 'Ocultar',
        name: 'propiedades',
        openText: 'Mostrar'
      },
      pre: {
        copy: 'Copiar código al portapapeles'
      }
    },
    selectMenu: {
      create: 'Crear "{label}"',
      noData: 'Sin datos',
      noMatch: 'No hay datos coincidentes',
      search: 'Buscar…'
    },
    slideover: {
      close: 'Cerrar'
    },
    table: {
      noData: 'Sin datos'
    },
    toast: {
      close: 'Cerrar'
    }
  }
})
