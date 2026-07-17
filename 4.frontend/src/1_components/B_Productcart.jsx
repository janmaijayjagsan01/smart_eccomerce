import { Link } from 'react-router-dom'
import { Star, ShoppingCart } from 'lucide-react'
import { useAuth } from "../3_context/auth_context";
import { cartAPI } from "../4_services/api";
import { useState } from 'react'

export default function ProductCard({ product }) {
  const { user } = useAuth()
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState('')

  const addToCart = async () => {
    if (!user) {
      setMessage('Please login first')
      setTimeout(() => setMessage(''), 2000)
      return
    }
    setAdding(true)
    try {
      await cartAPI.addToCart({
        user_id: user.id,
        product_id: product.id,
        quantity: 1
      })
      setMessage('Added!')
      setTimeout(() => setMessage(''), 1500)
    } catch (err) {
      setMessage('Error')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="card group">
      <Link to={`/products/${product.id}`}>
        <div className="relative overflow-hidden rounded-lg mb-4">
          <img
            src={product.image_url || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.stock_quantity < 10 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Only {product.stock_quantity} left
            </span>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-gray-400">({product.num_reviews})</span>
        </div>
      </Link>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xl font-bold text-primary">₹{product.price}</span>
        <button
          onClick={addToCart}
          disabled={adding || product.stock_quantity === 0}
          className="btn-primary flex items-center gap-1 text-sm disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          {adding ? '...' : message || 'Add'}
        </button>
      </div>
    </div>
  )
}