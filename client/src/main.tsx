import React from 'react'
import ReactDOM from 'react-dom/client'

import { App, GlobalLoadingIndicator } from '@/components'
import { AuthProvider } from '@/context/AuthContext.tsx'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <GlobalLoadingIndicator />
      <App />
    </AuthProvider>
  </React.StrictMode>
)
