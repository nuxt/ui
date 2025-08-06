import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Português (Brasil)',
  code: 'pt-BR',
  messages: {
    authForm: {
      submit: 'Continuar',
      hidePassword: 'Ocultar senha',
      showPassword: 'Mostrar senha'
    },
    banner: {
      close: 'Fechar'
    },
    chatPrompt: {
      placeholder: 'Escreva sua mensagem aqui...'
    },
    chatPromptSubmit: {
      label: 'Enviar'
    },
    colorMode: {
      system: 'Sistema',
      light: 'Claro',
      dark: 'Escuro',
      switchToLight: 'Mudar para modo claro',
      switchToDark: 'Mudar para modo escuro'
    },
    contentSearch: {
      links: 'Links',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Pesquisar...'
    },
    contentToc: {
      title: 'Nesta página'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Pesquisar...'
    },
    dashboardSidebarCollapse: {
      expand: 'Expandir barra lateral',
      collapse: 'Recolher barra lateral'
    },
    dashboardSidebarToggle: {
      close: 'Fechar barra lateral',
      open: 'Abrir barra lateral'
    },
    error: {
      clear: 'Voltar para a página inicial'
    },
    header: {
      close: 'Fechar menu',
      open: 'Abrir menu'
    },
    pricingTable: {
      caption: 'Comparação de planos de preços'
    },
    prose: {
      codeCollapse: {
        name: 'código',
        openText: 'Expandir',
        closeText: 'Recolher'
      },
      collapsible: {
        name: 'propriedades',
        openText: 'Mostrar',
        closeText: 'Ocultar'
      },
      pre: {
        copy: 'Copiar código para a área de transferência'
      }
    },
    inputMenu: {
      noMatch: 'Nenhum dado correspondente',
      noData: 'Nenhum dado',
      create: 'Criar "{label}"'
    },
    calendar: {
      prevYear: 'Ano anterior',
      nextYear: 'Próximo ano',
      prevMonth: 'Mês anterior',
      nextMonth: 'Próximo mês'
    },
    inputNumber: {
      increment: 'Incrementar',
      decrement: 'Decrementar'
    },
    commandPalette: {
      placeholder: 'Digite um comando ou pesquise...',
      noMatch: 'Nenhum dado correspondente',
      noData: 'Nenhum dado',
      close: 'Fechar',
      back: 'Voltar'
    },
    selectMenu: {
      noMatch: 'Nenhum dado correspondente',
      noData: 'Nenhum dado',
      create: 'Criar "{label}"',
      search: 'Pesquisar...'
    },
    toast: {
      close: 'Fechar'
    },
    carousel: {
      prev: 'Anterior',
      next: 'Próximo',
      dots: 'Escolher slide para exibir',
      goto: 'Ir para a slide {slide}'
    },
    modal: {
      close: 'Fechar'
    },
    slideover: {
      close: 'Fechar'
    },
    alert: {
      close: 'Fechar'
    },
    table: {
      noData: 'Nenhum dado'
    },
    fileUpload: {
      removeFile: 'Remover {filename}'
    }
  }
})
