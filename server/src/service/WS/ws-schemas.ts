import * as yup from 'yup'

export const positionSchema = yup.object({
  x: yup.number().required(),
  y: yup.number().required(),
})

export const baseMessageSchema = yup.object({
  type: yup.string().required(),
  id: yup.string().optional(),
  position: positionSchema.optional(),
})

export const endMessageSchema = baseMessageSchema.shape({
  type: yup.string().oneOf(['end']).required(),
  id: yup.string().required(),
  position: positionSchema.required(),
})
