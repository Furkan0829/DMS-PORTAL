import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/Components/ui/card";
import { Search, Eye, Truck, Package, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ORDER_TABS = [
  { img: Package, key: "Contract", label: "Contract Orders" },
  { img: Clock, key: "Secondary", label: "Secondary Orders" },
  { img: Truck, key: "Dispatched", label: "Dispatched Orders" },
];

interface OrderRecord {
  Id: string;
  OrderNumber: string;
  Account: { Name: string };
  EffectiveDate: string;
  TotalAmount: number;
  Status: string;
  RecordType: { Id: string };
  // new fields (we select all, but only display few)
}

const Orders = () => {
  const [activeTab, setActiveTab] = useState("Contract");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [filtered, setFiltered] = useState<OrderRecord[]>([]);
  const [search, setSearch] = useState("");

  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // Record types
  const RT_Contract = "012fj000003uHm1AAE";
  const RT_Secondary = "012fj000003uEY3AAM";
  const RT_Dispatched = "012fj000003uHpFAAU";

  const activeRecordTypeId = () => {
    if (activeTab === "Contract") return RT_Contract;
    if (activeTab === "Secondary") return RT_Secondary;
    if (activeTab === "Dispatched") return RT_Dispatched;
    return "";
  };

  // -------------------------------
  // 1) Get Salesforce Access Token
  // -------------------------------
  const getAccessToken = async () => {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append(
      "client_id",
      "3MVG9HtWXcDGV.nEjGlOSARSUWdhaRh3M.MZMxCFek1KeKIjSU61s7elcUSSScL4Jfk.rh.ji7og4gPabrfSA",
    );
    params.append(
      "client_secret",
      "3E5E44662F5C43535B785D740B237868AA86DFC6AC4709037876F6223B419354",
    );

    try {
      const res = await axios.post(
        "https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/oauth2/token",
        params,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );

      setToken(res.data.access_token);
      return res.data.access_token;
    } catch (err) {
      console.error("Token Error:", err);
      return null;
    }
  };

  // -------------------------------
  // 2) Fetch ALL required fields
  // -------------------------------

  const fetchOrders = async (accessToken: string) => {
    const query = `
      SELECT Id, OrderNumber, Account.Name, AccountId,
    EffectiveDate, EndDate, Status,
    TotalAmount, Pricebook2Id, Type,
    PoNumber, PoDate, Description,
    BillingAddress, ShippingAddress,
    CompanyAuthorizedById, CustomerAuthorizedById,
    RecordType.Id
      FROM Order
      WHERE RecordType.Id IN ('${RT_Contract}', '${RT_Secondary}', '${RT_Dispatched}')
      ORDER BY CreatedDate DESC
    `;

    const res = await axios.get(
      `https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodeURIComponent(
        query,
      )}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    console.log(res.data);

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
  // 3) Filter based on tab + search
  // -------------------------------
  useEffect(() => {
    let data = orders.filter((o) => o.RecordType.Id === activeRecordTypeId());

    if (search.trim()) {
      data = data.filter(
        (o) =>
          o.OrderNumber.toLowerCase().includes(search.toLowerCase()) ||
          o.Account?.Name?.toLowerCase().includes(search.toLowerCase()),
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
      Activated: "bg-green-600/30 text-green-300",
      Processing: "bg-blue-600/30 text-blue-300",
      Completed: "bg-green-600/30 text-green-300",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          colors[status] || "bg-gray-700 text-gray-300"
        }`}
      >
        {status}
      </span>
    );
  };

  // -------------------------------
  // COUNTS for tabs
  // -------------------------------
  const countContract = orders.filter(
    (o) => o.RecordType.Id === RT_Contract,
  ).length;
  const countSecondary = orders.filter(
    (o) => o.RecordType.Id === RT_Secondary,
  ).length;
  const countDispatched = orders.filter(
    (o) => o.RecordType.Id === RT_Dispatched,
  ).length;

  const getCount = (type: string) => {
    if (type === "Contract") return countContract;
    if (type === "Secondary") return countSecondary;
    if (type === "Dispatched") return countDispatched;
    return 0;
  };

  return (
    <div className="space-y-8 ml-5 mr-2 mt-5 pb-10 overflow-x-hidden">
      {/* Title */}
      <h1 className="text-3xl font-bold text-cyan-400">Orders</h1>
      <p className="text-gray-400 -mt-2">Manage all your distribution orders</p>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 sm:gap-3 w-full">
        {ORDER_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`
        flex items-center justify-center
        px-4 py-2
        rounded-xl text-xs sm:text-sm font-medium w-auto
        transition-all duration-300 border min-w-[90px]
        ${
          activeTab === t.key
            ? "bg-gradient-to-r from-[#0CD5FB] via-[#359AE8] to-[#6B54D6] text-black border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)]"
            : "bg-[#0d1625] border-cyan-500/10 text-gray-300 hover:border-cyan-400 hover:text-white"
        }
      `}
          >
            {t.img && <t.img size={16} className="mr-1" />}
            <span className="whitespace-nowrap">
              {t.label} ({getCount(t.key)})
            </span>
          </button>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="relative w-full ">
        <Search className="absolute left-4 top-3 text-cyan-400" />
        <input
          className="w-full pl-12 pr-4 py-3 bg-[#0d1625] border border-cyan-500/20 text-cyan-200 rounded-xl"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <Card className="bg-slate-950 border border-cyan-500/20 rounded-2xl shadow-xl overflow-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-cyan-500/10">
              <th className="p-4">Order Number</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Order Date</th>
              <th className="p-4">Total Amount</th>
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
                <td
                  className="p-4 text-cyan-300 cursor-pointer"
                  onClick={() => navigate(`/orders/${o.Id}`)}
                >
                  {o.OrderNumber}
                </td>

                <td className="p-4">{o.Account?.Name}</td>

                <td className="p-4">{o.EffectiveDate}</td>

                <td className="p-4 text-cyan-300 font-semibold">
                  ₹{o.TotalAmount?.toLocaleString() || "0"}
                </td>

                <td className="p-4">
                  <StatusBadge status={o.Status} />
                </td>

                <td className="p-4 text-center">
                  <Eye
                    size={22}
                    className="text-cyan-300 mx-auto cursor-pointer hover:scale-125 transition"
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
