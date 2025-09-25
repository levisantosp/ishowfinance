import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionCookie } from "better-auth/cookies"

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

  const session = await prisma.session.findFirst({
    where: {
      token: sessionCookie.split(".")[0]
    },
    include: {
      user: true
    }
  })

  if(!session) {
    return NextResponse.json({
      error: "You must to be logged in"
    })
  }

  const org = await prisma.organization.create({
    data: {
      name: data.name,
      email: data.email,
      userId: session.userId,
      members: {
        create: {
          userId: session.userId,
          role: "OWNER"
        }
      }
    }
  })

  return NextResponse.json({
    redirectTo: `/org/${org.id}/overview`
  })
}