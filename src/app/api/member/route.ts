import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const DELETE = async(req: NextRequest) => {
    const data: {
        organization: string
        user: string
    } = await req.json()

    await prisma.member.deleteMany({
        where: {
            organizationId: data.organization,
            userId: data.user
        }
    })

    return NextResponse.json({ ok: true })

}
