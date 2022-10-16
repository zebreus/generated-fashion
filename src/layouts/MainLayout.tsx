import { useLinkClickHandler } from "hooks/useLinkClickHandler"
import Link from "next/link"
import { ReactNode } from "react"

type MainLayoutProps = {
  children: ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const linkClickHandler = useLinkClickHandler("/")
  return (
    <main className="flex flex-col min-h-screen items-center justify-between">
      <h1 className="sm:text-4xl text-3xl m-3 z-10">
        <Link passHref href="/">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <a onClick={linkClickHandler}>generated.fashion</a>
        </Link>
      </h1>
      {children}
    </main>
  )
}

export const getMainLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>
