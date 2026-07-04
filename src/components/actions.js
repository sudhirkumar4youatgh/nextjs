'use server'

import { cookies } from 'next/headers'

// Helper function to handle response cookies
function setResponseCookies(cookieHeader, cookieStore) {
  if (!cookieHeader) return
  const cookieStrings = cookieHeader.split(/,(?=[^;]+=)/g).map((cookie) => cookie.trim()).filter(Boolean)
  for (const cookieString of cookieStrings) {
    const [nameValue, ...attributes] = cookieString.split(';').map((part) => part.trim())
    const [name, ...valueParts] = nameValue.split('=')
    const value = valueParts.join('=')
    if (!name || value === undefined) continue

    const options = { path: '/' }
    for (const attr of attributes) {
      const lower = attr.toLowerCase()
      if (lower === 'httponly') options.httpOnly = true
      else if (lower === 'secure') options.secure = true
      else if (lower === 'samesite=lax') options.sameSite = 'lax'
      else if (lower === 'samesite=strict') options.sameSite = 'strict'
      else if (lower === 'samesite=none') options.sameSite = 'none'
      else if (lower.startsWith('max-age=')) options.maxAge = Number(attr.split('=')[1])
      else if (lower.startsWith('expires=')) options.expires = new Date(attr.split('=')[1])
    }

    cookieStore.set(name, value, options)
  }
}

export async function login({ username, password }) {
  try {
    if (!username || !password) {
      return { success: false, error: 'Username and password are required' }
    }

    const loginRes = await fetch('http://127.0.0.1:8000/myapp/api/jwttoken/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    const contentType = loginRes.headers.get('content-type') || ''
    const data = contentType.includes('application/json') ? await loginRes.json() : { statusText: await loginRes.text() }

    if (!loginRes.ok) {
      const message = data?.detail || data?.error || data?.statusText || 'Login failed'
      return { success: false, error: message }
    }

    const cookieStore = await cookies()
    const accessToken = data.access || data.token || data.access_token
    const refreshToken = data.refresh || data.refresh_token

    if (!accessToken || !refreshToken) {
      return { success: false, error: 'JWT tokens not returned from auth endpoint' }
    }

    cookieStore.set('access_token', accessToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    return { success: true, data }
  } catch (err) {
    console.error("Login Server Action Error:", err)
    return { success: false, error: 'Internal server error occurred' }
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')
    cookieStore.delete('sessionid')
    cookieStore.delete('csrftoken')
    return { success: true }
  } catch (err) {
    console.error("Logout Server Action Error:", err)
    return { success: false, error: 'Failed to logout' }
  }
}

export async function getCategories() {
  try {
    const res = await fetch('http://127.0.0.1:8000/myapp/api/categories', {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!res.ok) {
      return { success: false, error: 'Failed to fetch categories' }
    }

    const data = await res.json()
    const categories = Array.isArray(data) ? data : data?.categories || []
    return { success: true, data: categories }
  } catch (err) {
    console.error("GetCategories Server Action Error:", err)
    return { success: false, error: 'Failed to load categories', data: [] }
  }
}

export async function addPost({ title, content, category }) {
  try {
    if (!title || !content || !category) {
      return { success: false, error: 'Title, content, and category are required' }
    }

    const cookieStore = await cookies()
    let accessToken = cookieStore.get('access_token')?.value || ''
    const refreshToken = cookieStore.get('refresh_token')?.value || ''

    const refreshAccessToken = async () => {
      if (!refreshToken) return null
      const refreshRes = await fetch('http://127.0.0.1:8000/myapp/api/jwttoken/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (!refreshRes.ok) return null
      const refreshData = await refreshRes.json()
      const newAccessToken = refreshData.access || refreshData.access_token
      const newRefreshToken = refreshData.refresh || refreshData.refresh_token

      if (newAccessToken) {
        cookieStore.set('access_token', newAccessToken, {
          httpOnly: true,
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        })
        accessToken = newAccessToken
      }
      if (newRefreshToken) {
        cookieStore.set('refresh_token', newRefreshToken, {
          httpOnly: true,
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        })
      }

      return accessToken
    }

    if (!accessToken && refreshToken) {
      await refreshAccessToken()
    }

    if (!accessToken) {
      return { success: false, error: 'Authentication required' }
    }

    const res = await fetch('http://127.0.0.1:8000/myapp/api/add-posts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ title, content, category }),
    })

    const contentType = res.headers.get('content-type') || ''
    console.log("AddPost content-type:", contentType)
    const data = contentType.includes('application/json') ? await res.json() : { statusText: await res.text() }
    console.log("AddPost Response:", data)
    if (!res.ok) {
      const message = data?.content || data?.errors || data?.statusText || 'Failed to create post'
      return { success: false, error: message }
    }

    return { success: true, data }
  } catch (err) {
    console.error("AddPost Server Action Error:", err)
    return { success: false, error: 'Internal server error occurred' }
  }
}
