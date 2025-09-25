import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Русский',
  code: 'ru',
  messages: {
    alert: {
      close: 'Закрыть'
    },
    authForm: {
      hidePassword: 'Скрыть пароль',
      showPassword: 'Показать пароль',
      submit: 'Продолжить'
    },
    banner: {
      close: 'Закрыть'
    },
    calendar: {
      nextMonth: 'Следующий месяц',
      nextYear: 'Следующий год',
      prevMonth: 'Предыдущий месяц',
      prevYear: 'Предыдущий год'
    },
    carousel: {
      dots: 'Выберите слайд для отображения',
      goto: 'Перейти к {slide}',
      next: 'Далее',
      prev: 'Назад'
    },
    chatPrompt: {
      placeholder: 'Введите ваше сообщение здесь…'
    },
    chatPromptSubmit: {
      label: 'Отправить'
    },
    colorMode: {
      dark: 'Тёмная',
      light: 'Светлая',
      switchToDark: 'Переключиться на тёмный режим',
      switchToLight: 'Переключиться на светлый режим',
      system: 'Системная'
    },
    commandPalette: {
      back: 'Назад',
      close: 'Закрыть',
      noData: 'Нет данных',
      noMatch: 'Совпадений не найдено',
      placeholder: 'Введите команду или выполните поиск…'
    },
    contentSearch: {
      links: 'Ссылки',
      theme: 'Тема'
    },
    contentSearchButton: {
      label: 'Поиск…'
    },
    contentToc: {
      title: 'На этой странице'
    },
    dashboardSearch: {
      theme: 'Тема'
    },
    dashboardSearchButton: {
      label: 'Поиск…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Свернуть боковую панель',
      expand: 'Развернуть боковую панель'
    },
    dashboardSidebarToggle: {
      close: 'Закрыть боковую панель',
      open: 'Открыть боковую панель'
    },
    error: {
      clear: 'Вернуться на главную'
    },
    fileUpload: {
      removeFile: 'Удалить {filename}'
    },
    header: {
      close: 'Закрыть меню',
      open: 'Открыть меню'
    },
    inputMenu: {
      create: 'Создать "{label}"',
      noData: 'Нет данных',
      noMatch: 'Совпадений не найдено'
    },
    inputNumber: {
      decrement: 'Уменьшить',
      increment: 'Увеличить'
    },
    modal: {
      close: 'Закрыть'
    },
    pricingTable: {
      caption: 'Сравнение ценных планов'
    },
    prose: {
      codeCollapse: {
        closeText: 'Свернуть',
        name: 'код',
        openText: 'Развернуть'
      },
      collapsible: {
        closeText: 'Скрыть',
        name: 'свойства',
        openText: 'Показать'
      },
      pre: {
        copy: 'Скопировать код в буфер обмена'
      }
    },
    selectMenu: {
      create: 'Создать "{label}"',
      noData: 'Нет данных',
      noMatch: 'Совпадений не найдено',
      search: 'Поиск…'
    },
    slideover: {
      close: 'Закрыть'
    },
    table: {
      noData: 'Нет данных'
    },
    toast: {
      close: 'Закрыть'
    }
  }
})
