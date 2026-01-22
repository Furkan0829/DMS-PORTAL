import { useEffect, useState } from "react";
import { ShoppingCart, Package, Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("cartItems");
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  const updateQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter((i) => i.id !== id);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
  };

  const subtotal = cartItems.reduce((a, b) => a + b.price * b.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="p-6">
        {/* BACK LINK */}
        <p
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-cyan-300 cursor-pointer hover:underline"
        >
          ← Back to Products
        </p>

        <h1 className="text-4xl font-bold text-cyan-400 mt-4">Shopping Cart</h1>
        <p className="text-gray-400 mb-6">Review and manage your cart items</p>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#07111f] border border-cyan-500/20 p-5 rounded-xl shadow-cyan-500/20 shadow-md">
            <p className="text-gray-300">Total Items</p>
            <p className="text-3xl font-bold text-cyan-400">0</p>
          </div>
          <div className="bg-[#07111f] border border-cyan-500/20 p-5 rounded-xl shadow-cyan-500/20 shadow-md">
            <p className="text-gray-300">Total Quantity</p>
            <p className="text-3xl font-bold text-cyan-400">0</p>
          </div>
          <div className="bg-[#07111f] border border-cyan-500/20 p-5 rounded-xl shadow-cyan-500/20 shadow-md">
            <p className="text-gray-300">Subtotal</p>
            <p className="text-3xl font-bold text-cyan-400">₹0</p>
          </div>
        </div>

        {/* EMPTY UI */}
        <div className="flex flex-col items-center justify-center py-20 bg-[#07111f] rounded-xl border border-cyan-500/20">
          <ShoppingCart className="h-16 w-16 text-cyan-400 opacity-60 mb-4" />
          <h2 className="text-xl text-gray-300 font-semibold">Your cart is empty</h2>
          <p className="text-gray-500 mt-1 mb-4">Add some products to your cart to see them here</p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* BACK LINK */}
      <p
        onClick={() => navigate("/products")}
        className="flex items-center gap-2 text-cyan-300 cursor-pointer hover:underline"
      >
        ← Back to Products
      </p>

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-cyan-400">Shopping Cart</h1>
      <p className="text-gray-400 -mt-1">Review and manage your cart items</p>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#07111f] p-5 rounded-xl border border-cyan-500/20 shadow-md shadow-cyan-500/20">
          <p className="text-gray-300">Total Items</p>
          <p className="text-3xl text-cyan-400 font-semibold">{cartItems.length}</p>
        </div>
        <div className="bg-[#07111f] p-5 rounded-xl border border-cyan-500/20 shadow-md shadow-cyan-500/20">
          <p className="text-gray-300">Total Quantity</p>
          <p className="text-3xl text-cyan-400 font-semibold">
            {cartItems.reduce((a, b) => a + b.quantity, 0)}
          </p>
        </div>
        <div className="bg-[#07111f] p-5 rounded-xl border border-cyan-500/20 shadow-md shadow-cyan-500/20">
          <p className="text-gray-300">Subtotal</p>
          <p className="text-3xl text-cyan-400 font-semibold">₹{subtotal.toLocaleString()}</p>
        </div>
      </div>

      {/* MAIN FLEX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SECTION – ITEMS LIST */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-[#07111f] p-4 rounded-xl border border-cyan-500/20 shadow-md shadow-cyan-500/10"
            >
              {/* IMAGE */}
              <div className="w-28 h-28 bg-[#0b1b2d] rounded-xl overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} className="w-full h-full object-cover" />
                ) : (
                  <Package className="h-10 w-10 text-gray-500" />
                )}
              </div>

              {/* DETAILS */}
              <div className="flex-1">
                <p className="text-xl font-semibold text-cyan-300">{item.name}</p>

                {/* RATING + STOCK */}
                <p className="text-gray-400 text-sm mb-1">
                  ⭐ {item.rating} • In Stock: {item.stock}
                </p>

                {/* PRICE */}
                <p className="text-[22px] font-bold text-[#4fc3ff]">
                  ₹{item.price.toLocaleString()}
                </p>

                {/* QTY BUTTONS */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="bg-[#0d2236] text-white rounded-full p-2 border border-cyan-500/20"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="bg-[#0d2236] text-white rounded-full p-2 border border-cyan-500/20"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* REMOVE */}
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-400 hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-[#07111f] p-6 rounded-xl border border-cyan-500/20 shadow-md shadow-cyan-500/10 space-y-4">
          <h2 className="text-xl font-semibold text-white">Order Summary</h2>

          <div className="flex justify-between text-gray-300 text-lg">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>

          <div className="text-sm text-green-400">Shipping: FREE</div>

          <hr className="border-cyan-500/20" />

          <div className="flex justify-between text-white text-2xl font-bold">
            <span>Total</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-lg shadow-lg shadow-blue-500/40 hover:-translate-y-1 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
