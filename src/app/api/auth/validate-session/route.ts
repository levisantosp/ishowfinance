import { getSessionCookie } from "better-auth/cookies"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma.ts"

export const GET = async(req: NextRequest) => {
  const sessionToken = getSessionCookie(req)

  if(!sessionToken) {
    return NextResponse.json({
      validSession: false
    })
  }

  const session = await prisma.session.findUnique({
    where: {
      token: sessionToken.split(".")[0]
    }
  })

  console.log(session)
  
  if(!session) {
    return NextResponse.json({
      validSession: false
    })
  }

  if(session.expiresAt <= new Date()) {
    return NextResponse.json({
      validSession: false
    })
  }

  return NextResponse.json({
    validSession: true
  })
}