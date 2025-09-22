import { NextResponse, type MiddlewareConfig, type NextRequest } from "next/server"
import auth from "./lib/middlewares/auth.ts"
import intl from "./lib/middlewares/intl.ts"

const middleware = (req: NextRequest) => {
  if(req.nextUrl.pathname.startsWith("/api")) {
    const authorization = req.headers.get("auth")

    if(authorization !== process.env.AUTH) {
      return NextResponse.json({
        error: "Forbbiden"
      })
    }

    return NextResponse.next()
  }

  const res = intl(req)
  
  if(res.headers.get("location")) {
    return res
  }

  return auth(req)
}

export default middleware

export const config: MiddlewareConfig = {
  matcher: "/((?!trpc|_next|_vercel|.*\\..*).*)"
}