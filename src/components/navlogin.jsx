'use client'

import { useEffect, useState } from 'react'
import NavLogout from '@/components/navlogout'
import LoginModal from '@/components/loginModal'

export default function NavLogin() {
  const [loggedIn, setLoggedIn] = useState(undefined)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    let active = true

    fetch('/api/auth-status')
      .then((res) => res.json())
      .then((data) => {
        if (active) setLoggedIn(data.isLoggedIn)
      })
      .catch(() => {
        if (active) setLoggedIn(false)
      })

    return () => {
      active = false
    }
  }, [])

  if (loggedIn === undefined) {
    return null
  }

  return (
    <>
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setLoggedIn(true)
          setShowLoginModal(false)
        }}
      />

      <div className="flex items-center space-x-6 font-medium text-sm">
        {loggedIn ? (
          <>
            <span className="text-gray-700">Welcome, User!</span>
            <NavLogout onLogout={() => setLoggedIn(false)} />
          </>
        ) : (
          <button
            type="button"
            onClick={() => setShowLoginModal(true)}
            className="hover:text-blue-600 transition font-semibold text-blue-600"
          >
            Login here
          </button>
        )}
      </div>
    </>
  )
}
