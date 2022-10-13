import { Gallery } from "components/Gallery"
import { Generator } from "components/Generator"
import { PatternBackground } from "components/PatternBackground"

export default function ShirtPreview() {
  return (
    <PatternBackground light>
      <main className="flex flex-col min-h-screen items-center justify-between">
        <h2 className="sm:text-5xl text-3xl m-3">generated.fashion</h2>

        <Generator />
        <Gallery />
      </main>
    </PatternBackground>
  )
}
