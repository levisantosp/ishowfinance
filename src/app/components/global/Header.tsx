import Link from "next/link"
import Image from "next/image"
import { Languages } from "lucide-react"
import LanguageMenu from "./LanguageMenu.tsx"

export default async function Header() {
  return (
    <>
      <header className="flex justify-between p-4">
        <div
          className="flex items-center md:px-10 gap-10"
        >
          <Link
            href="/"
            className="transition duration-300 hover:scale-110 flex items-center -space-x-2"
          >
            <Image
              src="/header/logo.png"
              width={80}
              height={80}
              alt="logo"
            />
            <span
              className="md:text-4xl font-extrabold"
            >
              ishowfinance
            </span>
          </Link>
        </div>
        <div
          className="md:px-10 p-4"
        >
          <LanguageMenu />
        </div>
      </header>
    </>
  )
}