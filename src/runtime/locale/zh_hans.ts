import { defineLocale } from '../composables/defineLocale'

export default defineLocale({
  name: '简体中文',
  code: 'zh-Hans',
  ui: {
    inputMenu: {
      noMatch: '没有匹配的数据',
      noData: '没有数据',
      create: '创建 "{label}"'
    },
    commandPalette: {
      noMatch: '没有匹配的数据',
      noData: '没有数据',
      close: '关闭'
    },
    selectMenu: {
      noMatch: '没有匹配的数据',
      noData: '没有数据',
      create: '创建 "{label}"'
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
