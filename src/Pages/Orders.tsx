import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/Components/ui/card";
import { Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ORDER_TABS = [
  { key: "Contract", label: "Contract Orders" },
  { key: "Secondary", label: "Secondary Orders" },
  { key: "Dispatched", label: "Dispatched Orders" },
];

interface OrderRecord {
  Id: string;
  OrderNumber: string;
  Account: { Name: string };
  EffectiveDate: string;
  TotalAmount: number;
  Status: string;
  RecordType: { DeveloperName: string };
}

const Orders = () => {
  const [activeTab, setActiveTab] = useState("Contract");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [filtered, setFiltered] = useState<OrderRecord[]>([]);
  const [search, setSearch] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // -------------------------------
  // 1) Get Salesforce Access Token
  // -------------------------------
  const getAccessToken = async () => {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", "3MVG9HtWXcDGV.nEjGlOSARSUWdhaRh3M.MZMxCFek1KeKIjSU61s7elcUSSScL4Jfk.rh.ji7og4gPabrfSA");
    params.append("client_secret", "3E5E44662F5C43535B785D740B237868AA86DFC6AC4709037876F6223B419354");

    try {
      const res = await axios.post(
        "https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/oauth2/token",
        params,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      setToken(res.data.access_token);
      return res.data.access_token;
    } catch (err) {
      console.error("Token Error:", err);
      return null;
    }
  };

  // -------------------------------
  // 2) Fetch Orders by Record Type
  // -------------------------------
  const fetchOrders = async (accessToken: string) => {
    const query = `
      SELECT 
        Id, OrderNumber, EffectiveDate, TotalAmount, Status,
        Account.Name,
        RecordType.DeveloperName
      FROM Order
      WHERE RecordType.DeveloperName IN ('Contract','Secondary','Dispatched')
      ORDER BY CreatedDate DESC
    `;

    const res = await axios.get(
      `https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodeURIComponent(
        query
      )}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    setOrders(res.data.records);
  };

  // INIT
  useEffect(() => {
    const init = async () => {
      const access = await getAccessToken();
      if (access) fetchOrders(access);
    };
    init();
  }, []);

  // -------------------------------
  // 3) Filter Orders by tab + search
  // -------------------------------
  useEffect(() => {
    let data = orders.filter((o) => o.RecordType.DeveloperName === activeTab);

    if (search.trim()) {
      data = data.filter((o) =>
        o.OrderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.Account?.Name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(data);
  }, [orders, activeTab, search]);

  // -------------------------------
  // STATUS BADGE UI
  // -------------------------------
  const StatusBadge = ({ status }: { status: string }) => {
    const colors: any = {
      Draft: "bg-yellow-600/30 text-yellow-300",
      Pending: "bg-yellow-600/30 text-yellow-300",
      Processing: "bg-blue-600/30 text-blue-300",
      Activated: "bg-green-600/30 text-green-300",
      Completed: "bg-green-600/30 text-green-300",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-700 text-gray-300"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-cyan-400">Orders</h1>
      <p className="text-gray-400 -mt-2">Manage all your distribution orders</p>

      {/* TAB SWITCH */}
      <div className="flex gap-3 flex-wrap">
        {ORDER_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-5 py-2 rounded-xl text-sm font-bold border 
              ${
                activeTab === t.key
                  ? "bg-gradient-to-r from-[#0CD5FB] via-[#359AE8] to-[#6B54D6] border-cyan-400 text-black shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:translate-y-[-4px] hover:shadow-[0px_0px_25px_rgba(0,200,255,0.8)]"
                  : "bg-[#0d1625] border-cyan-500/10 text-gray-300 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,255,255,0.1)] hover:translate-y-[-2px] transition-all duration-200"
              }
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-3 text-cyan-400" />
        <input
          className="w-full pl-12 pr-4 py-3 bg-[#0d1625] border border-cyan-500/20 text-cyan-200 rounded-xl"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ORDERS TABLE */}
      <Card className="bg-[#071018] border border-cyan-500/20 rounded-2xl shadow-xl overflow-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-cyan-500/10">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((o) => (
              <tr
                key={o.Id}
                className="text-gray-300 border-b border-[#0f1f38] hover:bg-[#0d1625] transition"
              >
                <td className="p-4 text-cyan-300 cursor-pointer"
                    onClick={() => navigate(`/orders/${o.Id}`)}>
                  {o.OrderNumber}
                </td>

                <td className="p-4">{o.Account?.Name}</td>

                <td className="p-4">{o.EffectiveDate}</td>

                <td className="p-4 font-semibold text-cyan-300">
                  ₹{o.TotalAmount?.toLocaleString()}
                </td>

                <td className="p-4">
                  <StatusBadge status={o.Status} />
                </td>

                <td className="p-4 text-center">
                  <Eye
                    className="text-cyan-300 cursor-pointer hover:scale-125 transition"
                    onClick={() => navigate(`/orders/${o.Id}`)}
                  />
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Orders;
