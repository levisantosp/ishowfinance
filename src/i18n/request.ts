import { hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing.ts"
import { readFileSync } from "node:fs"
import path from "node:path"

const locales: {
  [key: string]: any
} = {
  us: JSON.parse(
    readFileSync(path.resolve("src/messages/us.json"), "utf-8")
  ),
  br: JSON.parse(
    readFileSync(path.resolve("src/messages/br.json"), "utf-8")
  )
}

export default getRequestConfig(async({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
     ? requested
     : routing.defaultLocale
  return {
    locale,
    messages: locales[locale]
  }
})