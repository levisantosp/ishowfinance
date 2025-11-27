import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma.ts'
import { nextCookies } from 'better-auth/next-js'

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      prompt: 'select_account'
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      tenantId: 'common',
      prompt: 'select_account'
    }
  },
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
    transaction: true
  }),
  emailAndPassword: {
    enabled: false
  },
  plugins: [nextCookies()],
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24
  }
})