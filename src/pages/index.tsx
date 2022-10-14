import { Gallery } from "components/Gallery"
import { Generator } from "components/Generator"
import { getMainLayout } from "layouts/MainLayout"

const MainPage = () => {
  return (
    <>
      <Generator />
      <Gallery />
    </>
  )
}

MainPage.getLayout = getMainLayout

export default MainPage
