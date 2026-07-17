import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from "./3_context/auth_context";
import Navbar from './1_components/A_navbar'
import Footer from './1_components/E_footer'
import Home from './2_pages/1_Home'
import Login from './2_pages/2_login'
import Register from './2_pages/3_register'
import Products from './2_pages/4_products'
import ProductDetail from './2_pages/product_detail'
import Cart from './2_pages/cart'
import Checkout from './2_pages/checkout'
import Orders from './2_pages/orders'
import Profile from './2_pages/Profile'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App