import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import router from './router.jsx'
import { RouterProvider } from 'react-router-dom'
import {GlobalProvider} from './store'
import NotificationPopup from './Components/Public/Noti/NotificationPopup.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalProvider>
      <RouterProvider router={router} />
      <NotificationPopup/>
    </GlobalProvider>
  </React.StrictMode>,
)
