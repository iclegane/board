import classNames from 'classnames'
import React, { useState, forwardRef } from 'react'

import { type Size, Button } from '@/components/ui'

import './styles.css'

export type InputStatus = 'default' | 'error' | 'success' | 'warning' | 'info'

type BaseInputProps = {
  value?: string
  placeholder?: string
  onChange?: (value: string | undefined) => void
  disabled?: boolean
  isValid?: boolean
  status?: InputStatus
  size?: Size
} & Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  'name' | 'type' | 'onFocus' | 'onBlur'
>

export const Input = forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      placeholder,
      value,
      onChange,
      status = 'default',
      size = 'default',
      ...props
    },
    ref
  ) => {
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value)
    }

    return (
      <input
        ref={ref}
        aria-invalid={status === 'error'}
        className={classNames('input', `input-${size}`, `input-${status}`)}
        value={value}
        onChange={handleOnChange}
        placeholder={placeholder}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

type PasswordProps = BaseInputProps & {
  showPasswordBtn?: boolean
}

export const Password = forwardRef<HTMLInputElement, PasswordProps>(
  ({ showPasswordBtn = false, ...inputProps }, ref) => {
    const [isVisible, setIsVisible] = useState(false)

    const handleChangeVisible = () => {
      setIsVisible((prev) => !prev)
    }

    const isNotEmptyInput = Boolean(inputProps?.value?.length)

    return (
      <div className='input-password'>
        <Input
          {...inputProps}
          ref={ref}
          type={isVisible ? 'text' : 'password'}
        />
        {showPasswordBtn && isNotEmptyInput && (
          <Button
            type='button'
            size='small'
            onClick={handleChangeVisible}
          >
            {isVisible ? 'Hide' : 'Show'}
          </Button>
        )}
      </div>
    )
  }
)

Password.displayName = 'Password'
