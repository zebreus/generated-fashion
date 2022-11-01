import { useCart } from "hooks/useCart"
import { useLinkClickHandler } from "hooks/useLinkClickHandler"
import Link from "next/link"
import { ReactNode } from "react"

type MainLayoutProps = {
  children: ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const linkClickHandler = useLinkClickHandler("/")
  const cartLinkClickHandler = useLinkClickHandler("/cart")
  const { cart } = useCart()
  return (
    <main className="flex flex-col min-h-screen items-center justify-between">
      <nav className="flex flex-row justify-center align-center m-3 z-10">
        <h1 className="sm:text-4xl text-3xl">
          <Link passHref href="/">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <a onClick={linkClickHandler}>generated.fashion</a>
          </Link>
        </h1>
        {cart?.length ? (
          <>
            <Link href="/cart" passHref>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
              <a
                onClick={cartLinkClickHandler}
                className="btn btn-primary btn-square btn-outline absolute right-0 top-0 m-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 16 16">
                  <g fill="none">
                    <path
                      d="M2.5 2a.5.5 0 0 0 0 1h.246a.5.5 0 0 1 .48.363l1.586 5.55A1.5 1.5 0 0 0 6.254 10h4.569a1.5 1.5 0 0 0 1.393-.943l1.474-3.686A1 1 0 0 0 12.762 4H4.448l-.261-.912A1.5 1.5 0 0 0 2.746 2H2.5zm3.274 6.637L4.734 5h8.027l-1.474 3.686a.5.5 0 0 1-.464.314H6.254a.5.5 0 0 1-.48-.363zM6.5 14a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3zm0-1a.5.5 0 1 1 0-1a.5.5 0 0 1 0 1zm4 1a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3zm0-1a.5.5 0 1 1 0-1a.5.5 0 0 1 0 1z"
                      fill="currentColor"
                    ></path>
                  </g>
                </svg>
              </a>
            </Link>
          </>
        ) : null}
      </nav>

      {children}
    </main>
  )
}

export const getMainLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>
