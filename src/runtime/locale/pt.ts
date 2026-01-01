import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Português',
  code: 'pt',
  messages: {
    alert: {
      close: 'Fechar'
    },
    authForm: {
      hidePassword: 'Ocultar senha',
      showPassword: 'Mostrar senha',
      submit: 'Continuar'
    },
    banner: {
      close: 'Fechar'
    },
    calendar: {
      nextMonth: 'Próximo mês',
      nextYear: 'Próximo ano',
      prevMonth: 'Mês anterior',
      prevYear: 'Ano anterior'
    },
    carousel: {
      dots: 'Escolher slide para exibir',
      goto: 'Ir ao diapositivo {slide}',
      next: 'Próximo',
      prev: 'Anterior'
    },
    chatPrompt: {
      placeholder: 'Escreva a sua mensagem aqui…'
    },
    chatPromptSubmit: {
      label: 'Enviar'
    },
    colorMode: {
      dark: 'Escuro',
      light: 'Claro',
      switchToDark: 'Mudar para modo escuro',
      switchToLight: 'Mudar para modo claro',
      system: 'Sistema'
    },
    commandPalette: {
      back: 'Voltar',
      close: 'Fechar',
      noData: 'Sem dados',
      noMatch: 'Nenhum dado correspondente',
      placeholder: 'Digite um comando ou pesquise…'
    },
    contentSearch: {
      links: 'Links',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Pesquisar…'
    },
    contentToc: {
      title: 'Nesta página'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Pesquisar…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Recolher barra lateral',
      expand: 'Expandir barra lateral'
    },
    dashboardSidebarToggle: {
      close: 'Fechar barra lateral',
      open: 'Abrir barra lateral'
    },
    error: {
      clear: 'Voltar para a página inicial'
    },
    fileUpload: {
      removeFile: 'Remover {filename}'
    },
    header: {
      close: 'Fechar menu',
      open: 'Abrir menu'
    },
    inputMenu: {
      create: 'Criar "{label}"',
      noData: 'Sem dados',
      noMatch: 'Nenhum dado correspondente'
    },
    inputNumber: {
      decrement: 'Decrementar',
      increment: 'Incrementar'
    },
    modal: {
      close: 'Fechar'
    },
    pricingTable: {
      caption: 'Comparação de planos de preços'
    },
    prose: {
      codeCollapse: {
        closeText: 'Recolher',
        name: 'código',
        openText: 'Expandir'
      },
      collapsible: {
        closeText: 'Ocultar',
        name: 'propriedades',
        openText: 'Mostrar'
      },
      pre: {
        copy: 'Copiar código para a área de transferência'
      }
    },
    selectMenu: {
      create: 'Criar "{label}"',
      noData: 'Sem dados',
      noMatch: 'Nenhum dado correspondente',
      search: 'Pesquisar…'
    },
    slideover: {
      close: 'Fechar'
    },
    table: {
      noData: 'Sem dados'
    },
    toast: {
      close: 'Fechar'
    }
  }
})
