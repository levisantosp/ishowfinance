import { Elysia } from 'elysia'
import { createTransaction } from './routes/transaction/create-transaction.ts'

new Elysia()
  .get('/', { message: 'Hello, world!' })
  .use(createTransaction)
  .listen(3001)

console.log('HTTP server running at 3001')