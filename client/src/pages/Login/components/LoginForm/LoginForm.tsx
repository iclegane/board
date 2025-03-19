import React, { useState } from 'react'
import { useForm, type SubmitHandler, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { Button, Input, Password } from '@/components'
import { Plate } from '@/components/ui/Plate'
import { useAuth } from '@/context/AuthContext.tsx'

import './styles.css'
import { PAGES_PATH } from '@/constants'

type FormValues = {
  login: string
  password: string
}

export const LoginForm: React.FC = () => {
  const { login: loginF } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {
    control,
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
      <Controller
        name='login'
        control={control}
        rules={{ required: 'Login is required' }}
        render={({ field }) => (
          <Input
            {...field}
            placeholder='Login'
            status={errors.login ? 'error' : 'default'}
          />
        )}
      />
      {errors.login && (
        <Plate
          status='error'
          text={errors.login.message}
        />
      )}

      <Controller
        name='password'
        control={control}
        rules={{
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        }}
        render={({ field }) => (
          <Password
            {...field}
            placeholder='Password'
            status={errors.password ? 'error' : 'default'}
            showPasswordBtn
          />
        )}
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
