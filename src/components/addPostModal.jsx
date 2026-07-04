"use client"

import { useEffect, useState } from 'react'
import { addPost, getCategories } from './actions'

export default function AddPostModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({ title: '', content: '', category: '' })
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return

    let active = true
    setLoadingCategories(true)
    setError('') // Clear past errors when opening
    
    getCategories()
      .then((res) => {
        if (!active) return
        
        // Handle response object from server action safely
        if (res.success) {
          setCategories(res.data)
          if (!form.category && res.data?.[0]?.slug) {
            setForm((prev) => ({ ...prev, category: res.data[0].slug }))
          }
        } else {
          setError(res.error || 'Failed to load categories')
        }
      })
      .catch((fetchError) => {
        console.error('Failed to load categories', fetchError)
        setError('Network error: Could not fetch categories')
      })
      .finally(() => {
        if (active) setLoadingCategories(false)
      })

    return () => { active = false }
  }, [open])

  if (!open) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await addPost(form)
      
      // Handle the success/error flags sent by the server action
      if (res.success) {
        onSuccess?.(res.data)
        setForm({ title: '', content: '', category: categories?.[0]?.slug || '' }) // Reset form
        onClose()
      } else {
        setError(res.error || 'Could not create post')
      }
    } catch (err) {
      setError('A network error occurred while submitting.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Close
        </button>

        <h2 className="mb-4 text-2xl font-semibold text-gray-900">Add Post</h2>

        {error ? <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input name="title" value={form.title} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea name="content" value={form.content} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            {loadingCategories ? (
              <div className="mt-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500">Loading categories...</div>
            ) : (
              <select name="category" value={form.category} onChange={handleChange} required className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900">
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>

          <button type="submit" disabled={loading || loadingCategories || !form.category} className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
            {loading ? 'Posting...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  )
}
