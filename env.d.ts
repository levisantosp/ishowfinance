declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_URI: string
      GOOGLE_CLIENT_ID: string
      GOOGLE_CLIENT_SECRET: string
      MICROSOFT_CLIENT_ID: string
      MICROSOFT_CLIENT_SECRET: string
      BASE_URL: string
      AUTH: string
      NEXT_PUBLIC_AUTH: string
      BETTER_AUTH_SECRET: string
    }
  }
}

export {}