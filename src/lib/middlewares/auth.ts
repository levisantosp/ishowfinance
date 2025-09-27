import { getSessionCookie } from "better-auth/cookies"
import { NextResponse, type NextRequest } from "next/server"

const publicRoutes = [
  {
    path: "/login",
    action: "redirect"
  },
  {
    path: "/",
    action: "next"
  }
] as const

const getLocale = (req: NextRequest) => {
  const path = req.nextUrl.pathname
  const parts = path.split("/").filter(p => p.length)

  return parts.length > 0 ? parts[0] : "en-US"
}

export default function(req: NextRequest) {
  const path = req.nextUrl.pathname
  const publicRoute = publicRoutes.find(route => path.endsWith(route.path))

  const locale = getLocale(req)

  const sessionCookie = getSessionCookie(req)

  if(!sessionCookie && publicRoute) {
    return NextResponse.next()
  }

  if(!sessionCookie && !publicRoute) {
    const redirectUrl = req.nextUrl.clone()

    redirectUrl.pathname = `${locale}/login`

    return NextResponse.redirect(redirectUrl)
  }

  if(sessionCookie && publicRoute && publicRoute.action === "redirect") {
    const redirectUrl = req.nextUrl.clone()
    
    redirectUrl.pathname = `${locale}/dash`

    return NextResponse.redirect(redirectUrl)
  }

  if(sessionCookie && !publicRoute) {
    return NextResponse.next()
  }

  return NextResponse.next()
}