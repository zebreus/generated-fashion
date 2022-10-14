import Link from "next/link"
import { ReactNode } from "react"

type MainLayoutProps = {
  children: ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <main className="flex flex-col min-h-screen items-center justify-between">
      <h1 className="sm:text-4xl text-3xl m-3 z-10">
        <Link href="/" passHref>
          generated.fashion
        </Link>
      </h1>
      {children}
    </main>
  )
}

export const getMainLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>
