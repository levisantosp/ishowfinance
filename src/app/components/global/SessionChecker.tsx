"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { authClient } from "../../../lib/auth-client.ts"

export default function SessionChecker() {
  const router = useRouter()

  const params: {
    locale: "br" | "us"
  } = useParams()

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
              router.push(`/${params.locale}/login`)
            }
          }
        })
      }
    }

    check()
  }, [router])


  return null
}