import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Українська',
  code: 'uk',
  messages: {
    alert: {
      close: 'Закрити'
    },
    authForm: {
      hidePassword: 'Приховати пароль',
      showPassword: 'Показати пароль',
      submit: 'Продовжити'
    },
    banner: {
      close: 'Закрити'
    },
    calendar: {
      nextMonth: 'Наступний місяць',
      nextYear: 'Наступний рік',
      prevMonth: 'Попередній місяць',
      prevYear: 'Попередній рік'
    },
    carousel: {
      dots: 'Виберіть слайд для відображення',
      goto: 'Перейти до {slide}',
      next: 'Далі',
      prev: 'Назад'
    },
    chatPrompt: {
      placeholder: 'Введіть ваше повідомлення тут…'
    },
    chatPromptSubmit: {
      label: 'Відправити'
    },
    colorMode: {
      dark: 'Темна',
      light: 'Світла',
      switchToDark: 'Перейти до темного режиму',
      switchToLight: 'Перейти до світлого режиму',
      system: 'Системна'
    },
    commandPalette: {
      back: 'Назад',
      close: 'Закрити',
      noData: 'Немає даних',
      noMatch: 'Збігів не знайдено',
      placeholder: 'Введіть команду або шукайте…'
    },
    contentSearch: {
      links: 'Посилання',
      theme: 'Тема'
    },
    contentSearchButton: {
      label: 'Пошук…'
    },
    contentToc: {
      title: 'На цій сторінці'
    },
    dashboardSearch: {
      theme: 'Тема'
    },
    dashboardSearchButton: {
      label: 'Пошук…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Згорнути бічну панель',
      expand: 'Розгорнути бічну панель'
    },
    dashboardSidebarToggle: {
      close: 'Закрити бічну панель',
      open: 'Відкрити бічну панель'
    },
    error: {
      clear: 'Повернутися на головну'
    },
    fileUpload: {
      removeFile: 'Видалити {filename}'
    },
    header: {
      close: 'Закрити меню',
      open: 'Відкрити меню'
    },
    inputMenu: {
      create: 'Створити "{label}"',
      noData: 'Немає даних',
      noMatch: 'Збігів не знайдено'
    },
    inputNumber: {
      decrement: 'Зменшити',
      increment: 'Збільшити'
    },
    modal: {
      close: 'Закрити'
    },
    pricingTable: {
      caption: 'Порівняння планів цін'
    },
    prose: {
      codeCollapse: {
        closeText: 'Згорнути',
        name: 'код',
        openText: 'Розгорнути'
      },
      collapsible: {
        closeText: 'Сховати',
        name: 'властивості',
        openText: 'Показати'
      },
      pre: {
        copy: 'Копіювати код у буфер обміну'
      }
    },
    selectMenu: {
      create: 'Створити "{label}"',
      noData: 'Немає даних',
      noMatch: 'Збігів не знайдено',
      search: 'Пошук…'
    },
    slideover: {
      close: 'Закрити'
    },
    table: {
      noData: 'Немає даних'
    },
    toast: {
      close: 'Закрити'
    }
  }
})
