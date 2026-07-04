import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const isLoggedIn = cookieStore.has('access_token') || cookieStore.has('refresh_token')
  return NextResponse.json({ isLoggedIn })
}
