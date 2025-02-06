import { NextResponse } from 'next/server'

export function middleware(request) {
    const path = request.nextUrl.pathname
    const token = request.cookies.get('jwt')?.value

    if (!token && path !== '/') {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (token && path === '/') {
        return NextResponse.redirect(new URL('/sms', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|images|favicon.ico|vendor/|.*\\.css).*)',
    ],
};