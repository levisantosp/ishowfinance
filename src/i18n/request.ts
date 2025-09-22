import { hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing.ts"
import br from "@/messages/br.json"
import us from "@/messages/us.json"

const locales = {
  us,
  br
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