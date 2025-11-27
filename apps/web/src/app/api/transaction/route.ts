import { NextResponse, type NextRequest } from 'next/server'
import type { $Enums } from '@generated'
import { prisma } from '@/lib/prisma'

export const PUT = async(req: NextRequest) => {
  try {
    const { date, amount, transaction, ...data }: {
      title?: string
      description?: string
      date?: string
      amount?: string
      transaction?: string
      type?: $Enums.TransactionType
    } = await req.json()

    await prisma.transaction.update({
      where: {
        id: transaction
      },
      data: {
        ...data,
        createdAt: date,
        amount: amount
          ? BigInt(amount)
          : undefined
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
    const data: { transactionId: string } = await req.json()

    await prisma.transaction.delete({
      where: {
        id: data.transactionId
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