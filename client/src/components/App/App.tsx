import React from 'react'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router'

import { Board, NotFound, Login, CreateAccount } from '@/pages'

import './App.css'

export const App: React.FC = () => {
  const isLogged = false // mock

  const publicRoutes = (
    <>
      <Route
        path='/login'
        element={<Login />}
      />
      <Route
        path='/create'
        element={<CreateAccount />}
      />
      <Route
        path='*'
        element={<Navigate to='/login' />}
      />
    </>
  )

  const privateRoutes = (
    <>
      <Route
        path='/board'
        element={<Board />}
      />
      <Route
        path='*'
        element={<NotFound />}
      />
    </>
  )

  return (
    <BrowserRouter>
      <Routes>{isLogged ? privateRoutes : publicRoutes}</Routes>
    </BrowserRouter>
  )
}
