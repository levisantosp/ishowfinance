import createMiddleware from 'next-intl/middleware'
import { routing } from '../../i18n/routing.ts'

export default createMiddleware(routing)