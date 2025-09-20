declare global {
  namespace NodeJs {
    interface ProcessEnv {
      POSTGRES_URI: string
    }
  }
}