import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { username, password } = await request.json()
    if (!username || !password) {
      return NextResponse.json({ error: 'Credentials required' }, { status: 400 })
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

    return NextResponse.json(data, { status: loginRes.status })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
