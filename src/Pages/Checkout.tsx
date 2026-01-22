import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { ShoppingCart, ArrowLeftCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount?: number;
  image?: string;
}

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);

  const navigate = useNavigate();

  const ACCOUNT_ID = "001fj00000dV4vKAAS"; // provided by you
  const ORDER_TYPE = "Contract"; // fixed order type

  // Load cart
  useEffect(() => {
    const saved = localStorage.getItem("cartItems");
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  // Auth token
  const getToken = async () => {
    const url =
      "https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/oauth2/token";

    const clientId =
      "3MVG9HtWXcDGV.nEjGlOSARSUWdhaRh3M.MZMxCFek1KeKIjSU61s7elcUSSScL4Jfk.rh.ji7og4gPabrfSA";

    const clientSecret =
      "3E5E44662F5C43535B785D740B237868AA86DFC6AC4709037876F6223B419354";

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);

    const res = await axios.post(url, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    setAccessToken(res.data.access_token);
    return res.data.access_token;
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (a, b) => a + b.price * b.quantity,
    0
  );

  const gst = subtotal * 0.18;

  const total = subtotal + gst;

  // Place Order
  const placeOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setIsPlacing(true);

    let token = accessToken;
    if (!token) token = await getToken();
    if (!token) {
      toast.error("Auth failed");
      setIsPlacing(false);
      return;
    }

    const payload = {
      accountId: ACCOUNT_ID,
      orderType: ORDER_TYPE,
      items: cartItems.map((c) => ({
        productId: c.id,
        quantity: c.quantity,
        unitPrice: c.price,
      })),
    };

    try {
      const res = await axios.post(
        "https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/apexrest/DMS_CreateOrder",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("ORDER RESPONSE:", res.data);

      if (!res.data.success) {
        toast.error(res.data.message);
        setIsPlacing(false);
        return;
      }

      toast.success("Order placed successfully!");

      localStorage.removeItem("cartItems");
      navigate("/orders");
    } catch (err) {
      console.error("Order Error:", err);
      toast.error("Order failed");
    }

    setIsPlacing(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center mt-20 text-center space-y-5">
        <ShoppingCart className="h-16 w-16 text-gray-500" />
        <h1 className="text-3xl font-bold text-white">Your Cart is Empty</h1>
        <Button
          onClick={() => navigate("/products")}
          className="bg-gradient-to-r from-cyan-500 to-blue-600"
        >
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/products")}
        className="flex items-center gap-2 text-cyan-400"
      >
        <ArrowLeftCircle /> Back to Products
      </Button>

      <h1 className="text-3xl font-bold text-cyan-400">Checkout</h1>
      <p className="text-gray-400">Review your order before placing it</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* LEFT CART ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card
              key={item.id}
              className="bg-[#061221] border border-cyan-500/20 shadow-[0_0_15px_rgba(0,255,255,0.15)]"
            >
              <CardContent className="flex items-center gap-4 p-4">
                {item.image ? (
                  <img
                    src={item.image}
                    className="h-20 w-20 rounded-lg object-cover border border-cyan-500/30"
                  />
                ) : (
                  <div className="h-20 w-20 bg-gray-800 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-8 w-8 text-gray-500" />
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-cyan-300">
                    {item.name}
                  </h3>
                  <p className="text-gray-400">Quantity: {item.quantity}</p>
                  <p className="text-gray-100 font-semibold">
                    ₹ {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* RIGHT ORDER SUMMARY */}
        <Card className="bg-[#061221] border border-cyan-500/20 shadow-[0_0_20px_rgba(0,255,255,0.25)]">
          <CardHeader>
            <CardTitle className="text-cyan-300">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-gray-300">
              <span>Subtotal</span>
              <span>₹ {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-gray-300">
              <span>GST (18%)</span>
              <span>₹ {gst.toLocaleString()}</span>
            </div>

            <Separator className="bg-cyan-500/30" />

            <div className="flex justify-between text-xl font-bold text-cyan-300">
              <span>Total</span>
              <span>₹ {total.toLocaleString()}</span>
            </div>

            <Button
              onClick={placeOrder}
              disabled={isPlacing}
              className="
              w-full h-12 text-lg font-semibold
              bg-gradient-to-r from-cyan-400 to-blue-600
              hover:shadow-[0_0_25px_rgba(0,200,255,0.8)]
              transition-all"
            >
              {isPlacing ? "Placing Order..." : "Place Order"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
