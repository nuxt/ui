<script setup lang="ts">
import type { EditorContent, EditorToolbarItem } from '@nuxt/ui'

const content = ref<EditorContent>({
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {
        textAlign: null,
        level: 1
      },
      content: [
        {
          type: 'text',
          text: 'Getting started'
        }
      ]
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: null
      },
      content: [
        {
          type: 'text',
          text: 'Welcome to the '
        },
        {
          type: 'text',
          marks: [
            {
              type: 'italic'
            }
            // {
            //   type: 'highlight',
            //   attrs: {
            //     color: 'var(--tt-color-highlight-yellow)'
            //   }
            // }
          ],
          text: 'Simple Editor'
        },
        {
          type: 'text',
          text: ' template! This template integrates '
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold'
            }
          ],
          text: 'open source'
        },
        {
          type: 'text',
          text: ' UI components and Tiptap extensions licensed under '
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold'
            }
          ],
          text: 'MIT'
        },
        {
          type: 'text',
          text: '.'
        }
      ]
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: null
      },
      content: [
        {
          type: 'text',
          text: 'Integrate it by following the '
        },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://tiptap.dev/docs/ui-components/templates/simple-editor',
                target: '_blank',
                rel: 'noopener noreferrer nofollow',
                class: null
              }
            }
          ],
          text: 'Tiptap UI Components docs'
        },
        {
          type: 'text',
          text: ' or using our CLI tool.'
        }
      ]
    },
    {
      type: 'codeBlock',
      attrs: {
        language: null
      },
      content: [
        {
          type: 'text',
          text: 'npx @tiptap/cli init'
        }
      ]
    },
    {
      type: 'heading',
      attrs: {
        textAlign: null,
        level: 2
      },
      content: [
        {
          type: 'text',
          text: 'Features'
        }
      ]
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          attrs: {
            textAlign: null
          },
          content: [
            {
              type: 'text',
              marks: [
                {
                  type: 'italic'
                }
              ],
              text: 'A fully responsive rich text editor with built-in support for common formatting and layout tools. Type markdown '
            },
            {
              type: 'text',
              marks: [
                {
                  type: 'code'
                }
              ],
              text: '**'
            },
            {
              type: 'text',
              marks: [
                {
                  type: 'italic'
                }
              ],
              text: ' or use keyboard shortcuts '
            },
            {
              type: 'text',
              marks: [
                {
                  type: 'code'
                }
              ],
              text: '⌘+B'
            },
            {
              type: 'text',
              text: ' for '
            },
            {
              type: 'text',
              marks: [
                {
                  type: 'strike'
                }
              ],
              text: 'most'
            },
            {
              type: 'text',
              text: ' all common markdown marks. 🪄'
            }
          ]
        }
      ]
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left'
      },
      content: [
        {
          type: 'text',
          text: 'Add images, customize alignment, and apply '
        },
        {
          type: 'text',
          // marks: [
          //   {
          //     type: 'highlight',
          //     attrs: {
          //       color: 'var(--tt-color-highlight-blue)'
          //     }
          //   }
          // ],
          text: 'advanced formatting'
        },
        {
          type: 'text',
          text: ' to make your writing more engaging and professional.'
        }
      ]
    },
    // {
    //   type: 'image',
    //   attrs: {
    //     src: '/images/tiptap-ui-placeholder-image.jpg',
    //     alt: 'placeholder-image',
    //     title: 'placeholder-image'
    //   }
    // },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: {
                textAlign: 'left'
              },
              content: [
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'bold'
                    }
                  ],
                  text: 'Superscript'
                },
                {
                  type: 'text',
                  text: ' (x'
                },
                {
                  type: 'text',
                  // marks: [
                  //   {
                  //     type: 'superscript'
                  //   }
                  // ],
                  text: '2'
                },
                {
                  type: 'text',
                  text: ') and '
                },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'bold'
                    }
                  ],
                  text: 'Subscript'
                },
                {
                  type: 'text',
                  text: ' (H'
                },
                {
                  type: 'text',
                  // marks: [
                  //   {
                  //     type: 'subscript'
                  //   }
                  // ],
                  text: '2'
                },
                {
                  type: 'text',
                  text: 'O) for precision.'
                }
              ]
            }
          ]
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: {
                textAlign: 'left'
              },
              content: [
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'bold'
                    }
                  ],
                  text: 'Typographic conversion'
                },
                {
                  type: 'text',
                  text: ': automatically convert to '
                },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'code'
                    }
                  ],
                  text: '->'
                },
                {
                  type: 'text',
                  text: ' an arrow '
                },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'bold'
                    }
                  ],
                  text: '→'
                },
                {
                  type: 'text',
                  text: '.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left'
      },
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'italic'
            }
          ],
          text: '→ '
        },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://tiptap.dev/docs/ui-components/templates/simple-editor#features',
                target: '_blank',
                rel: 'noopener noreferrer nofollow',
                class: null
              }
            }
          ],
          text: 'Learn more'
        }
      ]
    },
    {
      type: 'horizontalRule'
    },
    {
      type: 'heading',
      attrs: {
        textAlign: 'left',
        level: 2
      },
      content: [
        {
          type: 'text',
          text: 'Make it your own'
        }
      ]
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left'
      },
      content: [
        {
          type: 'text',
          text: 'Switch between light and dark modes, and tailor the editor\'s appearance with customizable CSS to match your style.'
        }
      ]
    },
    // {
    //   type: 'taskList',
    //   content: [
    //     {
    //       type: 'taskItem',
    //       attrs: {
    //         checked: true
    //       },
    //       content: [
    //         {
    //           type: 'paragraph',
    //           attrs: {
    //             textAlign: 'left'
    //           },
    //           content: [
    //             {
    //               type: 'text',
    //               text: 'Test template'
    //             }
    //           ]
    //         }
    //       ]
    //     },
    //     {
    //       type: 'taskItem',
    //       attrs: {
    //         checked: false
    //       },
    //       content: [
    //         {
    //           type: 'paragraph',
    //           attrs: {
    //             textAlign: 'left'
    //           },
    //           content: [
    //             {
    //               type: 'text',
    //               marks: [
    //                 {
    //                   type: 'link',
    //                   attrs: {
    //                     href: 'https://tiptap.dev/docs/ui-components/templates/simple-editor',
    //                     target: '_blank',
    //                     rel: 'noopener noreferrer nofollow',
    //                     class: null
    //                   }
    //                 }
    //               ],
    //               text: 'Integrate the free template'
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left'
      }
    }
  ]
})

