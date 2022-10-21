import { useCart } from "hooks/useCart"
import { useRouter } from "next/router"

export type CartButtonProps = {
  id: string | undefined
}

export const CartButton = ({ id }: CartButtonProps) => {
  const { setCart } = useCart()
  const router = useRouter()
  return (
    <button
      className="btn btn-primary w-fit mb-2 gap-2"
      onClick={() => {
        if (!id) {
          return
        }
        setCart(oldCart => {
          if (oldCart.find(item => item.id === id)) {
            return oldCart.map(item => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
          }
          return [...oldCart, { id, quantity: 1 }]
        })
        router.push("/cart")
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 16 16">
        <g fill="none">
          <path
            d="M2.5 2a.5.5 0 0 0 0 1h.246a.5.5 0 0 1 .48.363l1.586 5.55A1.5 1.5 0 0 0 6.254 10h4.569a1.5 1.5 0 0 0 1.393-.943l1.474-3.686A1 1 0 0 0 12.762 4H4.448l-.261-.912A1.5 1.5 0 0 0 2.746 2H2.5zm3.274 6.637L4.734 5h8.027l-1.474 3.686a.5.5 0 0 1-.464.314H6.254a.5.5 0 0 1-.48-.363zM6.5 14a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3zm0-1a.5.5 0 1 1 0-1a.5.5 0 0 1 0 1zm4 1a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3zm0-1a.5.5 0 1 1 0-1a.5.5 0 0 1 0 1z"
            fill="currentColor"
          ></path>
        </g>
      </svg>
      Add to cart
    </button>
  )
}
