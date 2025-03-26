import * as yup from 'yup'

export const loginSchema = yup.object({
  login: yup.string().required('login is required'),
  password: yup
    .string()
    .min(6, 'The password must be at least 6 characters long')
    .required('password is required'),
})

export const registerSchema = loginSchema.shape({
  login: yup
    .string()
    .min(3, 'The login must be at least 6 characters long')
    .required('login is required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords dont match')
    .required('Password confirmation is required'),
})
