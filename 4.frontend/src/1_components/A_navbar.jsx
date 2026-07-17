import { Link, useNavigate } from 'react-router-dom'
// Line 2
import { useAuth } from '../3_context/auth_context'
import { ShoppingCart, User, LogOut, Menu, X, Store } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Store className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-900">Smart</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-gray-700 hover:text-primary font-medium">Products</Link>
            {user && (
              <>
                <Link to="/cart" className="text-gray-700 hover:text-primary font-medium flex items-center gap-1">
                  <ShoppingCart className="h-5 w-5" /> Cart
                </Link>
                <Link to="/orders" className="text-gray-700 hover:text-primary font-medium">Orders</Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center gap-1 text-gray-700 hover:text-primary">
                  <User className="h-5 w-5" />
                  <span>{user.username}</span>
                </Link>
                <button onClick={handleLogout} className="text-red-600 hover:text-red-800 flex items-center gap-1">
                  <LogOut className="h-5 w-5" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary font-medium">Login</Link>
                <Link to="/register" className="btn-primary">Register</Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-gray-700">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-2">
            <Link to="/products" className="block py-2 text-gray-700" onClick={() => setMobileOpen(false)}>Products</Link>
            {user && (
              <>
                <Link to="/cart" className="block py-2 text-gray-700" onClick={() => setMobileOpen(false)}>Cart</Link>
                <Link to="/orders" className="block py-2 text-gray-700" onClick={() => setMobileOpen(false)}>Orders</Link>
                <Link to="/profile" className="block py-2 text-gray-700" onClick={() => setMobileOpen(false)}>Profile</Link>
              </>
            )}
            {user ? (
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block py-2 text-red-600 w-full text-left">Logout</button>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-700" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" className="block py-2 text-primary font-medium" onClick={() => setMobileOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}