import { Elysia, t } from 'elysia'
import { prisma } from '../../db/prisma.ts'
import { logger } from '@logger'
import { UnauthorizedException, NotFoundException } from '../../utils/errors.ts'

export const createTransaction = new Elysia()
  .post(
    '/transaction',
    async({ body, set, headers }) => {
      try {
        const organization = await prisma.organization.findFirst({
          where: {
            token: headers.authorization
          }
        })

        if(!organization) {
          throw new UnauthorizedException('This token is not valid')
        }

        const category = await prisma.category.findFirst({
          where: {
            name: body.categoryName,
            organizationId: organization.id
          }
        })

        if(!category) {
          throw new NotFoundException(`There is no category named '${body.categoryName}'`)
        }

        const transaction = await prisma.transaction.create({
          data: {
            categoryId: category.id,
            type: body.type,
            amount: BigInt(body.amount),
            createdAt: body.date
              ? new Date(body.date)
              : undefined,
            title: body.title,
            description: body.description
          }
        })
        
        set.status = 'Created'

        return {
          ok: true,
          data: { ...transaction, amount: transaction.amount.toString() }
        }
      }
      catch(error) {
        if(error instanceof NotFoundException) {
          logger.error(error)

          set.status = 'Not Found'

          return { error: error.message }
        }
        else if(error instanceof UnauthorizedException) {
          logger.error(error)

          set.status = 'Unauthorized'

          return { error: error.message }
        }
        else if(error instanceof Error) {
          logger.error(error)

          set.status = 'Internal Server Error'

          return { error: error.message }
        }
      }
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.Optional(t.String()),
        date: t.Optional(t.String()),
        amount: t.String(),
        categoryName: t.String(),
        type: t.UnionEnum(['REVENUE', 'EXPENSE'])
      }),
      headers: t.Object({
        authorization: t.String()
      })
    }
  )