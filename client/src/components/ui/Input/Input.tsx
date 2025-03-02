import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'

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

export const Input: React.FC<BaseInputProps> = ({
  placeholder,
  value,
  onChange,
  status = 'default',
  size = 'default',
  ...props
}) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <input
      aria-invalid={status === 'error'}
      className={classNames('input', `input-${size}`, `input-${status}`)}
      value={value}
      onChange={handleOnChange}
      placeholder={placeholder}
      {...props}
    />
  )
}

type PasswordProps = {
  showPasswordBtn?: boolean
}

export const Password: React.FC<BaseInputProps & PasswordProps> = ({
  showPasswordBtn = false,
  ...inputProps
}) => {
  const timeOutRef = useRef<number | undefined>()
  const [isVisible, setIsVisible] = useState(false)

  const clearTimeoutRef = () => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
  }

  const handleChangeVisible = () => {
    clearTimeoutRef()

    setIsVisible((prev) => !prev)
  }

  const handleButtonOnBlur = () => {
    if (isVisible) {
      timeOutRef.current = window.setTimeout(() => {
        setIsVisible(false)
      }, 3000)
    }
  }

  const handleInputOnFocus = () => {
    clearTimeoutRef()
  }

  useEffect(() => {
    return () => {
      clearTimeoutRef()
    }
  })

  const isEmptyInput = Boolean(inputProps?.value?.length)

  return (
    <div className={'input-password'}>
      <Input
        {...inputProps}
        onFocus={handleInputOnFocus}
        onBlur={handleButtonOnBlur}
        type={isVisible ? 'text' : 'password'}
      />
      {showPasswordBtn && isEmptyInput && (
        <Button
          size={'small'}
          onBlur={handleButtonOnBlur}
          onClick={handleChangeVisible}
        >
          {isVisible ? 'Hide' : 'Show'}
        </Button>
      )}
    </div>
  )
}
