import { Generator } from "components/Generator"
import { PopularShirts } from "components/PopularShirts"
import { RecentShirts } from "components/RecentShirts"
import { getMainLayout } from "layouts/MainLayout"

const MainPage = () => {
  return (
    <>
      <Generator />
      <RecentShirts />
      <PopularShirts />
    </>
  )
}

MainPage.getLayout = getMainLayout

export default MainPage
