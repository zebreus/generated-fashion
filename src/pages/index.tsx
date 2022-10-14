import { Gallery } from "components/Gallery"
import { Generator } from "components/Generator"

export default function ShirtPreview() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-between">
      <h2 className="sm:text-5xl text-3xl m-3">generated.fashion</h2>
      <Generator />
      <Gallery />
    </main>
  )
}
