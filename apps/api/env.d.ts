declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_URI: string
    }
  }
}

export {}