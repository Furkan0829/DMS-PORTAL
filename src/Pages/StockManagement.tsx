/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";

import {
  Package,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  Building2,
} from "lucide-react";

interface StockMovement {
  Id: string;
  Movement_ID__c: string;
  Quantity__c: number;
  Type__c: "In" | "Out" | "Transfer";
  From_Location__c: string;
  To_Location__c: string;
  CreatedDate: string;

  Product__r?: {
    Name: string;
  };

  Reference__c?: string;
}

const StockManagement = () => {
  const [data, setData] = useState<StockMovement[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string>("");

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

  const fetchStockMovements = async (token: string) => {
    try {
      const query = `SELECT 
        Id,
        Movement_ID__c,
        Quantity__c,
        Type__c,
        CreatedDate,
        From_Location__c,
        To_Location__c,
        Product__r.Name,
        Reference__c
      FROM Stock_Management__c
      WHERE CreatedDate = LAST_N_DAYS:30
      ORDER BY CreatedDate DESC`;

      const encodedQuery = encodeURIComponent(query);

      const url = `https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodedQuery}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(res.data.records);
    } catch (error) {
      console.error("❌ Inventory Fetch Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const token = await getAccessToken();
      if (token) fetchStockMovements(token);
    };
    loadData();
  }, []);

 const filteredData = useMemo(() => {
  return data
    .filter((item) => {
      const movementId = item.Movement_ID__c?.toLowerCase() || "";
      const productName = item.Product__r?.Name?.toLowerCase() || "";
      const searchValue = search.toLowerCase();

      const matchesSearch =
        movementId.includes(searchValue) ||
        productName.includes(searchValue);

      const matchesType =
        activeTab === "All" ? true : item.Type__c === activeTab;

      return matchesSearch && matchesType;
    })
    .sort((a, b) =>
      a.Movement_ID__c.localeCompare(b.Movement_ID__c)
    );
}, [data, search, activeTab]);


  const totalMovements = data.length;
  const stockIn = data
  .filter((i) => i.Type__c === "In")
  .reduce((sum, item) => sum + (item.Quantity__c || 0), 0);

const stockOut = data
  .filter((i) => i.Type__c === "Out")
  .reduce((sum, item) => sum + (item.Quantity__c || 0), 0);

// KEEP TRANSFER SAME (COUNT)
const transfers = data.filter((i) => i.Type__c === "Transfer").length;


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Stocks...
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-y-scroll bg-[#020817] text-white scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-transparent">

      {/* -------- HEADER -------- */}

      <div className="flex flex-col items-start text-left gap-3 px-6 pt-6">
        <h1 className="text-3xl font-semibold text-cyan-400">
          Stock Management
        </h1>

        <p className="text-sm text-slate-400">
          Monitor and optimize stock levels across locations
        </p>
      </div>

      {/* -------- CARDS -------- */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 px-6 mt-6">

        {/* Total */}
        <Card className="bg-[#020817] border border-cyan-500/30 shadow-[0_0_20px_#00ffff33] h-[90px]">
          <CardContent className="h-full flex items-center gap-4 p-5">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-cyan-500/20">
              <Package size={22} className="text-cyan-400" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <p className="text-[22px] font-bold">{totalMovements}</p>
              <p className="text-xs text-slate-400">Total Movements</p>
            </div>
          </CardContent>
        </Card>

        {/* In */}
        <Card className="bg-[#020817] border border-green-500/30 shadow-[0_0_20px_#22c55e33] h-[90px]">
          <CardContent className="h-full flex items-center gap-4 p-5">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-500/20">
              <TrendingUp className="text-green-400" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <p className="text-[22px] font-bold">{stockIn}</p>
              <p className="text-xs text-slate-400">Stock In</p>
            </div>
          </CardContent>
        </Card>

        {/* Out */}
        <Card className="bg-[#020817] border border-red-500/30 shadow-[0_0_20px_#ef444433] h-[90px]">
          <CardContent className="h-full flex items-center gap-4 p-5">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-500/20">
              <TrendingDown className="text-red-400" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <p className="text-[22px] font-bold">{stockOut}</p>
              <p className="text-xs text-slate-400">Stock Out</p>
            </div>
          </CardContent>
        </Card>

        {/* Transfer */}
        <Card className="bg-[#020817] border border-blue-500/30 shadow-[0_0_20px_#3b82f633] h-[90px]">
          <CardContent className="h-full flex items-center gap-4 p-5">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-500/20">
              <ArrowLeftRight className="text-blue-400" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <p className="text-[22px] font-bold">{transfers}</p>
              <p className="text-xs text-slate-400">Transfers</p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* -------- SEARCH + FILTER -------- */}

      <div className="flex flex-col md:flex-row gap-4 px-6 mt-6">

        <div className="relative w-full md:flex-1">
          <Input
            placeholder="Search stock movements..."
            className="h-12 bg-[#071521] border border-cyan-500/20 text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {["All", "In", "Out", "Transfer"].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-12 px-5 border border-cyan-500/20
              ${
                activeTab === tab
                  ? "bg-gradient-to-r from-cyan-500 to-violet-600"
                  : "bg-[#071521]"
              }`}
            >
              {tab}
            </Button>
          ))}
        </div>

      </div>

      {/* -------- TABLE -------- */}



