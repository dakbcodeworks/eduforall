import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from './lib/auth';

// Add the routes you want to protect here
const protectedRoutes = [
    '/api/contact/queries',
    '/api/gallery-upload',
    '/api/gallery-delete',
    '/api/save-settings'
];

export async function middleware(req: NextRequest) {
    const currentPath = req.nextUrl.pathname;

    // Check if the current path is in our protected routes
    const isProtected = protectedRoutes.some(route => currentPath.startsWith(route));

    if (isProtected) {
        const token = req.cookies.get('admin-token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized: No token provided' },
                { status: 401 }
            );
        }

        try {
            await verifyAuth(token);
            // If token is valid, continue
            return NextResponse.next();
        } catch {
            return NextResponse.json(
                { error: 'Unauthorized: Invalid or expired token' },
                { status: 401 }
            );
        }
    }

    // Pass through for all other routes
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
