import * as yup from 'yup'

export const deleteCardSchema = yup.object({
  cardId: yup.string().required('Card id is required'),
})

export const addCardSchema = yup.object({
  name: yup.string().min(3).max(15).required('Name is required'),
  x: yup.number(),
  y: yup.number(),
})
