/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { Card, CardContent } from "../Components/ui/card";
import { Input } from "../Components/ui/input";
import { Badge } from "../Components/ui/badge";

import {
  Package,
  TrendingUp,
  AlertTriangle,
  XCircle,
  Building2,
  Filter,
} from "lucide-react";

/* ================= SALESFORCE STRUCTURE ================= */

interface InventoryRecord {
  Id: string;
  Name: string;
  Product__r: {
    Name: string;
  };
  Stock__c: number;
  Category__c: string;
  Current_Stock__c: number;
  Warehouse__c: string;
  Status__c: string;
  Value__c: number;
  Total_Stock_Value__c: number;
}

/* ================= COMPONENT ================= */

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string>("");

  /* ================= FETCH SALESFORCE TOKEN ================= */

  const getAccessToken = async () => {
    const salesforceUrl =
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
      const response = await axios.post(salesforceUrl, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const token = response.data.access_token;
      setAccessToken(token);
      return token;
    } catch (error) {
      console.error("❌ Token Error", error);
      return null;
    }
  };

  /* ================= FETCH INVENTORY ================= */

  const fetchInventory = async (token: string) => {
    try {
      const query = `
        SELECT
          Id,
          Name,
          Product__r.Name,
          Category__c,
          Current_Stock__c,
          Stock__c,
          Warehouse__c,
          Status__c,
          Value__c,
          Total_Stock_Value__c
        FROM Inventory__c
      `;

      const encodedQuery = encodeURIComponent(query);

      const url = `https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodedQuery}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInventory(res.data.records);
    } catch (error) {
      console.error("❌ Inventory Fetch Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const token = await getAccessToken();
      if (token) fetchInventory(token);
    };
    loadData();
  }, []);

  /* ================= FILTER + SORT ================= */

  const filteredInventory = useMemo(() => {
    return inventory
      .filter(
        (item) =>
          item.Name.toLowerCase().includes(search.toLowerCase()) ||
          item.Product__r?.Name.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => {
        const numA = parseInt(a.Name.replace(/\D/g, ""));
        const numB = parseInt(b.Name.replace(/\D/g, ""));
        return numA - numB; // ASCENDING
      });
  }, [search, inventory]);

  /* ================= CARD CALCULATIONS ================= */

  const totalProducts = inventory.length;

  const inventoryValue = inventory.reduce(
    (sum, item) => sum + item.Value__c,
    0,
  );

  const lowStockCount = filteredInventory.filter(
    (item) => item.Status__c === "Low Stock",
  ).length;

  const outOfStockCount = filteredInventory.filter(
    (item) => item.Status__c === "Out Of Stock",
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Inventory...
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div
      className="
      space-y-6
      text-white
      h-full
      overflow-y-auto
      
      pr-2
    "
    >
      {/* HEADER */}
      <div className="flex flex-col items-start text-left gap-3">
        <h1 className="text-4xl font-semibold text-cyan-400">Inventory</h1>

        <p className="text-sm text-gray-400">
          Track and manage your inventory levels
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL PRODUCTS */}
        <Card className="bg-[#071521] border border-cyan-500/20 rounded-xl h-[80px] sm:h-[90px]">
          <CardContent className="h-full px-4 py-0 flex items-start gap-4">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Package size={22} className="text-cyan-400" />
            </div>
            <div className="flex flex-col items-start justify-start gap-1">
              <span className="text-[22px] font-medium leading-none">
                {totalProducts}
              </span>
              <span className="text-sm text-gray-400">Total Products</span>
            </div>
          </CardContent>
        </Card>

        {/* INVENTORY VALUE */}
        <Card className="bg-[#071521] border border-cyan-500/20 rounded-xl h-[80px] sm:h-[90px]">
          <CardContent className="h-full px-4 py-0 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp size={22} className="text-green-400" />
            </div>
            <div className="flex flex-col items-start justify-start gap-1">
              <span className="text-[22px] font-medium leading-none">
                ₹{(inventoryValue / 100000).toFixed(1)}L
              </span>
              <span className="text-sm text-gray-400">Inventory Value</span>
            </div>
          </CardContent>
        </Card>

        {/* LOW STOCK */}
        <Card className="bg-[#071521] border border-cyan-500/20 rounded-xl h-[80px] sm:h-[90px]">
          <CardContent className="h-full px-4 py-0 flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle size={22} className="text-yellow-400" />
            </div>
            <div className="flex flex-col items-start justify-start gap-1">
              <span className="text-[22px] font-medium leading-none">
                {lowStockCount}
              </span>
              <span className="text-sm text-gray-400">Low Stock Items</span>
            </div>
          </CardContent>
        </Card>

        {/* OUT OF STOCK */}
        <Card className="bg-[#071521] border border-cyan-500/20 rounded-xl h-[80px] sm:h-[90px]">
          <CardContent className="h-full px-4 py-0 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <XCircle size={22} className="text-red-400" />
            </div>
            <div className="flex flex-col items-start justify-start gap-1">
              <span className="text-[22px] font-medium leading-none">
                {outOfStockCount}
              </span>
              <span className="text-sm text-gray-400">Out Of Stock</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH */}
      <div className="flex gap-3">
        <Input
          className="h-12 border border-cyan-500/20 bg-[#071521]"
          placeholder="Search inventory..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="h-12 px-5 rounded-lg border border-cyan-500/20 flex items-center gap-2 hover:bg-cyan-500/10">
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-[#071521] border border-cyan-500/20 rounded-xl w-full">
        {/* ================= HEADER ================= */}

        <div
          className="
      grid
      grid-cols-[90px_1.6fr_70px_90px]
      lg:grid-cols-[140px_1.8fr_1fr_1fr_1.3fr_1fr_1fr]
      px-4 lg:px-6 py-4
      text-sm text-gray-400
      border-b border-cyan-500/10
    "
        >
          {/* MOBILE + DESKTOP */}
          <div className="pl-1">Inventory ID</div>
          <div className="pl-2">Product</div>
          <div className="text-center">Stock</div>
          <div className="text-center">Status</div>

          {/* DESKTOP ONLY */}
          <div className="hidden lg:block">Category</div>
          <div className="hidden lg:block">Warehouse</div>
          <div className="hidden lg:block text-right pr-2">Value</div>
        </div>

        {/* ================= ROWS ================= */}

        {filteredInventory.map((item) => (
          <div
            key={item.Id}
            className="
        grid
        grid-cols-[90px_1.6fr_70px_90px]
        lg:grid-cols-[140px_1.8fr_1fr_1fr_1.3fr_1fr_1fr]
        px-4 lg:px-6 py-4
        items-center
        border-b border-cyan-500/10
        hover:bg-cyan-500/5
      "
          >
            {/* Inventory ID */}
            <div className="pl-1 text-cyan-400 font-medium">{item.Name}</div>

            {/* Product */}
            <div className="pl-2 flex items-center gap-2 min-w-0">
              <div className="bg-cyan-500/20 p-1.5 rounded-md shrink-0">
                <Package size={14} className="text-cyan-400" />
              </div>

              <span className="font-medium truncate text-sm">
                {item.Product__r?.Name}
              </span>
            </div>

            {/* Stock */}
            <div className="text-center flex items-center justify-center gap-1">
              {/* NUMERATOR */}
              <span className="text-white font-semibold text-xl">
                {item.Current_Stock__c}
              </span>

              {/* DENOMINATOR */}
              <span className="text-gray-400 text-sm">
                /{item.Total_Stock_Value__c}
              </span>
            </div>

            {/* Status */}
            <div className="flex justify-center">
              <Badge
                className={
                  item.Status__c === "In Stock"
                    ? "bg-green-500/20 text-green-400"
                    : item.Status__c === "Low Stock"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                }
              >
                {item.Status__c}
              </Badge>
            </div>

            {/* DESKTOP ONLY */}

            <div className="hidden lg:block">
              <Badge variant="outline" className="border-cyan-500/40">
                {item.Category__c}
              </Badge>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <Building2 size={16} className="text-cyan-400" />
              <span>{item.Warehouse__c}</span>
            </div>

            <div className="hidden lg:block text-right font-semibold pr-2">
              ₹{item.Value__c.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
