// web/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROLE_PATHS: Record<string, string> = {
    admin:   '/dashboard/admin',
    teacher: '/dashboard/teacher',
    parent:  '/dashboard/parent',
    student: '/dashboard/student',
};

function decodeJwtPayload(token: string) {
    try {
        const base64 = token.split('.')[1];
        return JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = decodeJwtPayload(token);

  
    if (!payload || (payload.exp && Date.now() >= payload.exp * 1000)) {
        const res = NextResponse.redirect(new URL('/login', request.url));
        res.cookies.delete('token');
        return res;
    }

    const role = payload.role as string;


    if (pathname === '/dashboard') {
        return NextResponse.redirect(
            new URL(ROLE_PATHS[role] || '/login', request.url)
        );
    }

   
    for (const [r, path] of Object.entries(ROLE_PATHS)) {
        if (pathname.startsWith(path) && role !== r) {
            return NextResponse.redirect(
                new URL(ROLE_PATHS[role] || '/dashboard', request.url)
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};