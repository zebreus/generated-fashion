import { CartOverview } from "components/CartOverview"
import { getMainLayout } from "layouts/MainLayout"

const CartPage = () => {
  return (
    <>
      <CartOverview />
    </>
  )
}

CartPage.getLayout = getMainLayout

export default CartPage
