import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Tiếng Việt',
  code: 'vi',
  messages: {
    alert: {
      close: 'Đóng'
    },
    authForm: {
      hidePassword: 'Ẩn mật khẩu',
      showPassword: 'Hiển thị mật khẩu',
      submit: 'Tiếp tục'
    },
    banner: {
      close: 'Đóng'
    },
    calendar: {
      nextMonth: 'Tháng sau',
      nextYear: 'Năm sau',
      prevMonth: 'Tháng trước',
      prevYear: 'Năm trước'
    },
    carousel: {
      dots: 'Chọn slide để hiển thị',
      goto: 'Đi tới ô {slide}',
      next: 'Sau',
      prev: 'Trước'
    },
    chatPrompt: {
      placeholder: 'Nhập tin nhắn của bạn ở đây…'
    },
    chatPromptSubmit: {
      label: 'Gửi'
    },
    colorMode: {
      dark: 'Tối',
      light: 'Sáng',
      switchToDark: 'Chuyển sang chế độ tối',
      switchToLight: 'Chuyển sang chế độ sáng',
      system: 'Hệ thống'
    },
    commandPalette: {
      back: 'Quay lại',
      close: 'Đóng',
      noData: 'Không có dữ liệu',
      noMatch: 'Không có kết quả phù hợp',
      placeholder: 'Nhập lệnh hoặc tìm kiếm…'
    },
    contentSearch: {
      links: 'Liên kết',
      theme: 'Chủ đề'
    },
    contentSearchButton: {
      label: 'Tìm kiếm…'
    },
    contentToc: {
      title: 'Trong trang này'
    },
    dashboardSearch: {
      theme: 'Chủ đề'
    },
    dashboardSearchButton: {
      label: 'Tìm kiếm…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Thu gọn thanh bên',
      expand: 'Mở rộng thanh bên'
    },
    dashboardSidebarToggle: {
      close: 'Đóng thanh bên',
      open: 'Mở thanh bên'
    },
    error: {
      clear: 'Quay lại trang chủ'
    },
    fileUpload: {
      removeFile: 'Xóa {filename}'
    },
    header: {
      close: 'Đóng menu',
      open: 'Mở menu'
    },
    inputMenu: {
      create: 'Tạo "{label}"',
      noData: 'Không có dữ liệu',
      noMatch: 'Không có kết quả phù hợp'
    },
    inputNumber: {
      decrement: 'Giảm',
      increment: 'Tăng'
    },
    modal: {
      close: 'Đóng'
    },
    pricingTable: {
      caption: 'So sánh các kế hoạch giá'
    },
    prose: {
      codeCollapse: {
        closeText: 'Thu gọn',
        name: 'mã',
        openText: 'Mở rộng'
      },
      collapsible: {
        closeText: 'Ẩn',
        name: 'thuộc tính',
        openText: 'Hiển thị'
      },
      pre: {
        copy: 'Sao chép mã vào bộ nhớ tạm'
      }
    },
    selectMenu: {
      create: 'Tạo "{label}"',
      noData: 'Không có dữ liệu',
      noMatch: 'Không có kết quả phù hợp',
      search: 'Tìm kiếm…'
    },
    slideover: {
      close: 'Đóng'
    },
    table: {
      noData: 'Không có dữ liệu'
    },
    toast: {
      close: 'Đóng'
    }
  }
})
