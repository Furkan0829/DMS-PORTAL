import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from "sonner";

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
import OrderDetails from './Pages/OrderDetails';
import Settings from './Pages/Settings';

function App() {

  return (
    <>
      <Toaster
  position="bottom-right"
  richColors
  toastOptions={{
    style: {
      background: "#071018",
      border: "1px solid rgba(0,255,255,0.3)",
      boxShadow: "0 0 15px rgba(0,200,255,0.25)",
      color: "#4fc3ff",
      padding: "12px 16px",
      borderRadius: "12px",
      backdropFilter: "blur(8px)",
      fontSize: "15px",
    },
    className: "shadow-[0_0_20px_rgba(0,200,255,0.25)]",
  }}
/>

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
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
