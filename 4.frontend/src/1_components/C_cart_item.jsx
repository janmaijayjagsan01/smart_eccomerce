import { Minus, Plus, Trash2 } from 'lucide-react'
// Line 2
import { cartAPI } from '../4_services/api'
import { useState } from 'react'

export default function CartItem({ item, userId, onUpdate }) {
  const [updating, setUpdating] = useState(false)

  const updateQuantity = async (newQty) => {
    setUpdating(true)
    try {
      if (newQty <= 0) {
        await cartAPI.removeItem(item.id)
      } else {
        await cartAPI.updateItem(item.id, { quantity: newQty })
      }
      onUpdate()
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
      <img
        src={item.image_url || 'https://via.placeholder.com/100'}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-grow">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-500 text-sm">₹{item.price} each</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.quantity - 1)}
          disabled={updating}
          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.quantity + 1)}
          disabled={updating}
          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="text-right min-w-[80px]">
        <p className="font-bold text-lg">₹{item.price * item.quantity}</p>
      </div>
      <button
        onClick={() => updateQuantity(0)}
        className="text-red-500 hover:text-red-700 p-2"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  )
}