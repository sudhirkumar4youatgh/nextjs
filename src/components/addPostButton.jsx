"use client"

import { useState } from 'react'
import LoginModal from './loginModal'
import AddPostModal from './addPostModal'

export default function AddPostButton() {
  const [showLogin, setShowLogin] = useState(false)
  const [showAdd, setShowAdd] = useState(false)

  const handleClick = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth-status')
      const data = await res.json()
      if (data.isLoggedIn) setShowAdd(true)
      else setShowLogin(true)
    } catch (err) {
      setShowLogin(true)
    }
  }

  return (
    <>
      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => { setShowLogin(false); setShowAdd(true) }}
      />

      <AddPostModal open={showAdd} onClose={() => setShowAdd(false)} onSuccess={() => { /* no-op */ }} />

      <a href="#" onClick={handleClick} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">Add Post</a>
    </>
  )
}
