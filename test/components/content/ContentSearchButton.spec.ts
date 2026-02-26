import { describe } from 'vitest'
import ContentSearchButton from '../../../src/runtime/components/content/ContentSearchButton.vue'
import { renderEach } from '../../component-render'

describe('DashboardSearchButton', () => {
  renderEach(ContentSearchButton, [
    // Props
    ['with label', { props: { label: 'Open' } }],
    ['with icon', { props: { icon: 'i-lucide-house' } }],
    ['with kbds', { props: { kbds: ['alt', 'o'] } }],
    ['without collapsed', { props: { collapsed: false } }],
    ['with class', { props: { class: 'w-full' } }]
  ])
})
