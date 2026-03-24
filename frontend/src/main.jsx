import { StrictMode } from 'react'   // developer tool that helps in identifying bugs
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider  } from './context/AuthContext.jsx'

// searches the div tag in index.html whose name is "root" and mounts react in that tag.
//AuthProvider wraps the entire app inside itself so that the app can know who the logged in user is
// document.querySelector() can also be used here
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)

