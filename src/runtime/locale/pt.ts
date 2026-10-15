import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'trilho de navegação'
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
      goto: 'Ir ao diapositivo {slide}',
      next: 'Próximo',
      prev: 'Anterior',
      roledescription: 'carrossel',
      slide: 'diapositivo'
    },
    chatAttachment: {
      uploading: 'A carregar',
      error: 'Falha ao carregar'
    },
    chatMessages: {
      autoScroll: 'Deslocar para baixo'
    },
    chatPrompt: {
      placeholder: 'Escreva a sua mensagem aqui…',
      queue: 'Mensagens em fila',
      sendNow: 'Enviar agora',
      edit: 'Editar',
      remove: 'Remover'
    },
    chatPromptSubmit: {
      label: 'Enviar',
      reload: 'Tentar novamente',
      stop: 'Parar geração'
    },
    chatReasoning: {
      thinking: 'A pensar…',
      thought: 'Pensou',
      thoughtFor: 'Pensou durante {duration}'
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
      filterPlaceholder: 'Digite um comando ou pesquise…',
      noData: 'Sem dados',
      noMatch: 'Nenhum dado correspondente',
      results: 'Resultados'
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
      filterPlaceholder: 'Pesquisar…',
      noMatch: 'Nenhum dado correspondente'
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
      noData: 'Sem dados',
      noMatch: 'Nenhum dado correspondente',
      trigger: 'Mostrar opções'
    },
    inputNumber: {
      decrement: 'Decrementar',
      increment: 'Incrementar',
      roledescription: 'campo numérico'
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
      filterPlaceholder: 'Pesquisar…',
      noData: 'Sem dados',
      noMatch: 'Nenhum dado correspondente'
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
      input: 'código PIN, carácter {index} de {length}'
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
        openIn: 'Abrir em {name}'
      }
    },
    sidebar: {
      close: 'Fechar',
      toggle: 'Alternar'
    },
    selectMenu: {
      create: 'Criar "{label}"',
      filterPlaceholder: 'Pesquisar…',
      noData: 'Sem dados',
      noMatch: 'Nenhum dado correspondente'
    },
    skeleton: {
      label: 'a carregar'
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
    stepper: {
      label: 'progresso'
    },
    table: {
      noData: 'Sem dados'
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
