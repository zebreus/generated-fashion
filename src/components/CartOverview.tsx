import { CartShirt } from "components/CartShirt"
import { usePrediction } from "hooks/firestore/simple/usePrediction"
import { CartItem, useCart } from "hooks/useCart"

export const CartOverview = () => {
  const { cart } = useCart()

  return (
    <>
      <h1 className="text-3xl">Cart</h1>
      <ul className="">
        {cart?.length ? cart.map(item => <CartRow key={item.id} item={item} />) : <h1>You cart is empty</h1>}
      </ul>
      <button
        className="btn btn-primary mb-auto"
        onClick={() => {
          alert("Not implemented")
        }}
      >
        Checkout?
      </button>
    </>
  )
}

const CartRow = ({ item }: { item: CartItem }) => {
  const prediction = usePrediction(item.id)
  const { setCart } = useCart()
  return (
    <li className="flex-row flex justify-start items-center">
      <CartShirt id={item.id} />
      <p className="w-80">{prediction?.prompt}</p>
      <p className="w-20">x {item.quantity}</p>
      <button
        className="btn btn-square btn-outline btn-error"
        onClick={() => {
          setCart(cart => cart.filter(cartItem => cartItem.id !== item.id))
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </li>
  )
}
