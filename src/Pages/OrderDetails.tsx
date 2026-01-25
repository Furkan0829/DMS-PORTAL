import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Mail, Phone, MapPin, FileText } from "lucide-react";

const DISPATCH_RT_ID = "012fj000003uHpFAAU";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // -------------------------------
  // Salesforce Access Token
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

    const res = await axios.post(
      "https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/oauth2/token",
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );

    setToken(res.data.access_token);
    return res.data.access_token;
  };

  // -------------------------------
  // Fetch Order Details
  // -------------------------------
  const fetchOrder = async (accessToken: string) => {
    const query = `
      SELECT 
        Id, OrderNumber, Status, Type, EffectiveDate, TotalAmount,
        Account.Name,
        ShippingStreet, ShippingCity, ShippingPostalCode, 
        ShippingState, ShippingCountry,
        (SELECT Id, Product2.Name, Product2.ProductCode, Quantity, UnitPrice
         FROM OrderItems)
      FROM Order
      WHERE Id = '${orderId}'
    `;

    const res = await axios.get(
      `https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodeURIComponent(
        query,
      )}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    setOrder(res.data.records[0]);
    setLoading(false);
  };

  // INIT
  useEffect(() => {
    const init = async () => {
      const tk = await getAccessToken();
      if (tk) fetchOrder(tk);
    };
    init();
  }, [orderId]);

  // -------------------------------
  // Dispatch Order (Apex REST)
  // -------------------------------
  const dispatchOrder = async () => {
    try {
      const res = await axios.patch(
        `https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/apexrest/DMS_DispatchOrder/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        toast.success("Order dispatched successfully!");
        fetchOrder(token!);
      } else {
        toast.error(res.data.message);
        console.log(res.data.message);
        
      }
    } catch (err) {
      console.error(err);
      toast.error("Dispatch failed.");
    }
  };

  if (loading) return <p className="text-cyan-300 mt-10">Loading...</p>;

  const isContract = order.Type === "Contract";
  const isSecondary = order.Type === "Secondary";
  const isDispatched = order.Type === "Dispatched";

  const orderType = isContract
    ? "Contract"
    : isSecondary
      ? "Secondary"
      : "Dispatched";

  // -------------------------------
  // TOTALS
  // -------------------------------
  const subtotal = order.OrderItems.records.reduce(
    (sum: number, item: any) => sum + item.UnitPrice * item.Quantity,
    0,
  );
  const tax = Math.round(subtotal * 0.18);
  const shipping = 0;
  const grandTotal = subtotal + tax + shipping;

  // Shipping address formatting
  const shippingAddress = `
    ${order.ShippingStreet || ""}, 
    ${order.ShippingCity || ""}, 
    ${order.ShippingState || ""} 
    ${order.ShippingPostalCode || ""}
  `;

  return (
    <div className=" ml-5 mr-2 min-h-screen bg-[#020817] px-2 py-4 sm:py-6 space-y-6">
      {/* HEADER */}
      <div
        className="
                    w-full 
                    flex flex-col md:flex-row 
                    items-start md:items-center 
                    justify-between 
                    gap-4
                "
      >
        <div className="flex flex-col items-start text-left gap-2">
          {/* BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="
                        flex items-center gap-2 
                        px-4 py-2 
                        bg-[#0d1625] border border-cyan-500/20 
                        rounded-xl text-cyan-300 
                        hover:text-white hover:border-cyan-400 
                        transition
                    "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.7}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          {/* ORDER HEADING */}
          <div className="flex flex-col items-start md:items-start text-left">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-cyan-400">
                {order.OrderNumber}
              </h1>

              {/* STATUS BADGE */}
              <span
                className={`
            px-4 py-1 rounded-full text-sm font-semibold shadow-sm
            ${
              orderType === "Contract"
                ? "bg-yellow-700/30 text-yellow-300"
                : orderType === "Secondary"
                  ? "bg-blue-700/30 text-blue-300"
                  : "bg-purple-700/30 text-purple-300"
            }
          `}
              >
                {orderType}
              </span>
            </div>

            <p className="text-gray-400 mt-1">
              Order placed on {order.EffectiveDate}
            </p>
          </div>
        </div>

        {/* DISPATCH BUTTON */}
        {isContract && (
          <button
            onClick={dispatchOrder}
            className="
                    px-6 py-3 
                    bg-gradient-to-r from-cyan-500 to-purple-600
                    text-white rounded-xl 
                    shadow hover:scale-105 transition
                    shadow-[0_0_25px_rgba(34,211,238,0.45)]
                    "
          >
            Dispatch Order
          </button>
        )}
      </div>

      {/* DISPATCHED BANNER */}
      {isDispatched && (
        <div className="bg-green-800/30 border border-green-500/40 text-green-400 p-4 rounded-xl flex items-center gap-3">
          <CheckCircle /> This order has been dispatched
        </div>
      )}

      {/* MAIN CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* CUSTOMER DETAILS */}
        <Card className="bg-slate-950 border border-cyan-500/20 rounded-2xl shadow-md shadow-[0_0_25px_rgba(34,211,238,0.45)]">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <FileText className="h-5 w-5 text-cyan-400" />
            <CardTitle className="text-white text-xl">
              Customer Details
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-gray-300">
            <div>
              <p className="text-gray-400 text-sm">Company Name</p>
              <p className="text-white text-lg font-medium">
                {order.Account?.Name}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-cyan-300" />
              <span>{order.Email__c || "contact@company.com"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-cyan-300" />
              <span>{order.Phone__c || "+91 98765 43210"}</span>
            </div>
          </CardContent>
        </Card>

        {/* SHIPPING ADDRESS */}
        <Card className="bg-slate-950 border border-cyan-500/20 rounded-2xl  shadow-[0_0_25px_rgba(34,211,238,0.45)]">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <MapPin className="h-5 w-5 text-cyan-400" />
            <CardTitle className="text-white text-xl">
              Shipping Address
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {shippingAddress}
            </p>
          </CardContent>
        </Card>

        {/* ORDER INFO */}
        <Card className="bg-slate-950 border border-cyan-500/20 rounded-2xl shadow-[0_0_25px_rgba(34,211,238,0.45)]">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <FileText className="h-5 w-5 text-cyan-400" />
            <CardTitle className="text-white text-xl">Order Info</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-gray-300">
            {/* ORDER TYPE */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Order Type</span>
              <span
                className="
          px-3 py-1 rounded-full text-sm font-semibold
          bg-cyan-500/10 text-cyan-300
        "
              >
                {orderType}
              </span>
            </div>

            {/* PAYMENT METHOD */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Payment Method</span>
              <span className="text-white">
                {order.Payment_Method__c || "Net 30 Terms"}
              </span>
            </div>

            {/* ORDER DATE */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Order Date</span>
              <span className="text-white">{order.EffectiveDate}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ITEMS */}
      <Card className="bg-slate-950 border border-cyan-500/20 rounded-2xl overflow-hidden">
        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left border-collapse">
            <thead>
              <tr className="text-gray-300 border-b border-cyan-500/10 bg-[#0b1523]">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">Qty</th>
                <th className="p-4 font-medium">Unit Price</th>
                <th className="p-4 font-medium">Total</th>
              </tr>
            </thead>

            <tbody>
              {order.OrderItems.records.map((i: any) => (
                <tr
                  key={i.Id}
                  className="text-gray-300 border-b border-cyan-500/10 hover:bg-[#0e1b2c]/40 transition"
                >
                  <td className="p-4">{i.Product2.Name}</td>
                  <td className="p-4">{i.Product2.ProductCode}</td>
                  <td className="p-4">{i.Quantity}</td>
                  <td className="p-4">₹{i.UnitPrice.toLocaleString()}</td>
                  <td className="p-4">
                    ₹{(i.UnitPrice * i.Quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTALS BLOCK */}
        <div className="p-6 bg-slate-950">
          <div className="flex justify-between text-gray-300 mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-gray-300 mb-2">
            <span>Tax (18% GST)</span>
            <span>₹{tax.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-gray-300 mb-2">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
          </div>

          <div className="border-b border-cyan-500/10 my-4"></div>

          <div className="flex justify-between text-gray-300 text-xl font-bold">
            <span>Total</span>
            <span className="text-cyan-300">
              ₹{grandTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderDetails;
