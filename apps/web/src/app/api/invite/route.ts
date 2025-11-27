import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const POST = async(req: NextRequest) => {
  const data: {
    id: string
    expiresAt: string
  } = await req.json()

  const invite = await prisma.invite.create({
    data: {
      organizationId: data.id,
      expiresAt: data.expiresAt
    }
  })

  return NextResponse.json({ id: invite.id })
}