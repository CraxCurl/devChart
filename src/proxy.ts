import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const method = request.method

  // Protect /create-task, /overview and any API route except GET (mutations)
  const isProtectedApiRoute = path.startsWith('/api/tasks') && method !== 'GET';
  const isProtectedRoute = path.startsWith('/create-task') || path.startsWith('/overview') || isProtectedApiRoute;

  if (isProtectedRoute) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      if (path.startsWith('/api/')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')
      await jose.jwtVerify(token, secret)
      
      return NextResponse.next()
    } catch (error) {
      if (path.startsWith('/api/')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/create-task/:path*', '/api/tasks/:path*', '/overview/:path*'],
}
