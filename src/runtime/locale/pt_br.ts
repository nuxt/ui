import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Português (Brasil)',
  code: 'pt-BR',
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
    breadcrumb: {
      label: 'trilha de navegação'
    },
    calendar: {
      label: 'Data do evento',
      monthPicker: 'Seletor de mês',
      nextMonth: 'Próximo mês',
      nextYear: 'Próximo ano',
      prevMonth: 'Mês anterior',
      prevYear: 'Ano anterior',
      yearPicker: 'Seletor de ano'
    },
    carousel: {
      dots: 'Escolher slide para exibir',
      goto: 'Ir para a slide {slide}',
      next: 'Próximo',
      prev: 'Anterior',
      roledescription: 'carrossel',
      slide: 'slide'
    },
    chatMessages: {
      autoScroll: 'Rolar para baixo'
    },
    chatPrompt: {
      placeholder: 'Escreva sua mensagem aqui…'
    },
    chatPromptSubmit: {
      label: 'Enviar',
      reload: 'Tentar novamente',
      stop: 'Parar geração'
    },
    chatReasoning: {
      thinking: 'Pensando…',
      thought: 'Pensou',
      thoughtFor: 'Pensou por {duration}'
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
      noData: 'Nenhum dado',
      noMatch: 'Nenhum dado correspondente',
      placeholder: 'Digite um comando ou pesquise…'
    },
    contentSearch: {
      links: 'Links',
      search: 'Resultados',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Pesquisar…'
    },
    contentToc: {
      title: 'Nesta página'
    },
    dropdownMenu: {
      noMatch: 'Nenhum dado correspondente',
      search: 'Pesquisar…'
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
    drawer: {
      close: 'Fechar'
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
    inputDate: {
      day: 'dia',
      dayPeriod: 'AM/PM',
      era: 'era',
      hour: 'hora',
      minute: 'minuto',
      month: 'mês',
      second: 'segundo',
      timeZoneName: 'fuso horário',
      year: 'ano'
    },
    inputMenu: {
      create: 'Criar "{label}"',
      noData: 'Nenhum dado',
      noMatch: 'Nenhum dado correspondente'
    },
    inputNumber: {
      decrement: 'Decrementar',
      increment: 'Incrementar'
    },
    inputRating: {
      rate: 'Avaliar com {value} de {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'hora',
      minute: 'minuto',
      second: 'segundo',
      timeZoneName: 'fuso horário'
    },
    listbox: {
      noData: 'Nenhum dado',
      noMatch: 'Nenhum dado correspondente',
      search: 'Pesquisar…'
    },
    modal: {
      close: 'Fechar'
    },
    pagination: {
      first: 'Primeira página',
      last: 'Última página',
      next: 'Próxima página',
      page: 'Página {page}',
      prev: 'Página anterior'
    },
    pinInput: {
      input: 'código PIN, caractere {index} de {length}'
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
      },
      prompt: {
        copy: 'Copiar prompt',
        openIn: 'Abrir no {name}'
      }
    },
    sidebar: {
      close: 'Fechar',
      toggle: 'Alternar'
    },
    selectMenu: {
      create: 'Criar "{label}"',
      noData: 'Nenhum dado',
      noMatch: 'Nenhum dado correspondente',
      search: 'Pesquisar…'
    },
    skeleton: {
      label: 'carregando'
    },
    slideover: {
      close: 'Fechar'
    },
    slider: {
      max: 'Máximo',
      min: 'Mínimo',
      thumb: 'Cursor',
      value: 'Valor {index} de {total}'
    },
    table: {
      noData: 'Nenhum dado'
    },
    toast: {
      close: 'Fechar'
    },
    toaster: {
      label: 'Notificação',
      viewport: 'Notificações ({hotkey})'
    }
  }
})
