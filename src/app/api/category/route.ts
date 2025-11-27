import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { $Enums } from '@generated'

export const POST = async(req: NextRequest) => {
  try {
    const data: {
      name: string
      id: string
    } = await req.json()

    await prisma.category.create({
      data: {
        name: data.name,
        organizationId: data.id
      }
    })

    return NextResponse.json({ ok: true })
  }
  catch(e) {
    console.error(e)

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export const PATCH = async(req: NextRequest) => {
  try {
    const data: {
      name: string
      id: string
    } = await req.json()

    await prisma.category.update({
      where: {
        id: data.id
      },
      data: {
        name: data.name
      }
    })

    return NextResponse.json({ ok: true })
  }
  catch(e) {
    console.error(e)

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export const DELETE = async(req: NextRequest) => {
  try {
    const data: { id: string } = await req.json()

    await prisma.category.delete({
      where: {
        id: data.id
      }
    })

    return NextResponse.json({ ok: true })
  }
  catch(e) {
    console.error(e)

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export const PUT = async(req: NextRequest) => {
  try {
    const data: {
      title: string
      description?: string
      date?: string
      amount: string
      category: string
      type: $Enums.TransactionType
    } = await req.json()

    await prisma.category.update({
      where: {
        id: data.category
      },
      data: {
        transactions: {
          create: {
            title: data.title,
            description: data.description,
            createdAt: !data.date ? undefined : new Date(data.date),
            amount: BigInt(data.amount),
            type: data.type
          }
        }
      }
    })

    return NextResponse.json({ ok: true })
  }
  catch(e) {
    console.error(e)

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export const GET = async(req: NextRequest) => {
  try {
    const queryOptions = req.headers.get('queryOptions')

    if(!queryOptions) {
      return NextResponse.json(
        { message: '"queryOptions" must be provided' },
        { status: 400 }
      )
    }

    const parsedQueryOptions: {
      categoryId?: string
      organizationId?: string
    } = JSON.parse(queryOptions)

    if(!parsedQueryOptions.categoryId || !parsedQueryOptions.organizationId) {
      return NextResponse.json(
        { message: '"queryOptions.categoryId" and "queryOptions.organizationId" must be provided' },
        { status: 400 }
      )
    }

    const category = await prisma.category.findFirst({
      where: {
        organizationId: parsedQueryOptions.organizationId,
        id: parsedQueryOptions.categoryId
      },
      include: {
        transactions: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        organization: {
          select: {
            currency: true,
            categories: true
          }
        }
      }
    })

    return NextResponse.json({
      category: JSON.stringify(category, (_, value) => typeof value === 'bigint' ? value.toString() : value)
    })
  }
  catch(e) {
    console.error(e)

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }  
}