const items: EditorToolbarItem[][] = [[{
  kind: 'undo',
  icon: 'i-lucide-undo'
}, {
  kind: 'redo',
  icon: 'i-lucide-redo'
}], [{
  kind: 'dropdown',
  icon: 'i-lucide-heading',
  items: [{
    type: 'label',
    label: 'Headings'
  }, {
    kind: 'heading',
    level: 1,
    icon: 'i-lucide-heading',
    label: 'Heading 1'
  }, {
    kind: 'heading',
    level: 2,
    icon: 'i-lucide-heading-2',
    label: 'Heading 2'
  }, {
    kind: 'heading',
    level: 3,
    icon: 'i-lucide-heading-3',
    label: 'Heading 3'
  }, {
    kind: 'heading',
    level: 4,
    icon: 'i-lucide-heading-4',
    label: 'Heading 4'
  }]
}, {
  kind: 'dropdown',
  icon: 'i-lucide-list',
  items: [{
    kind: 'bulletList',
    icon: 'i-lucide-list',
    label: 'Bullet List'
  }, {
    kind: 'orderedList',
    icon: 'i-lucide-list-ordered',
    label: 'Ordered List'
  }]
}, {
  kind: 'blockquote',
  icon: 'i-lucide-text-quote'
}, {
  kind: 'codeBlock',
  icon: 'i-lucide-square-code'
}, {
  kind: 'horizontalRule',
  icon: 'i-lucide-separator-horizontal'
}, {
  kind: 'paragraph',
  icon: 'i-lucide-letter-text'
}], [{
  kind: 'mark',
  mark: 'bold',
  icon: 'i-lucide-bold'
}, {
  kind: 'mark',
  mark: 'italic',
  icon: 'i-lucide-italic'
}, {
  kind: 'mark',
  mark: 'underline',
  icon: 'i-lucide-underline'
}, {
  kind: 'mark',
  mark: 'strike',
  icon: 'i-lucide-strikethrough'
}, {
  kind: 'mark',
  mark: 'code',
  icon: 'i-lucide-code'
}], [{
  kind: 'textAlign',
  align: 'left',
  icon: 'i-lucide-align-left'
}, {
  kind: 'textAlign',
  align: 'center',
  icon: 'i-lucide-align-center'
}, {
  kind: 'textAlign',
  align: 'right',
  icon: 'i-lucide-align-right'
}, {
  kind: 'textAlign',
  align: 'justify',
  icon: 'i-lucide-align-justify'
}]]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="content" class="flex-1 w-full min-h-0">
    <Navbar :ui="{ right: 'items-stretch' }">
      <UEditorToolbar :editor="editor" :items="items" variant="fixed" />
    </Navbar>

    <UEditorToolbar :editor="editor" :items="items" variant="bubble" />
    <UEditorToolbar :editor="editor" :items="items" variant="floating" />
  </UEditor>
</template>
