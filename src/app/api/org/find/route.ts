import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionCookie } from "better-auth/cookies"

export const GET = async(req: NextRequest) => {
  const sessionCookie = getSessionCookie(req)

  if(!sessionCookie) {
    return NextResponse.json({
      error: "You must to be logged in"
    })
  }

  const userId = req.headers.get("userId")

  if(!userId) {
    return NextResponse.json({
      error: "User ID must be provided"
    })
  }

  const organizations = await prisma.organization.findMany({
    where: { userId },
    include: {
      members: true
    }
  })

  return NextResponse.json({ organizations })
}