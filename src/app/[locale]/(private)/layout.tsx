import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { notFound } from "next/navigation"
import { getMessages, getTranslations } from "next-intl/server"
import { routing } from "../../../i18n/routing.ts"
import Header from "../../components/private/Header.tsx"

const inter = Inter({ subsets: ["latin"] })

export const generateMetadata = async(): Promise<Metadata> => {
  const t = await getTranslations()
  return {
    title: t("metadata.title"),
    description: t("metadata.description")
  }
}

type Props = {
  children?: React.ReactNode,
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params

  if(!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <NextIntlClientProvider
          messages={messages}
          locale={locale}
        >
          <Header />
          <main className="flex-grow">
            {children}
          </main>
        </NextIntlClientProvider>
        {/* <Footer /> */}
      </body>
    </html>
  )
}