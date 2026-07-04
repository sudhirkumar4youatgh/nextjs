'use client'

import { useState } from 'react'
import { logout } from './actions' // Import your server action

export default function NavLogout({ onLogout }) {
  const [message, setMessage] = useState(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setMessage(null)

    try {
      const response = await logout()
      if (response?.success) {
        onLogout?.()
      } else {
        setMessage('Failed to logout. Please try again.')
      }
    } catch (error) {
      setMessage('Failed to logout. Please try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div>
      <button onClick={handleLogout} disabled={isLoggingOut}>
        {isLoggingOut ? 'Logging out...' : 'Log Out'}
      </button>
      {message && <p>{message}</p>}
    </div>
  )
}
