import { defineConfig, env } from 'prisma/config'
import { loadEnvFile } from 'node:process'

loadEnvFile('.env')

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('POSTGRES_URI')
  }
})