import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Cada seção do app pertence a um papel. Login único → roteamento por papel.
const SECTIONS: { prefix: string; role: string; home: string }[] = [
  { prefix: '/dashboard', role: 'AGENCY', home: '/dashboard' },
  { prefix: '/model', role: 'MODEL', home: '/model' },
  { prefix: '/client', role: 'BRAND', home: '/client' },
]

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const section = SECTIONS.find(s => pathname.startsWith(s.prefix))
  if (!section) return NextResponse.next()

  const token = req.cookies.get('token')?.value
  const role = req.cookies.get('role')?.value

  // Sem sessão → manda para o login.
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Papel não corresponde à seção → redireciona para a área do próprio papel.
  if (role && role !== section.role) {
    const target = SECTIONS.find(s => s.role === role)
    const url = req.nextUrl.clone()
    url.pathname = target?.home ?? '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/model/:path*', '/client/:path*'],
}
