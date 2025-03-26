import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'

import { PAGES_PATH } from '@/constants'
import { Board, NotFound, Login, CreateAccount, Logout } from '@/pages'
import { AuthOnly, GuestOnly } from '@/routes'

import './App.css'

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthOnly />}>
          <Route
            path={PAGES_PATH.BOARD}
            element={<Board />}
          />
          <Route
            path={PAGES_PATH.LOGOUT}
            element={<Logout />}
          />
        </Route>

        <Route element={<GuestOnly />}>
          <Route
            path={PAGES_PATH.LOGIN}
            element={<Login />}
          />
          <Route
            path={PAGES_PATH.CREATE}
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
