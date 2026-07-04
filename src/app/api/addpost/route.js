import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const body = await request.json()
    const { title, content, category } = body

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'title, content and category are required' }, { status: 400 })
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
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const djangoRes = await fetch('http://127.0.0.1:8000/myapp/api/add-posts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ title, content, category }),
    })

    const contentType = djangoRes.headers.get('content-type') || ''
    if (!djangoRes.ok) {
      const text = contentType.includes('application/json') ? await djangoRes.json() : await djangoRes.text()
      return NextResponse.json({ error: 'Django error', details: text }, { status: djangoRes.status })
    }

    const data = contentType.includes('application/json') ? await djangoRes.json() : { ok: true }

    const res = NextResponse.json(data, { status: djangoRes.status })
    if (djangoRes.headers.has('set-cookie')) {
      res.headers.set('set-cookie', djangoRes.headers.get('set-cookie'))
    }
    return res
  } catch (err) {
    console.error('AddPost route error', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
