import { defineRouting } from 'next-intl/routing'
import { locales } from '../config.ts'

export const routing = defineRouting({
  locales,
  defaultLocale: 'en-US'
})