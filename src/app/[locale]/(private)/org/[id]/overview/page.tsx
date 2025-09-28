import { prisma } from "@/lib/prisma"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default async function Overview({ params }: Props) {
  const { id, locale } = await params

  const date = new Date()

  date.setDate(date.getDate() - 30)

  const org = await prisma.organization.findUnique({
    where: { id },
    include: {
      categories: {
        include: {
          transactions: {
            where: {
              createdAt: {
                gte: date
              }
            }
          }
        }
      }
    }
  })

  if(!org) {
    notFound()
  }

  const t = await getTranslations()

  return (
    <>
      <div
        className="flex justify-center p-10"
      >
        <h1
          className="text-center text-3xl md:text-4xl font-bold"
        >
          {org.name}
        </h1>
      </div>

      <div
        className="flex flex-col md:flex-row justify-center gap-5 px-5 md:px-0"
      >
        <div
          className="rounded-2xl border border-gray-500 p-10"
        >
          <h2
            className="text-xl md:text-2xl font-semibold"
          >
            {t("pages.org.overview.balance")}
          </h2>

          <span
            className="md:text-lg text-gray-400"
          >
            {
              (Number(org.balance) / 100)
                .toLocaleString(
                  locale,
                  {
                    style: "currency",
                    currency: org.currency
                  }
                )
            }
          </span>
        </div>

        <div
          className="rounded-2xl border border-gray-500 p-10"
        >
          <h2
            className="text-xl md:text-2xl font-semibold"
          >
            {t("pages.org.overview.summary.title")}
          </h2>

          <span
            className="md:text-lg text-gray-400"
          >
            {t.rich("pages.org.overview.summary.description", {
              income: org.categories.reduce((total, category) => {
                const ctotal = category.transactions.filter(t => t.type === "INCOME").reduce((total, transaction) => {
                  return total + Number(transaction)
                }, 0)

                return ctotal + total
              }, 0).toLocaleString(
                locale,
                {
                  style: "currency",
                  currency: org.currency
                }
              ),
              expense: org.categories.reduce((total, category) => {
                const ctotal = category.transactions.filter(t => t.type === "EXPENSE").reduce((total, transaction) => {
                  return total + Number(transaction)
                }, 0)

                return ctotal + total
              }, 0).toLocaleString(
                locale,
                {
                  style: "currency",
                  currency: org.currency
                }
              )
            })}
          </span>
        </div>
      </div>
    </>
  )
}