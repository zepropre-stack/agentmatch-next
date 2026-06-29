import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Rewrite root to the prototype HTML (preserves URL as '/')
  if (request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/agentco_ai.html', request.url))
  }
}

export const config = {
  matcher: ['/'],
}
