import { upperName } from '../utils'

const components = [
  'accordion',
  'alert',
  'auth-form',
  'avatar',
  'badge',
  'banner',
  'blog-post',
  'breadcrumb',
  'button',
  'calendar',
  'card',
  'carousel',
  'changelog-version',
  'changelog-versions',
  'checkbox-group',
  'checkbox',
  'chip',
  'collapsible',
  'color-mode',
  'color-picker',
  'command-palette',
  'content/content-navigation',
  'content/content-surround',
  'content/content-toc',
  'context-menu',
  'drawer',
  'dropdown-menu',
  'editor',
  'empty',
  'error',
  'field-group',
  'file-upload',
  'footer',
  'form-field',
  'form',
  'header',
  'input-date',
  'input-menu',
  'input-number',
  'input-tags',
  'input-time',
  'input',
  'kbd',
  'link',
  'locale',
  'marquee',
  'modal',
  'navigation-menu',
  'page-anchors',
  'page-card',
  'page-cta',
  'page-feature',
  'page-header',
  'page-hero',
  'page-links',
  'page-logos',
  'page-section',
  'pagination',
  'pin-input',
  'popover',
  'pricing-plan',
  'pricing-table',
  'progress',
  'radio-group',
  'scroll-area',
  'select-menu',
  'select',
  'separator',
  'shortcuts',
  'skeleton',
  'slideover',
  'slider',
  'stepper',
  'switch',
  'table',
  'tabs',
  'textarea',
  'timeline',
  'toast',
  'tooltip',
  'tree',
  'user'
].map(component => ({ label: upperName(component.split('/').pop() as string), icon: 'i-lucide-box', to: `/components/${component}` }))

export const useNavigation = () => {
  const appConfig = useAppConfig()

  const items = [{ label: 'Home', icon: 'i-lucide-home', to: '/' }, { label: 'Chat', icon: 'i-lucide-message-circle', to: '/chat' }]
  const groups = computed(() => [
    { id: 'links', items },
    { id: 'components', label: 'Components', items: components },
    {
      id: 'dir',
      label: 'Direction',
      items: [{
        label: 'LTR',
        icon: 'i-lucide-arrow-right',
        active: appConfig.dir === 'ltr',
        onSelect: () => appConfig.dir = 'ltr'
      }, {
        label: 'RTL',
        icon: 'i-lucide-arrow-left',
        active: appConfig.dir === 'rtl',
        onSelect: () => appConfig.dir = 'rtl'
      }]
    }
  ])

  return {
    components,
    groups,
    items
  }
}
