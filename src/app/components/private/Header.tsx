import Link from "next/link"
import Image from "next/image"
import Menu from "./Menu.tsx"

export default async function Header() {
  return (
    <>
      <header className="flex justify-between p-1 border-b border-gray-500">
        <div
          className="flex items-center md:px-10"
        >
          <Link
            href="/dash"
            className="transition duration-300 hover:scale-110 flex items-center -space-x-2 gap-3"
          >
            <Image
              src="/header/logo.png"
              width={50}
              height={50}
              alt="logo"
            />
            <span
              className="text-2xl font-extrabold"
            >
              ishowfinance
            </span>            
          </Link>
        </div>
        <div
          className="md:px-10 p-4"
        >
          <Menu />
        </div>
      </header>
    </>
  )
}