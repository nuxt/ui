import type {
  AnchorHTMLAttributes as VueAnchorHTMLAttributes,
  ButtonHTMLAttributes as VueButtonHTMLAttributes,
  FormHTMLAttributes as VueFormHTMLAttributes,
  ImgHTMLAttributes as VueImgHTMLAttributes,
  InputHTMLAttributes as VueInputHTMLAttributes,
  TableHTMLAttributes as VueTableHTMLAttributes,
  TextareaHTMLAttributes as VueTextareaHTMLAttributes
} from 'vue'

export type AnchorHTMLAttributes = Pick<VueAnchorHTMLAttributes, 'download' | 'href' | 'hreflang' | 'media' | 'ping' | 'rel' | 'target' | 'type' | 'referrerpolicy'>

export type ButtonHTMLAttributes = Pick<VueButtonHTMLAttributes, 'autofocus' | 'disabled' | 'form' | 'formaction' | 'formenctype' | 'formmethod' | 'formnovalidate' | 'formtarget' | 'name' | 'type'>

export type FormHTMLAttributes = Pick<VueFormHTMLAttributes, 'acceptcharset' | 'action' | 'autocomplete' | 'enctype' | 'method' | 'name' | 'novalidate' | 'target'>

export type ImgHTMLAttributes = Pick<VueImgHTMLAttributes, 'alt' | 'crossorigin' | 'decoding' | 'height' | 'loading' | 'referrerpolicy' | 'sizes' | 'src' | 'srcset' | 'usemap' | 'width'>

// Note: 'autocomplete' is defined with simpler types to avoid TS2590 complexity issues with Nuxt 4.3+
export type InputHTMLAttributes = Pick<VueInputHTMLAttributes, 'autofocus' | 'disabled' | 'enterKeyHint' | 'form' | 'formaction' | 'formenctype' | 'formmethod' | 'formnovalidate' | 'formtarget' | 'list' | 'max' | 'maxlength' | 'min' | 'minlength' | 'name' | 'pattern' | 'placeholder' | 'readonly' | 'required' | 'size' | 'step' | 'type'> & {
  autocomplete?: 'on' | 'off' | (string & {})
}

export type TableHTMLAttributes = Pick<VueTableHTMLAttributes, 'cellpadding' | 'cellspacing' | 'summary' | 'width'>

export type TextareaHTMLAttributes = Pick<VueTextareaHTMLAttributes, 'autocomplete' | 'autofocus' | 'cols' | 'dirname' | 'disabled' | 'form' | 'maxlength' | 'minlength' | 'name' | 'placeholder' | 'readonly' | 'required' | 'rows' | 'wrap'>
