import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Tiếng Việt',
  code: 'vi',
  messages: {
    inputMenu: {
      noMatch: 'Không có kết quả phù hợp',
      noData: 'Không có dữ liệu',
      create: 'Tạo "{label}"'
    },
    calendar: {
      prevYear: 'Năm trước',
      nextYear: 'Năm sau',
      prevMonth: 'Tháng trước',
      nextMonth: 'Tháng sau'
    },
    inputNumber: {
      increment: 'Tăng',
      decrement: 'Giảm'
    },
    commandPalette: {
      placeholder: 'Nhập lệnh hoặc tìm kiếm...',
      noMatch: 'Không có kết quả phù hợp',
      noData: 'Không có dữ liệu',
      close: 'Đóng'
    },
    selectMenu: {
      noMatch: 'Không có kết quả phù hợp',
      noData: 'Không có dữ liệu',
      create: 'Tạo "{label}"',
      search: 'Tìm kiếm...'
    },
    toast: {
      close: 'Đóng'
    },
    carousel: {
      prev: 'Trước',
      next: 'Sau',
      goto: 'Đi tới ô {slide}'
    },
    modal: {
      close: 'Đóng'
    },
    slideover: {
      close: 'Đóng'
    },
    alert: {
      close: 'Đóng'
    },
    table: {
      noData: 'Không có dữ liệu'
    }
  }
})
