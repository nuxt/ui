import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: '简体中文',
  code: 'zh-CN',
  messages: {
    inputMenu: {
      noMatch: '没有匹配的数据',
      noData: '没有数据',
      create: '创建 "{label}"'
    },
    calendar: {
      prevYear: '去年',
      nextYear: '明年',
      prevMonth: '上个月',
      nextMonth: '下个月'
    },
    inputNumber: {
      increment: '增加',
      decrement: '减少'
    },
    commandPalette: {
      placeholder: '输入命令或搜索...',
      noMatch: '没有匹配的数据',
      noData: '没有数据',
      close: '关闭',
      back: '返回'
    },
    selectMenu: {
      noMatch: '没有匹配的数据',
      noData: '没有数据',
      create: '创建 "{label}"',
      search: '搜索...'
    },
    toast: {
      close: '关闭'
    },
    carousel: {
      prev: '上一页',
      next: '下一页',
      goto: '跳转到第 {slide} 页'
    },
    modal: {
      close: '关闭'
    },
    slideover: {
      close: '关闭'
    },
    alert: {
      close: '关闭'
    },
    table: {
      noData: '没有数据'
    }
  }
})
