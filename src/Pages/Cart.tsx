import { useEffect, useState } from "react";
import { ShoppingCart, Package, Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loadingCart, setLoadingCart] = useState(true); // FIX
  const navigate = useNavigate();

  // LOAD CART (only once)
  useEffect(() => {
    const stored = localStorage.getItem("cartItems");
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem("cartItems");
        setCartItems([]);
      }
    }
    setLoadingCart(false); // STOP EMPTY FLASH
  }, []);

  // SYNC CART
  useEffect(() => {
    if (!loadingCart) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, loadingCart]);

  // UPDATE QTY
  const updateQty = (id: string, delta: number) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      );
      localStorage.setItem("cartItems", JSON.stringify(updated));
      return updated;
    });
  };

  // REMOVE ITEM
  const removeItem = (id: string) => {
    const updated = cartItems.filter((i) => i.id !== id);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
  };

  // CLEAR CART
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  const subtotal = cartItems.reduce((a, b) => a + b.price * b.quantity, 0);

  // IMPORTANT → prevent empty UI from showing before load
  if (loadingCart) return null;

  // EMPTY CART UI
  if (cartItems.length === 0) {
    return (
      <div className="p-6">
        <div className="flex justify-between p-5 space-y-6 relative align-center">
          <div>
            <p
              onClick={() => navigate("/products")}
              className="flex items-center gap-2 text-cyan-300 cursor-pointer hover:underline"
            >
              ← Back to Products
            </p>

            <h1 className="text-4xl font-bold text-cyan-400 mt-4">
              Shopping Cart
            </h1>
            <p className="text-gray-400 mb-6">
              Review and manage your cart items
            </p>
          </div>

          <div className="font-bold flex items-center gap-2 px-4 py-1 h-8 rounded-full bg-purple-600 text-white text-sm shadow-md">
            <ShoppingCart size={16} className="text-white" />0 items
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="border border-cyan-500/20 p-5 rounded-xl shadow-cyan-500/20 shadow-md">
            <p className="text-gray-300">Total Items</p>
            <p className="text-3xl font-bold text-cyan-400">0</p>
          </div>
          <div className="border border-cyan-500/20 p-5 rounded-xl shadow-cyan-500/20 shadow-md">
            <p className="text-gray-300">Total Quantity</p>
            <p className="text-3xl font-bold text-cyan-400">0</p>
          </div>
          <div className="border border-cyan-500/20 p-5 rounded-xl shadow-cyan-500/20 shadow-md">
            <p className="text-gray-300">Subtotal</p>
            <p className="text-3xl font-bold text-cyan-400">₹0</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-cyan-500/20 shadow-cyan-500/30 shadow-lg">
          <ShoppingCart className="h-16 w-16 text-cyan-400 opacity-60 mb-4" />
          <h2 className="text-xl text-gray-300 font-semibold">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mt-1 mb-4">
            Add some products to your cart to see them here
          </p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-800 text-white shadow-lg shadow-cyan-500/30"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // MAIN CART
  return (
    <div className="p-6 space-y-6 relative">
      <div className="p-6 space-y-6 relative">
        {/* BACK BUTTON */}
        <p
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-cyan-300 cursor-pointer hover:underline"
        >
          ← Back to Products
        </p>

        {/* TITLE + ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Title */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">
              Shopping Cart
            </h1>
            <p className="text-gray-400 -mt-1">
              Review and manage your cart items
            </p>
          </div>

          {/* Action Buttons (Cart count + Clear) */}
          {cartItems.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div
                className="font-bold flex items-center justify-center gap-2 px-4 py-2 
                        rounded-lg bg-purple-600 text-white text-sm shadow-md w-full sm:w-auto"
              >
                <ShoppingCart size={16} />
                {cartItems.length} items
              </div>

              <button
                onClick={clearCart}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold 
                    shadow-md hover:bg-red-700 w-full sm:w-auto"
              >
                <Trash2 size={16} className="inline-block mr-1 mb-1" />
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Items */}
        <div className="flex items-center gap-4 bg-[#07111f] p-5 rounded-xl border border-cyan-500/20 shadow-md shadow-cyan-500/20">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-900/20 flex items-center justify-center">
            <ShoppingCart size={26} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-white text-3xl font-semibold">
              {cartItems.length}
            </p>
            <p className="text-gray-400 text-sm">Total Items</p>
          </div>
        </div>

        {/* Total Quantity */}
        <div className="flex items-center gap-4 bg-[#07111f] p-5 rounded-xl border border-green-500/20 shadow-md shadow-green-500/20">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-900/20 flex items-center justify-center">
            <Package size={26} className="text-green-400" />
          </div>
          <div>
            <p className="text-white text-3xl font-semibold">
              {cartItems.reduce((a, b) => a + b.quantity, 0)}
            </p>
            <p className="text-gray-400 text-sm">Total Quantity</p>
          </div>
        </div>

        {/* Subtotal */}
        <div className="flex items-center gap-4 bg-[#07111f] p-5 rounded-xl border border-purple-500/20 shadow-md shadow-purple-500/20">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-900/20 flex items-center justify-center">
            <Trash2 size={26} className="text-purple-400" />
          </div>
          <div>
            <p className="text-white text-3xl font-semibold">
              ₹{subtotal.toLocaleString()}
            </p>
            <p className="text-gray-400 text-sm">Subtotal</p>
          </div>
        </div>
      </div>

      {/* MAIN FLEX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-[#07111f] p-4 rounded-xl border border-cyan-500/20 shadow-md shadow-cyan-500/10"
            >
              <div className="w-28 h-28 bg-[#0b1b2d] rounded-xl overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="h-10 w-10 text-gray-500" />
                )}
              </div>

              <div className="flex-1">
                <p className="text-xl font-semibold text-cyan-300">
                  {item.name}
                </p>

                {/* FIX: SAFE ACCESS */}
                <p className="text-gray-400 text-sm mb-1">
                  ⭐ {item.rating ?? "N/A"} • In Stock: {item.stock ?? "N/A"}
                </p>

                <p className="text-[22px] font-bold text-[#4fc3ff]">
                  ₹{item.price.toLocaleString()}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="bg-[#0d2236] hover:bg-blue-500 text-white rounded-full p-2 border border-cyan-500/20"
                  >
                    <Minus size={18} />
                  </button>

                  <span className="text-white">{item.quantity}</span>

                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="bg-[#0d2236] hover:bg-blue-500 text-white rounded-full p-2 border border-cyan-500/20"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-red-400 hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-[#07111f] h-fit p-6 rounded-xl border border-cyan-500/20 shadow-md shadow-cyan-500/10 space-y-4">
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
            className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 rounded-xl text-lg shadow-lg shadow-blue-500/40 hover:-translate-y-1 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
