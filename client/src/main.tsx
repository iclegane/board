import React from 'react'
import ReactDOM from 'react-dom/client'

import { App } from '@/components'
import { AuthProvider } from '@/context/AuthContext.tsx'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
