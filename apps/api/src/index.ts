import { Elysia } from 'elysia'
import { createTransaction } from './routes/transaction/create-transaction.ts'
import { openapi } from '@elysiajs/openapi'

new Elysia()
  .get('/', { message: 'Hello, world!' })
  .use(openapi())
  .use(createTransaction)
  .listen(3001)

console.log('HTTP server running at 3001')