import { Gallery } from "components/Gallery"
import { Generator } from "components/Generator"
import Link from "next/link"

export default function ShirtPreview() {
  return (
    <>
      <main className="flex flex-col min-h-screen items-center justify-between">
        <h1 className="sm:text-5xl text-3xl m-3">
          <Link href="/" passHref>
            generated.fashion
          </Link>
        </h1>
        <Generator />
        <Gallery />
      </main>
    </>
  )
}
