import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../3_context/auth_context";
import { CreditCard, CheckCircle } from 'lucide-react'
import { cartAPI, orderAPI, paymentAPI } from "../4_services/api";

export default function Checkout() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [order, setOrder] = useState(null)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      // Get cart items
      const cartRes = await cartAPI.getCart(user.id)
      const items = cartRes.data.cart_items

      if (items.length === 0) {
        alert('Cart is empty!')
        return
      }

      // Fetch product details for items
      const enrichedItems = []
      let total = 0
      for (const item of items) {
        // For demo, we'll use mock prices since we need product details
        enrichedItems.push({
          product_id: item.product_id,
          product_name: `Product ${item.product_id}`,
          price: 1000, // Mock price
          quantity: item.quantity
        })
        total += 1000 * item.quantity
      }

      // Create order
      const orderRes = await orderAPI.createOrder({
        user_id: user.id,
        items: enrichedItems,
        shipping_address: user.address || 'Default address'
      })

      // Process payment
      await paymentAPI.process({
        order_id: orderRes.data.order.id,
        user_id: user.id,
        amount: total,
        payment_method: 'card'
      })

      // Clear cart
      await cartAPI.clearCart(user.id)

      setOrder(orderRes.data.order)
      setSuccess(true)
    } catch (err) {
      alert('Checkout failed: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4">Order Placed!</h2>
        <p className="text-gray-500 mb-6">Order #{order?.id} has been placed successfully.</p>
        <button onClick={() => navigate('/orders')} className="btn-primary">
          View Orders
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5" /> Payment Method
        </h3>
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="font-medium">Credit/Debit Card</p>
          <p className="text-sm text-gray-500">Mock payment for demo</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="font-semibold mb-4">Shipping Address</h3>
        <p className="text-gray-600">{user?.address || 'No address set. Update in profile.'}</p>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full btn-primary py-3 text-lg"
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  )
}