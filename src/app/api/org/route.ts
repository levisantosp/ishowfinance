import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionCookie } from 'better-auth/cookies'
import { auth } from '@/lib/auth'
import { $Enums } from '@prisma/client'

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

  const data: {
    email: string
    name: string
    currency: $Enums.Currency
  } = await req.json()

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

  const org = await prisma.organization.create({
    data: {
      name: data.name,
      email: data.email,
      userId: session.user.id,
      members: {
        create: {
          userId: session.user.id,
          role: 'OWNER'
        }
      },
      currency: data.currency
    }
  })

  return NextResponse.json({
    redirectTo: `/org/${org.id}/overview`
  })
}

export const GET = async(req: NextRequest) => {
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

  const queryOptions = req.headers.get('queryOptions')
  const method = req.headers.get('find')

  if(!method) {
    return NextResponse.json(
      {
        error: '\'method\' must be provided'
      },
      {
        status: 400
      }
    )
  }

  if(!queryOptions) {
    return NextResponse.json(
      {
        error: '\'queryOptions\' must be provided'
      },
      {
        status: 400
      }
    )
  }

  const parsedQueryOptions = JSON.parse(queryOptions)

  switch(method) {
    case 'many': {
      const organizations: any = await prisma.organization.findMany(parsedQueryOptions)

      return NextResponse.json({
        organizations: JSON.parse(JSON.stringify(organizations, (_, v) => typeof v === 'bigint' ? v.toString() : v))
      })
    }

    case 'unique': {
      const organization = await prisma.organization.findUnique(parsedQueryOptions)

      return NextResponse.json({
        organization: JSON.parse(JSON.stringify(organization, (_, v) => typeof v === 'bigint' ? v.toString() : v))
      })
    }

    default: return NextResponse.json(
      {
        error: '\'find\' value must be \'unique\' or \'many\''
      },
      {
        status: 400
      }
    )
  }
}

export const PUT = async(req: NextRequest) => {
  const data: {
    id: string
    user: string
    invite: string
  } = await req.json()

  const org = await prisma.organization.update({
    where: { id: data.id },
    data: {
      members: {
        create: {
          userId: data.user
        }
      },
      invites: {
        delete: {
          id: data.invite
        }
      }
    }
  })

  return NextResponse.json({ id: org.id })
}