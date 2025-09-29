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

export const GET = async(req: NextRequest) => {
  const sessionCookie = getSessionCookie(req)

  if(!sessionCookie) {
    return NextResponse.json({
      error: "You must to be logged in"
    })
  }

  const queryOptions = req.headers.get("queryOptions")
  const method = req.headers.get("find")

  if(!method) {
    return NextResponse.json({
      error: "'method' must be provided"
    })
  }

  if(!queryOptions) {
    return NextResponse.json({
      error: "'queryOptions' must be provided"
    })
  }

  const parsedQueryOptions = JSON.parse(queryOptions)

  switch(method) {
    case "many": {
      const organizations = await prisma.organization.findMany(parsedQueryOptions)

      return NextResponse.json({ organizations })
    }
    
    case "unique": {
      const organization = await prisma.organization.findUnique(parsedQueryOptions)

      return NextResponse.json({
        organization: !organization ? null :
          {
            ...organization,
            balance: organization.balance.toString()
          }
      })
    }

    default: return NextResponse.json({ error: "'method' value must be 'unique' or 'many'" })
  }
}