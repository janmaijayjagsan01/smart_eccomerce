import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { productAPI } from '../4_services/api'
import { useAuth } from "../3_context/auth_context";
import { cartAPI } from "../4_services/api";

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    productAPI.getById(id).then(res => {
      setProduct(res.data.product)
      setLoading(false)
    })
  }, [id])

  const addToCart = async () => {
    if (!user) return
    setAdding(true)
    await cartAPI.addToCart({ user_id: user.id, product_id: product.id, quantity: 1 })
    setAdding(false)
    alert('Added to cart!')
  }

  if (loading) return <div className="text-center py-20">Loading...</div>
  if (!product) return <div className="text-center py-20">Product not found</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/products" className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6">
        <ArrowLeft className="h-5 w-5" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <img
            src={product.image_url || 'https://via.placeholder.com/600'}
            alt={product.name}
            className="w-full rounded-xl shadow-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="font-medium">{product.rating}</span>
            <span className="text-gray-400">({product.num_reviews} reviews)</span>
          </div>

          <p className="text-3xl font-bold text-primary mb-6">₹{product.price}</p>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-gray-500">Category:</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">{product.category}</span>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-gray-500">Stock:</span>
            <span className={product.stock_quantity > 10 ? 'text-green-600' : 'text-red-600'}>
              {product.stock_quantity} available
            </span>
          </div>

          <button
            onClick={addToCart}
            disabled={adding || !user || product.stock_quantity === 0}
            className="btn-primary flex items-center gap-2 text-lg px-8 py-3 disabled:opacity-50"
          >
            <ShoppingCart className="h-5 w-5" />
            {adding ? 'Adding...' : user ? 'Add to Cart' : 'Login to Buy'}
          </button>
        </div>
      </div>
    </div>
  )
}