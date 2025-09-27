import { hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing.ts"
import br from "@/messages/pt-BR.json"
import us from "@/messages/en-US.json"

const locales = {
  "pt-BR": br,
  "en-US": us
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