// src/Pages/Products.tsx

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
//import { Button } from "@/Components/ui/button";
import {
  Search,
  ShoppingCart,
  Star,
  Package,
  Filter,
  Menu,
  Boxes,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useOutletContext } from "react-router-dom";

interface SFProductRecord {
  Product2: {
    Id: string;
    Name: string;
    ProductCode: string;
    Category__c: string;
    DisplayUrl: string;
    Rating__c: number;
    InStock__c: number;
    Offer_Price__c: number;
    Discount__c: number;
  };
  UnitPrice: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  offerPrice: number;
  discount: number;
  image: string;
  rating: number;
  stock: number;
  quantity?: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  rating?: number;
  stock?: number;
}

const ProductCatalog = () => {
  const navigate = useNavigate();
  //const { toggleSidebar } = useOutletContext<any>();

  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // LOAD CART
  useEffect(() => {
    const saved = localStorage.getItem("cartItems");
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // SF TOKEN
  const getAccessToken = async () => {
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

    try {
      const res = await axios.post(url, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      setAccessToken(res.data.access_token);
      return res.data.access_token;
    } catch (err) {
      console.error("Token Error:", err);
      return null;
    }
  };

  // FETCH PRODUCTS
  const fetchProducts = async (token: string) => {
    try {
      const query = `
      SELECT 
        Product2.Id,
        Product2.Name,
        Product2.ProductCode,
        Product2.Category__c,
        Product2.DisplayUrl,
        Product2.Rating__c,
        Product2.InStock__c,
        Product2.Offer_Price__c,
        Product2.Discount__c,
        UnitPrice
      FROM PricebookEntry
      WHERE Pricebook2.IsStandard = TRUE
      AND Product2.Family = 'DMS'
      AND IsActive = TRUE
      AND Product2.IsActive = TRUE
    `;

      const urlQuery = encodeURIComponent(query);
      const url = `https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${urlQuery}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mapped: Product[] = res.data.records.map((r: SFProductRecord) => ({
        id: r.Product2.Id,
        name: r.Product2.Name,
        sku: r.Product2.ProductCode,
        category: r.Product2.Category__c,
        price: r.UnitPrice,
        offerPrice: r.Product2.Offer_Price__c,
        discount: r.Product2.Discount__c,
        image: r.Product2.DisplayUrl,
        rating: r.Product2.Rating__c,
        stock: r.Product2.InStock__c,
      }));

      setProducts(mapped);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // INIT
  useEffect(() => {
    const init = async () => {
      const token = await getAccessToken();
      if (token) fetchProducts(token);
    };
    init();
  }, []);

  const addToCart = (p: Product) => {
    const exists = cartItems.find((i) => i.id === p.id);

    let updatedCart;

    if (exists) {
      updatedCart = cartItems.map((item) =>
        item.id === p.id
          ? { ...item, quantity: item.quantity + (p.quantity ?? 1) }
          : item,
      );
    } else {
      updatedCart = [
        ...cartItems,
        {
          id: p.id,
          name: p.name,
          price: p.offerPrice,
          quantity: p.quantity ? p.quantity : 1,
          image: p.image,
          rating: p.rating, // ✅ add this
          stock: p.stock, // ✅ add this
        },
      ];
    }

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    toast.success(`${p.name} added to cart`);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <p className="text-center mt-20 text-lg text-cyan-300">
        Loading products...
      </p>
    );

  return (
    <div className="space-y-6 pb-10 ml-5 mt-5 mr-2 overflow-x-hidden">
      {/* TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400 mt-2 sm:mt-4">
            Products
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Browse and manage your product catalog
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="
      w-full sm:w-auto
      px-4 py-2 
      bg-gradient-to-r from-cyan-400 to-purple-600 
      text-black rounded-xl 
      shadow-[0_0_25px_rgba(34,211,238,0.45)]
      hover:-translate-y-1 transition
    "
        >
          + Add Product
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Products",
            value: products.length,
            iconBg: "bg-cyan-700/20",
            iconColor: "text-cyan-400",
            icon: <Boxes className="h-8 w-8" />,
          },
          {
            label: "In Stock",
            value: products.reduce((a, b) => a + b.stock, 0),
            iconBg: "bg-green-700/20",
            iconColor: "text-green-400",
            icon: <Layers className="h-8 w-8" />,
          },
          {
            label: "Avg Rating",
            value: (
              products.reduce((a, b) => a + b.rating, 0) / products.length
            ).toFixed(1),
            iconBg: "bg-purple-700/20",
            iconColor: "text-purple-400",
            icon: <Star className="h-8 w-8" />,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="border border-cyan-500/20 shadow-[0_0_20px_rgba(0,255,255,0.10)] 
                 rounded-2xl p-4 flex items-center gap-4"
          >
            {/* ICON */}
            <div
              className={`h-14 w-14 rounded-xl flex items-center justify-center 
                   ${item.iconBg} ${item.iconColor}`}
            >
              {item.icon}
            </div>

            {/* TEXT */}
            <div>
              <p className="text-white text-3xl font-bold">{item.value}</p>
              <p className="text-gray-400 text-sm">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SEARCH + FILTER */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-10 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 h-5 w-5" />

          <Input
            className="border-cyan-500/20 text-cyan-200 pl-12 rounded-xl shadow-[0_0_12px_rgba(0,255,255,0.15)] h-12"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-span-12 sm:col-span-2">
          <button
            className="
      w-full h-12
      flex items-center justify-center gap-2 
      text-white font-medium
      bg-[#0d1625]
      border border-cyan-500/20 
      rounded-xl 
      shadow-[0_0_12px_rgba(0,255,255,0.15)]
      hover:border-cyan-400
      hover:shadow-[0_0_18px_rgba(0,255,255,0.3)]
      transition
    "
          >
            <Filter size={18} className="text-cyan-300" />
            Filters
          </button>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <Card
            key={p.id}
            className="
              bg-[#071018]/80 
              border border-[#0f1f38]
              rounded-2xl
              shadow-[0px_0px_20px_rgba(0,150,255,0.15)]
              hover:shadow-[0px_0px_25px_rgba(0,200,255,0.25)]
              hover:-translate-y-2
              transition-all duration-300
              overflow-hidden relative"
          >
            {/* CATEGORY BADGE */}
            <span
              className="
    absolute top-3 right-3 px-4 py-1 text-xs font-medium 
    text-black bg-cyan-400 border border-cyan-400/30 
    rounded-full shadow-[0_0_10px_rgba(0,255,255,0.4)]
    z-20
  "
            >
              {p.category}
            </span>

            {/* IMAGE */}
            <div className="h-48 overflow-hidden relative z-10">
              {p.image ? (
                <img
                  src={p.image}
                  className="
        w-full h-full object-cover 
        transition-transform duration-500 
        hover:scale-110
      "
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#0d1625]">
                  <Package className="h-16 w-16 text-gray-500" />
                </div>
              )}
            </div>

            <CardHeader>
              <CardTitle className="text-cyan-300 text-xl font-base">
                {p.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* RATING */}
              <div className="flex items-center gap-1 text-gray-300">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>{p.rating}</span>
                <span className="text-xs text-gray-500">
                  • {p.stock} in stock
                </span>
              </div>

              {/* PRICE + ADD */}
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-[22px] font-bold text-[#4fc3ff]">
                    ₹
                    {p.offerPrice
                      ? p.offerPrice.toLocaleString()
                      : p.price.toLocaleString()}
                  </p>

                  {p.price && (
                    <p className="text-sm text-gray-400 line-through -mt-1">
                      ₹{p.price.toLocaleString()}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => addToCart(p)}
                  className="px-5 py-2
                    bg-gradient-to-r from-cyan-400 to-purple-700
                    text-black font-base rounded-lg
                    shadow-[0_0_25px_rgba(34,211,238,0.45)]
                    hover:translate-y-[-4px] hover:shadow-[0px_0px_25px_rgba(0,200,255,0.8)]
                    transition-all duration-300 flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;
