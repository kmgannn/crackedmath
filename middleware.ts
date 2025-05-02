import { NextResponse } from 'next/server'; 
import type { NextRequest } from 'next/server'; 
 
export function middleware(request: NextRequest) { 
  if (request.nextUrl.pathname === '/') { 
    console.log('Middleware: Redirecting / to /login'); 
    return NextResponse.redirect(new URL('/login', request.url)); 
  } 
  return NextResponse.next(); 
} 
 
export const config = { 
  matcher: ['/'], 
}; 
