export const INPUT_TYPE = {
  TEXT: 'text',
  PASSWORD: 'password',
  EMAIL: 'email',
  NUMBER: 'number',
} as const;

export const BUTTON_KIND = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
} as const;

export const BUTTON_TYPE = {
  BUTTON: 'button',
  SUBMIT: 'submit',
  RESET: 'reset',
} as const;

export const phoneRegExp = /^((\+84|0)[3|5|7|8|9])([0-9]{8})$/;
export const nameRegExp = /^[a-zA-Z0-9\sÀ-ỹ]+$/;