export class FormValidationException extends Error {
  formId;
  errors;
  constructor(formId, errors) {
    super("Form validation exception");
    this.formId = formId;
    this.errors = errors;
    Object.setPrototypeOf(this, FormValidationException.prototype);
  }
}
