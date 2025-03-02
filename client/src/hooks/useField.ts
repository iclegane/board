import { useState } from 'react'

export type useFieldProps<T> = {
  initialValue?: T
  validator?: (value: T) => boolean
}

export const useField = <T>(props?: useFieldProps<T>) => {
  const { initialValue, validator } = props || {}

  const [value, setValue] = useState<T>(initialValue as T)
  const [isError, setIsError] = useState(false)

  const handleChange = (valueCb: T) => {
    if (validator) {
      validator(valueCb) ? setIsError(false) : setIsError(true)
    }

    setValue(valueCb)
  }
  return { value, isError, handleChange }
}
