import { Gallery } from "components/Gallery"
import { Generator } from "components/Generator"
import { PopularGallery } from "components/PopularGallery"
import { getMainLayout } from "layouts/MainLayout"

const MainPage = () => {
  return (
    <>
      <Generator />
      <Gallery />
      <PopularGallery />
    </>
  )
}

MainPage.getLayout = getMainLayout

export default MainPage
