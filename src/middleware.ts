import { NextResponse, type MiddlewareConfig, type NextRequest } from "next/server"
import auth from "./lib/middlewares/auth.ts"
import intl from "./lib/middlewares/intl.ts"

const middleware = (req: NextRequest) => {
  if(req.nextUrl.pathname.startsWith("/api")) {
    if(
      req.nextUrl.pathname.startsWith("/api/auth/callback/google") ||
      req.nextUrl.pathname.startsWith("/api/auth/callback/microsoft")
    ) {
      return NextResponse.next()
    }
    
    const authorization = req.headers.get("auth")

    if(authorization !== process.env.AUTH) {
      return NextResponse.json({
        error: "Forbbiden"
      })
    }

    return NextResponse.next()
  }

  const intlRes = intl(req)
  
  if(intlRes.headers.get("location")) {
    return intlRes
  }

  const authRes = auth(req)

  if(authRes.status !== 200) {
    return authRes
  }

  NextResponse.next().headers.forEach((value, key) => intlRes.headers.set(key, value))

  return intlRes
}

export default middleware

export const config: MiddlewareConfig = {
  matcher: "/((?!trpc|_next|_vercel|.*\\..*).*)"
}