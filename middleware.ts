import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Get Supabase URL and anon key from environment
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    },
  });

  // Get session
  const { data: { session } } = await supabase.auth.getSession();
  
  // Protect /account routes
  if (request.nextUrl.pathname.startsWith('/account') && !session) {
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    redirectUrl.searchParams.set('auth', 'required');
    return NextResponse.redirect(redirectUrl);
  }
  
  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && !session) {
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    redirectUrl.searchParams.set('auth', 'required');
    return NextResponse.redirect(redirectUrl);
  }
  
  return response;
}

export const config = {
  matcher: ['/account/:path*', '/admin/:path*'],
};
