import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import Layout from './Components/Layout'
import Leads from './Pages/LeadGeneration'
import Stock from './Pages/StockManagement'
import Warranty from './Pages/WarrantyRegistration'
import Dashboard from './Pages/Dashboard'
import ProductCatalog from './Pages/Products'
import Cart from './Pages/Cart'
import Checkout from './Pages/Checkout'
import Orders from './Pages/Orders'
import Profile from './Pages/Profile'

function App() {

  return (
    <>
       <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/leads" element={<Leads />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/warranty" element={<Warranty />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} /> 
        </Route>
      </Routes>
    </>
  )
}

export default App
