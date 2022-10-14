import { Gallery } from "components/Gallery"
import { Generator } from "components/Generator"
import Link from "next/link"

export default function ShirtPreview() {
  return (
    <>
      <main className="flex flex-col min-h-screen items-center justify-between">
        <Link href="/" passHref>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a>
            <h1 className="sm:text-5xl text-3xl m-3">generated.fashion</h1>
          </a>
        </Link>
        <Generator />
        <Gallery />
      </main>
    </>
  )
}
