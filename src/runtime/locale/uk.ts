import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'навігаційний ланцюжок'
    },
    calendar: {
      label: 'Дата події',
      monthPicker: 'Вибір місяця',
      nextMonth: 'Наступний місяць',
      nextYear: 'Наступний рік',
      prevMonth: 'Попередній місяць',
      prevYear: 'Попередній рік',
      yearPicker: 'Вибір року'
    },
    carousel: {
      dots: 'Виберіть слайд для відображення',
      goto: 'Перейти до {slide}',
      next: 'Далі',
      prev: 'Назад',
      roledescription: 'карусель',
      slide: 'слайд'
    },
    chatMessages: {
      autoScroll: 'Прокрутити вниз'
    },
    chatPrompt: {
      placeholder: 'Введіть ваше повідомлення тут…'
    },
    chatPromptSubmit: {
      label: 'Відправити',
      reload: 'Повторити',
      stop: 'Зупинити генерацію'
    },
    chatReasoning: {
      thinking: 'Думає…',
      thought: 'Подумав',
      thoughtFor: 'Думав {duration}'
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
      search: 'Результати',
      theme: 'Тема'
    },
    contentSearchButton: {
      label: 'Пошук…'
    },
    contentToc: {
      title: 'На цій сторінці'
    },
    dropdownMenu: {
      noMatch: 'Збігів не знайдено',
      search: 'Пошук…'
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
    drawer: {
      close: 'Закрити'
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
    inputDate: {
      day: 'день',
      dayPeriod: 'AM/PM',
      era: 'ера',
      hour: 'година',
      minute: 'хвилина',
      month: 'місяць',
      second: 'секунда',
      timeZoneName: 'часовий пояс',
      year: 'рік'
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
    inputRating: {
      rate: 'Оцінити на {value} з {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'година',
      minute: 'хвилина',
      second: 'секунда',
      timeZoneName: 'часовий пояс'
    },
    listbox: {
      noData: 'Немає даних',
      noMatch: 'Збігів не знайдено',
      search: 'Пошук…'
    },
    modal: {
      close: 'Закрити'
    },
    pagination: {
      first: 'Перша сторінка',
      last: 'Остання сторінка',
      next: 'Наступна сторінка',
      page: 'Сторінка {page}',
      prev: 'Попередня сторінка'
    },
    pinInput: {
      input: 'PIN-код, символ {index} з {length}'
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
      },
      prompt: {
        copy: 'Копіювати запит',
        openIn: 'Відкрити у {name}'
      }
    },
    sidebar: {
      close: 'Закрити',
      toggle: 'Перемикнути'
    },
    selectMenu: {
      create: 'Створити "{label}"',
      noData: 'Немає даних',
      noMatch: 'Збігів не знайдено',
      search: 'Пошук…'
    },
    skeleton: {
      label: 'завантаження'
    },
    slideover: {
      close: 'Закрити'
    },
    slider: {
      max: 'Максимум',
      min: 'Мінімум',
      thumb: 'Повзунок',
      value: 'Значення {index} з {total}'
    },
    table: {
      noData: 'Немає даних'
    },
    toast: {
      close: 'Закрити'
    },
    toaster: {
      label: 'Сповіщення',
      viewport: 'Сповіщення ({hotkey})'
    }
  }
})
