import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionCookie } from "better-auth/cookies"
import { auth } from "@/lib/auth"

export const POST = async(req: NextRequest) => {
  const sessionCookie = getSessionCookie(req)

  if(!sessionCookie) {
    return NextResponse.json({
      error: "You must to be logged in"
    })
  }

  const data: {
    email: string
    name: string
  } = await req.json()

  const session = await auth.api.getSession({ headers: req.headers })

  if(!session) {
    return NextResponse.json({
      error: "You must to be logged in"
    })
  }

  const org = await prisma.organization.create({
    data: {
      name: data.name,
      email: data.email,
      userId: session.user.id,
      members: {
        create: {
          userId: session.user.id,
          role: "OWNER"
        }
      }
    }
  })

  return NextResponse.json({
    redirectTo: `/org/${org.id}/overview`
  })
}