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

export type ButtonHTMLAttributes = Pick<VueButtonHTMLAttributes, 'autofocus' | 'disabled' | 'form' | 'formaction' | 'formenctype' | 'formmethod' | 'formnovalidate' | 'formtarget' | 'name' | 'type' | 'value'>

export type FormHTMLAttributes = Pick<VueFormHTMLAttributes, 'acceptcharset' | 'action' | 'autocomplete' | 'enctype' | 'method' | 'name' | 'novalidate' | 'target'>

export type ImgHTMLAttributes = Pick<VueImgHTMLAttributes, 'alt' | 'crossorigin' | 'decoding' | 'height' | 'loading' | 'referrerpolicy' | 'sizes' | 'src' | 'srcset' | 'usemap' | 'width'>

export type InputHTMLAttributes = Pick<VueInputHTMLAttributes, 'accept' | 'alt' | 'autocomplete' | 'autofocus' | 'capture' | 'checked' | 'crossorigin' | 'disabled' | 'enterKeyHint' | 'form' | 'formaction' | 'formenctype' | 'formmethod' | 'formnovalidate' | 'formtarget' | 'height' | 'indeterminate' | 'list' | 'max' | 'maxlength' | 'min' | 'minlength' | 'multiple' | 'name' | 'pattern' | 'placeholder' | 'readonly' | 'required' | 'size' | 'src' | 'step' | 'type' | 'value' | 'width'>

export type TableHTMLAttributes = Pick<VueTableHTMLAttributes, 'cellpadding' | 'cellspacing' | 'summary' | 'width'>

export type TextareaHTMLAttributes = Pick<VueTextareaHTMLAttributes, 'autocomplete' | 'autofocus' | 'cols' | 'dirname' | 'disabled' | 'form' | 'maxlength' | 'minlength' | 'name' | 'placeholder' | 'readonly' | 'required' | 'rows' | 'value' | 'wrap'>
