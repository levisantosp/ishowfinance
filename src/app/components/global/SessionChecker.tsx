"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { authClient } from "../../../lib/auth-client.ts"

export default function SessionChecker() {
  const router = useRouter()

  useEffect(() => {
    const check = async() => {
      const res: {
        validSession: boolean
      } = await (await fetch("/api/auth/validate-session", {
        headers: {
          auth: process.env.NEXT_PUBLIC_AUTH
        }
      })).json()

      if(!res.validSession) {
        authClient.signOut({
          fetchOptions: {
            onSuccess() {
              router.push("/login")
            },
            headers: {
              auth: process.env.NEXT_PUBLIC_AUTH
            }
          }
        })
      }
    }

    check()
  }, [router])

  return null
}