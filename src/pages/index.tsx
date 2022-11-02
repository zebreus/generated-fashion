import { Generator } from "components/Generator"
import { MyLikedShirts } from "components/MyLikedShirts"
import { PopularShirts } from "components/PopularShirts"
import { RecentShirts } from "components/RecentShirts"
import { getMainLayout } from "layouts/MainLayout"

const MainPage = () => {
  return (
    <>
      <Generator />
      <MyLikedShirts />
      <PopularShirts />
      <RecentShirts />
    </>
  )
}

MainPage.getLayout = getMainLayout

export default MainPage
