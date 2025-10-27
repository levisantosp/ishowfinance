import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const DELETE = async(req: NextRequest) => {
  const data: {
    organization: string
    member: string
  } = await req.json()

  await prisma.member.delete({
    where: {
      id: data.member
    }
  })

  return NextResponse.json({ ok: true })
}