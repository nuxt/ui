import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageUploadNode from '../../components/content/examples/editor/ImageUploadNode.vue'

declare module '@tiptap/vue-3' {
  interface Commands<ReturnType> {
    imageUpload: {
      insertImageUpload: () => ReturnType
    }
  }
}

export const ImageUpload = Node.create({
  name: 'imageUpload',
  group: 'block',
  atom: true,
  addAttributes() {
    return {}
  },
  parseHTML() {
    return [{
      tag: 'div[data-type="image-upload"]'
    }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'image-upload' })]
  },
  addNodeView() {
    return VueNodeViewRenderer(ImageUploadNode)
  },
  addCommands() {
    return {
      insertImageUpload: () => ({ commands }) => {
        return commands.insertContent({ type: this.name })
      }
    }
  }
})
