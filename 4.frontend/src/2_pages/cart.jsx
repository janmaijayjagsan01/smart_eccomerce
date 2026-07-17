import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../3_context/auth_context";
import { cartAPI, productAPI } from "../4_services/api";
import CartItem from "../1_components/C_cart_item";
import { ShoppingBag, ArrowRight } from 'lucide-react'

export default function Cart() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [products, setProducts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchCart()
  }, [user])

  const fetchCart = async () => {
    setLoading(true)
    try {
      const res = await cartAPI.getCart(user.id)
      const items = res.data.cart_items
      setCartItems(items)

      // Fetch product details
      const productIds = [...new Set(items.map(i => i.product_id))]
      const productData = {}
      for (const pid of productIds) {
        try {
          const p = await productAPI.getById(pid)
          productData[pid] = p.data.product
        } catch {}
      }
      setProducts(productData)
    } finally {
      setLoading(false)
    }
  }

  const getTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = products[item.product_id]?.price || 0
      return sum + (price * item.quantity)
    }, 0)
  }

  if (loading) return <div className="text-center py-20">Loading cart...</div>

  const enrichedItems = cartItems.map(item => ({
    ...item,
    name: products[item.product_id]?.name || 'Product',
    price: products[item.product_id]?.price || 0,
    image_url: products[item.product_id]?.image_url
  }))

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <ShoppingBag className="h-8 w-8" /> Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {enrichedItems.map(item => (
              <CartItem key={item.id} item={item} userId={user.id} onUpdate={fetchCart} />
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg">Subtotal ({cartItems.length} items)</span>
              <span className="text-2xl font-bold">₹{getTotal().toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-lg"
            >
              Proceed to Checkout <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}