import { createAuthClient } from "better-auth/react"
import { auth } from "./auth.ts"

export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL
})