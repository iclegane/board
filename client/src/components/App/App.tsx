import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'

import { Board, NotFound, Login, CreateAccount, Logout } from '@/pages'
import { AuthOnly, GuestOnly } from '@/routes'

import './App.css'

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthOnly />}>
          <Route
            path='/board'
            element={<Board />}
          />
          <Route
            path='/logout'
            element={<Logout />}
          />
        </Route>

        <Route element={<GuestOnly />}>
          <Route
            path='/login'
            element={<Login />}
          />
          <Route
            path='/create'
            element={<CreateAccount />}
          />
        </Route>

        <Route
          path='*'
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  )
}
