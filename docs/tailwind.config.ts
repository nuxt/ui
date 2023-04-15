import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>> {
  darkMode: 'class',
  content: [
    'docs/ui/*.ts',
    'docs/content/**/*.md',
    'docs/app.config.ts'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      },
      maxWidth: {
        '8xl': '90rem'
      },
      typography: (theme) => {
        console.log('theme', theme)
        return {
          DEFAULT: {
            css: {
              'h1, h2, h3, h4': {
                fontWeight: theme('fontWeight.bold'),
                'scroll-margin-top': 'var(--scroll-mt)'
              },
              'h1 a, h2 a, h3 a, h4 a': {
                borderBottom: 'none !important',
                color: 'inherit',
                fontWeight: 'inherit'
              },
              a: {
                fontWeight: theme('fontWeight.medium'),
                textDecoration: 'none',
                borderBottom: '1px solid transparent'
              },
              'a:hover': {
                borderColor: 'var(--tw-prose-links)'
              },
              'a:has(> code)': {
                borderColor: 'transparent !important'
              },
              'a code': {
                color: 'var(--tw-prose-code)',
                border: '1px dashed var(--tw-prose-pre-border)'
              },
              'a:hover code': {
                color: 'var(--tw-prose-links)',
                borderColor: 'var(--tw-prose-links)'
              },
              pre: {
                margin: '0',
                borderRadius: '0.375rem',
                border: '1px solid var(--tw-prose-pre-border)'
              },
              code: {
                backgroundColor: 'var(--tw-prose-pre-bg)',
                padding: '0.25rem 0.375rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--tw-prose-pre-border)'
              },
              'code::before': {
                content: ''
              },
              'code::after': {
                content: ''
              },
              'blockquote p:first-of-type::before': {
                content: ''
              },
              'blockquote p:last-of-type::after': {
                content: ''
              },
              'input[type="checkbox"]': {
                color: theme('colors.primary.600'),
                borderRadius: theme('borderRadius.DEFAULT'),
                borderColor: theme('colors.gray.300'),
                height: theme('spacing.4'),
                width: theme('spacing.4'),
                marginTop: '-3.5px !important',
                marginBottom: '0 !important',
                '&:focus': {
                  '--tw-ring-offset-width': 0
                }
              },
              'input[type="checkbox"]:checked': {
                borderColor: theme('colors.primary.600')
              },
              'input[type="checkbox"]:disabled': {
                opacity: 0.5,
                cursor: 'not-allowed'
              },
              'ul.contains-task-list': {
                marginLeft: '-1.625em'
              },
              'ul ul': {
                paddingLeft: theme('padding.6')
              },
              'ul ol': {
                paddingLeft: theme('padding.6')
              },
              'ul > li.task-list-item': {
                paddingLeft: '0 !important'
              },
              'ul > li.task-list-item input': {
                marginRight: '7px'
              },
              'ul > li.task-list-item > ul.contains-task-list': {
                marginLeft: 'initial'
              },
              'ul > li.task-list-item a': {
                marginBottom: 0
              },
              'ul > li.task-list-item::marker': {
                content: 'none'
              },
              'ul > li > p': {
                margin: 0
              },
              'ul > li > span.issue-badge, p > span.issue-badge': {
                verticalAlign: 'text-top',
                margin: '0 !important'
              },
              'ul > li > button': {
                verticalAlign: 'baseline !important'
              },
              table: {
                wordBreak: 'break-all'
              }
            }
          },
          primary: {
            css: {
              '--tw-prose-body': theme('colors.gray.700'),
              '--tw-prose-headings': theme('colors.gray.900'),
              '--tw-prose-lead': theme('colors.gray.600'),
              '--tw-prose-links': theme('colors.primary.500'),
              '--tw-prose-bold': theme('colors.gray.900'),
              '--tw-prose-counters': theme('colors.gray.500'),
              '--tw-prose-bullets': theme('colors.gray.300'),
              '--tw-prose-hr': theme('colors.gray.100'),
              '--tw-prose-quotes': theme('colors.gray.900'),
              '--tw-prose-quote-borders': theme('colors.gray.200'),
              '--tw-prose-captions': theme('colors.gray.500'),
              '--tw-prose-code': theme('colors.gray.900'),
              '--tw-prose-pre-code': theme('colors.gray.900'),
              '--tw-prose-pre-bg': theme('colors.gray.50'),
              '--tw-prose-pre-border': theme('colors.gray.200'),
              '--tw-prose-th-borders': theme('colors.gray.300'),
              '--tw-prose-td-borders': theme('colors.gray.200'),
              '--tw-prose-invert-body': theme('colors.gray.200'),
              '--tw-prose-invert-headings': theme('colors.white'),
              '--tw-prose-invert-lead': theme('colors.gray.400'),
              '--tw-prose-invert-links': theme('colors.primary.400'),
              '--tw-prose-invert-bold': theme('colors.white'),
              '--tw-prose-invert-counters': theme('colors.gray.400'),
              '--tw-prose-invert-bullets': theme('colors.gray.600'),
              '--tw-prose-invert-hr': theme('colors.gray.800'),
              '--tw-prose-invert-quotes': theme('colors.gray.100'),
              '--tw-prose-invert-quote-borders': theme('colors.gray.700'),
              '--tw-prose-invert-captions': theme('colors.gray.400'),
              '--tw-prose-invert-code': theme('colors.white'),
              '--tw-prose-invert-pre-code': theme('colors.white'),
              '--tw-prose-invert-pre-bg': theme('colors.gray.800'),
              '--tw-prose-invert-pre-border': theme('colors.gray.700'),
              '--tw-prose-invert-th-borders': theme('colors.gray.700'),
              '--tw-prose-invert-td-borders': theme('colors.gray.800')
            }
          },
          invert: {
            css: {
              '--tw-prose-pre-border': 'var(--tw-prose-invert-pre-border)',
              'input[type="checkbox"]': {
                backgroundColor: theme('colors.gray.800'),
                borderColor: theme('colors.gray.700')
              },
              'input[type="checkbox"]:checked': {
                backgroundColor: theme('colors.primary.600'),
                borderColor: theme('colors.primary.600')
              }
            }
          }
        }
      }
    }
  }
}
