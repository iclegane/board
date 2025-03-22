import React, { useState } from 'react'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { api } from '@/api/axios.ts'
import { Button, Input } from '@/components'
import { Plate } from '@/components/ui/Plate'
import { API_PATH, PAGES_PATH } from '@/constants'

import './styles.css'

type FormValues = {
  login: string
  password: string
  passwordConfirmation: string
}

// Todo: Обработка ошибок и посмотреть register
export const CreateAccountForm: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true)
    await api.post(API_PATH.CREATE, data)
    navigate(PAGES_PATH.CREATE)
    setIsLoading(false)
  }

  return (
    <form
      name='create-form'
      onSubmit={handleSubmit(onSubmit)}
      className={'login-form'}
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
        rules={{ required: 'Password is required' }}
        render={({ field }) => (
          <Input
            {...field}
            placeholder='Password'
            status={errors.password ? 'error' : 'default'}
          />
        )}
      />
      {errors.password && (
        <Plate
          status='error'
          text={errors.password.message}
        />
      )}
      <Controller
        name='passwordConfirmation'
        control={control}
        rules={{ required: 'passwordConfirm is required' }}
        render={({ field }) => (
          <Input
            {...field}
            placeholder='Repeat the password'
            status={errors.passwordConfirmation ? 'error' : 'default'}
          />
        )}
      />
      {errors.passwordConfirmation && (
        <Plate
          status='error'
          text={errors.passwordConfirmation.message}
        />
      )}

      <Button type={'submit'}>Create account</Button>

      {isLoading && 'loading...'}
    </form>
  )
}