<div className="px-4 md:px-6 mt-6 w-full">

  {/* Horizontal scroll ONLY for table */}
  <div className="w-full overflow-x-auto">

    <div className="min-w-[900px] rounded-xl border border-cyan-500/20 bg-[#020817]">

      <Table className="w-full">

        {/* HEADER (DESKTOP ONLY) */}
        <TableHeader className="hidden md:table-header-group">
          <TableRow className="border-cyan-500/20 h-[56px]">

            <TableHead className="px-4 text-left">Movement ID</TableHead>
            <TableHead className="px-4 text-left">Product</TableHead>
            <TableHead className="px-4 text-left">Type</TableHead>
            <TableHead className="px-4 text-left">Quantity</TableHead>
            <TableHead className="px-4 text-left">From → To</TableHead>
            <TableHead className="px-4 text-left">Date</TableHead>
            <TableHead className="px-4 text-left">Reference</TableHead>

          </TableRow>
        </TableHeader>

        {/* BODY */}
        <TableBody>

          {filteredData.map((item) => {

            const isIn = item.Type__c === "In";
            const isOut = item.Type__c === "Out";

            return (
              <TableRow
                key={item.Id}
                className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition"
              >

                {/* Movement ID */}
                <TableCell className="px-4 py-4 text-cyan-400 font-medium whitespace-nowrap">
                  {item.Movement_ID__c}
                </TableCell>

                {/* Product */}
                <TableCell className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-cyan-400 shrink-0" />
                    {item.Product__r?.Name}
                  </div>
                </TableCell>

                {/* Type */}
                <TableCell className="px-4 py-4 whitespace-nowrap">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs
                    ${
                      isIn
                        ? "bg-green-500/20 text-green-400"
                        : isOut
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {isIn && <TrendingUp size={14} />}
                    {isOut && <TrendingDown size={14} />}
                    {!isIn && !isOut && <ArrowLeftRight size={14} />}
                    {item.Type__c}
                  </div>
                </TableCell>

                {/* Quantity */}
                <TableCell
                  className={`px-4 py-4 font-semibold whitespace-nowrap
                  ${
                    isIn
                      ? "text-green-400"
                      : isOut
                      ? "text-red-400"
                      : "text-blue-400"
                  }`}
                >
                  {isOut ? "-" : "+"}{item.Quantity__c}
                </TableCell>

                {/* From → To */}
                <TableCell className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="shrink-0" />
                    {item.From_Location__c} → {item.To_Location__c}
                  </div>
                </TableCell>

                {/* Date */}
                <TableCell className="px-4 py-4 text-slate-400 whitespace-nowrap">
                  {item.CreatedDate.split("T")[0]}
                </TableCell>

                {/* Reference */}
                <TableCell className="px-4 py-4 whitespace-nowrap">
                  {item.Reference__c || "-"}
                </TableCell>

              </TableRow>
            );
          })}

        </TableBody>

      </Table>

    </div>

  </div>

</div>






</div>
  );
};

export default StockManagement;
