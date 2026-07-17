import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../3_context/auth_context";
import { orderAPI } from "../4_services/api";
import OrderCard from "../1_components/D_order";
import { Package } from 'lucide-react'

export default function Orders() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getOrders(user.id)
      setOrders(res.data.orders)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-20">Loading orders...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Package className="h-8 w-8" /> My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-4">No orders yet</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Start Shopping
          </button>
        </div>
      ) : (
        <div>
          {orders.map(order => <OrderCard key={order.id} order={order} />)}
        </div>
      )}
    </div>
  )
}