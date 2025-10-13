import { getSessionCookie } from 'better-auth/cookies'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export const POST = async(req: NextRequest) => {
  const sessionCookie = getSessionCookie(req)

  if(!sessionCookie) {
    return NextResponse.json(
      {
        error: 'You must to be logged in'
      },
      {
        status: 401
      }
    )
  }

  const session = await auth.api.getSession({ headers: req.headers })

  if(!session) {
    return NextResponse.json(
      {
        error: 'You must to be logged in'
      },
      {
        status: 401
      }
    )
  }

  const data: {
    name: string
    id: string
  } = await req.json()

  await prisma.category.create({
    data:{
      name: data.name,
      organizationId: data.id
    }
  })
  
  return NextResponse.json({ ok: true })
}