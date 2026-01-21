import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Star, Package } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// -------------------------
// TYPES
// -------------------------
interface SFProductRecord {
  Product2: {
    Id: string;
    Name: string;
    ProductCode: string;
    Family: string;
    ImageURL__c: string;
    Rating__c: number;
    InStock__c: number;
    MRP__c: number;
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
  mrp: number;
  offerPrice: number;
  discount: number;
  image: string;
  rating: number;
  stock: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// -------------------------

const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // -------------------------
  // LOAD CART FROM LOCAL STORAGE
  // -------------------------
  useEffect(() => {
    const saved = localStorage.getItem("cartItems");
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // -------------------------
  // SALESFORCE TOKEN
  // -------------------------
  const getAccessToken = async () => {
    const url = "https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/oauth2/token";
    const clientId = "3MVG9HtWXcDGV.nEjGlOSARSUWdhaRh3M.MZMxCFek1KeKIjSU61s7elcUSSScL4Jfk.rh.ji7og4gPabrfSA";
    const clientSecret = "3E5E44662F5C43535B785D740B237868AA86DFC6AC4709037876F6223B419354";

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

  // -------------------------
  // FETCH PRODUCTS
  // -------------------------
  const fetchProducts = async (token: string) => {
    try {
      const query = `
        SELECT 
          Product2.Id,
          Product2.Name,
          Product2.ProductCode,
          Product2.Family,
          Product2.ImageURL__c,
          Product2.Rating__c,
          Product2.InStock__c,
          Product2.Offer_Price__c,
          Product2.Discount__c,
          UnitPrice
        FROM PricebookEntry
        WHERE Pricebook2.IsStandard = TRUE
        AND IsActive = TRUE
        AND Product2.IsActive = TRUE
      `;

      const encoded = encodeURIComponent(query);
      const url = `https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encoded}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mapped: Product[] = res.data.records.map((r: SFProductRecord) => ({
        id: r.Product2.Id,
        name: r.Product2.Name,
        sku: r.Product2.ProductCode,
        category: r.Product2.Family,
        price: r.UnitPrice,
        //mrp: r.Product2.MRP__c,
        offerPrice: r.Product2.Offer_Price__c,
        discount: r.Product2.Discount__c,
        image: r.Product2.ImageURL__c,
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

  // -------------------------
  // INITIAL FETCH
  // -------------------------
  useEffect(() => {
    const init = async () => {
      const token = await getAccessToken();
      if (token) fetchProducts(token);
    };
    init();
  }, []);

  // -------------------------
  // CART MANAGEMENT
  // -------------------------
  const addToCart = (p: Product) => {
    const exists = cartItems.find((i) => i.id === p.id);

    if (exists) {
      exists.quantity += 1;
      setCartItems([...cartItems]);
    } else {
      setCartItems([...cartItems, { id: p.id, name: p.name, price: p.price, quantity: 1, image: p.image }]);
    }

    toast.success("Added to cart!");
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // -------------------------

  if (loading) return <p className="text-center mt-20 text-lg">Loading products...</p>;

  return (
    <div className="space-y-6 pb-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-gray-500">Browse and manage your product catalog</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-gray-500">Total Products</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-gray-500">Total Stock</p>
              <p className="text-2xl font-bold">{products.reduce((a, b) => a + (b.stock || 0), 0)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-gray-500">Avg Rating</p>
              <p className="text-2xl font-bold">
                {(products.reduce((a, b) => a + (b.rating || 0), 0) / products.length).toFixed(1)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400 h-5" />
        <Input className="pl-10" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <Card key={p.id} className="overflow-hidden shadow hover:shadow-xl transition">
            {/* PRODUCT IMAGE */}
            <div className="h-48 bg-gray-100">
              {p.image ? (
                <img src={p.image} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            <CardHeader>
              <CardTitle className="flex justify-between">
                {p.name}
                <Badge>{p.category}</Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">

              {/* RATING */}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{p.rating}</span>
                <span className="text-xs text-gray-500">({p.stock} in stock)</span>
              </div>

              {/* PRICE */}
              <div>
                <p className="text-xl font-bold text-blue-600">₹{p.offerPrice ? p.offerPrice : p.price}</p>
                {p.price && (
                  <p className="text-sm line-through text-gray-500">₹{p.price}</p>
                )}
              </div>

              {/* ADD TO CART */}
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                onClick={() => addToCart(p)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;
