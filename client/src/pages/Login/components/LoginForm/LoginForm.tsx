import React, { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { Button, Input, Password } from '@/components'
import { Plate } from '@/components/ui/Plate'
import { PAGES_PATH } from '@/constants'
import { useAuth } from '@/context/AuthContext.tsx'

import './styles.css'

type FormValues = {
  login: string
  password: string
}

export const LoginForm: React.FC = () => {
  const { login: loginF } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const navigate = useNavigate()

  const onSubmit: SubmitHandler<FormValues> = async ({ login, password }) => {
    setIsLoading(true)
    await loginF(login, password)
    navigate(PAGES_PATH.BOARD)
    setIsLoading(false)
  }

  return (
    <form
      name='login-form'
      className='login-form'
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        {...register('login', {
          required: 'Login is required',
          minLength: {
            value: 3,
            message: 'Login must be at least 3 characters',
          },
          pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message: 'Invalid login format',
          },
        })}
        placeholder='Login'
        status={errors.login ? 'error' : 'default'}
      />
      {errors.login && (
        <Plate
          status='error'
          text={errors.login.message}
        />
      )}
      <Password
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        })}
        placeholder='Password'
        status={errors.password ? 'error' : 'default'}
        showPasswordBtn
      />
      {errors.password && (
        <Plate
          status='error'
          text={errors.password.message}
        />
      )}

      <Button type='submit'>Log in</Button>

      {isLoading && 'loading...'}
    </form>
  )
}
