import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: '繁體中文',
  code: 'zh-TW',
  messages: {
    alert: {
      close: '關閉'
    },
    authForm: {
      hidePassword: '隱藏密碼',
      showPassword: '顯示密碼',
      submit: '繼續'
    },
    banner: {
      close: '關閉'
    },
    calendar: {
      nextMonth: '下個月',
      nextYear: '明年',
      prevMonth: '上個月',
      prevYear: '去年'
    },
    carousel: {
      dots: '選擇要顯示的投影片',
      goto: '跳轉到第 {slide} 頁',
      next: '下一頁',
      prev: '上一頁'
    },
    chatPrompt: {
      placeholder: '在這裡輸入你的消息…'
    },
    chatPromptSubmit: {
      label: '發送'
    },
    colorMode: {
      dark: '深色',
      light: '淺色',
      switchToDark: '切換到深色模式',
      switchToLight: '切換到淺色模式',
      system: '系統'
    },
    commandPalette: {
      back: '返回',
      close: '關閉',
      noData: '沒有資料',
      noMatch: '沒有相符的資料',
      placeholder: '輸入命令或搜尋…'
    },
    contentSearch: {
      links: '連結',
      theme: '主題'
    },
    contentSearchButton: {
      label: '搜尋…'
    },
    contentToc: {
      title: '本頁內容'
    },
    dashboardSearch: {
      theme: '主題'
    },
    dashboardSearchButton: {
      label: '搜尋…'
    },
    dashboardSidebarCollapse: {
      collapse: '收起側邊欄',
      expand: '展開側邊欄'
    },
    dashboardSidebarToggle: {
      close: '關閉側邊欄',
      open: '開啟側邊欄'
    },
    error: {
      clear: '返回首頁'
    },
    fileUpload: {
      removeFile: '移除 {filename}'
    },
    header: {
      close: '關閉選單',
      open: '開啟選單'
    },
    inputMenu: {
      create: '建立「{label}」',
      noData: '沒有資料',
      noMatch: '沒有相符的資料'
    },
    inputNumber: {
      decrement: '減少',
      increment: '增加'
    },
    modal: {
      close: '關閉'
    },
    pricingTable: {
      caption: '價格計畫比較'
    },
    prose: {
      codeCollapse: {
        closeText: '收起',
        name: '程式碼',
        openText: '展開'
      },
      collapsible: {
        closeText: '隱藏',
        name: '屬性',
        openText: '顯示'
      },
      pre: {
        copy: '複製程式碼到剪貼簿'
      }
    },
    selectMenu: {
      create: '建立「{label}」',
      noData: '沒有資料',
      noMatch: '沒有相符的資料',
      search: '搜尋…'
    },
    slideover: {
      close: '關閉'
    },
    table: {
      noData: '沒有資料'
    },
    toast: {
      close: '關閉'
    }
  }
})
