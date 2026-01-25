/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";

import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "../Components/ui/input";
import { Button } from "../Components/ui/button";
import { ScrollArea } from "../Components/ui/scroll-area";

import { ShieldCheck, CheckCircle, Send } from "lucide-react";

interface WarrantyRecord {
  Id: string;
  Name: string;
  Customer__c: string;
  Phone__c: string;
  Email__c: string;
  Product_Name__c: string;
  Serial_Number__c: number;
  Purchase_Date__c: string;
}

const WarrantyRegistration = () => {
  const [records, setRecords] = useState<WarrantyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");

  const [form, setForm] = useState({
    customer: "",
    phone: "",
    email: "",
    product: "",
    serial: "",
    purchaseDate: "",
  });

  /* ---------------- SALESFORCE AUTH ---------------- */

  const getAccessToken = async () => {
    const salesforceUrl =
      "https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/oauth2/token";

    const clientId =
      "3MVG9HtWXcDGV.nEjGlOSARSUWdhaRh3M.MZMxCFek1KeKIjSU61s7elcUSSScL4Jfk.rh.ji7og4gPabrfSA";

    const clientSecret =
      "3E5E44662F5C43535B785D740B237868AA86DFC6AC4709037876F6223B419354";

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials"); // ✅ FIXED
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

  /* ---------------- FETCH WARRANTY DATA ---------------- */

  const fetchWarrantyRecords = async (token: string) => {
    const query = `
      SELECT 
        Id,
        Name,
        Customer__c,
        Phone__c,
        Email__c,
        Product_Name__c,
        Serial_Number__c,
        Purchase_Date__c
      FROM Warranty_Registration__c
      ORDER BY CreatedDate DESC
      LIMIT 20
    `;

    const encodedQuery = encodeURIComponent(query);

    const url = `https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodedQuery}`;

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setRecords(res.data.records);
    setLoading(false);
  };

  /* ---------------- CREATE WARRANTY ---------------- */

  const handleSubmit = async () => {
    if (!accessToken) return;

    const payload = {
      Customer__c: form.customer,
      Phone__c: form.phone,
      Email__c: form.email,
      Product_Name__c: form.product,
      Serial_Number__c: form.serial ? parseInt(form.serial) : null,
      Purchase_Date__c: form.purchaseDate || null,
    };

    try {
      await axios.post(
        "https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/data/v62.0/sobjects/Warranty_Registration__c/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh records
      fetchWarrantyRecords(accessToken);

      // Reset form
      setForm({
        customer: "",
        phone: "",
        email: "",
        product: "",
        serial: "",
        purchaseDate: "",
      });

    } catch (error: any) {
      console.error("❌ Create Error:", error.response?.data || error);
    }
  };

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    const init = async () => {
      const token = await getAccessToken();
      if (token) fetchWarrantyRecords(token);
    };

    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Warranty Data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white px-6 py-6">

      {/* HEADER */}
      <div className="flex flex-col items-start gap-3 mb-6 ">
        <h1 className="text-3xl font-semibold text-cyan-400">
          Warranty Registration
        </h1>
        <p className="text-sm text-slate-400">
          Register and track product warranties
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ---------------- LEFT FORM ---------------- */}
<Card className="bg-[#020817] border border-cyan-500/20 shadow-[0_0_30px_#00ffff22] rounded-2xl">

  <CardContent className="p-8">

    {/* Header */}
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/30 to-violet-600/30">
        <ShieldCheck className="text-cyan-400" size={22} />
      </div>

      <div className="text-left">
        <h2 className="text-lg font-semibold">New Registration</h2>
        <p className="text-sm text-slate-400">
          Fill in the warranty details
        </p>
      </div>
    </div>

    {/* FORM */}
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >

      {/* Customer Name */}
      <div className="flex flex-col items-start gap-1 w-full">
        <label className="text-sm text-slate-300 text-left">
          Customer Name <span className="text-red-400">*</span>
        </label>

        <Input
          required
          placeholder="Enter customer name"
          value={form.customer}
          onChange={(e) =>
            setForm({ ...form, customer: e.target.value })
          }
          className="h-12 w-full bg-[#071521] border border-cyan-500/20 focus:border-cyan-400"
        />
      </div>

      {/* Phone + Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="flex flex-col items-start gap-1 w-full">
          <label className="text-sm text-slate-300 text-left">
            Phone
          </label>

          <Input
            placeholder="+91 XXXXXXXXXX"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            className="h-12 w-full bg-[#071521] border border-cyan-500/20 focus:border-cyan-400"
          />
        </div>

        <div className="flex flex-col items-start gap-1 w-full">
          <label className="text-sm text-slate-300 text-left">
            Email
          </label>

          <Input
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="h-12 w-full bg-[#071521] border border-cyan-500/20 focus:border-cyan-400"
          />
        </div>

      </div>

      {/* Product Name */}
      <div className="flex flex-col items-start gap-1 w-full">
        <label className="text-sm text-slate-300 text-left">
          Product Name
        </label>

        <Input
          placeholder="Enter product name"
          value={form.product}
          onChange={(e) =>
            setForm({ ...form, product: e.target.value })
          }
          className="h-12 w-full bg-[#071521] border border-cyan-500/20 focus:border-cyan-400"
        />
      </div>

      {/* Serial + Purchase Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="flex flex-col items-start gap-1 w-full">
          <label className="text-sm text-slate-300 text-left">
            Serial Number
          </label>

          <Input
            placeholder="XX-XXXX-XXXXX"
            value={form.serial}
            onChange={(e) =>
              setForm({ ...form, serial: e.target.value })
            }
            className="h-12 w-full bg-[#071521] border border-cyan-500/20 focus:border-cyan-400"
          />
        </div>

        <div className="flex flex-col items-start gap-1 w-full">
          <label className="text-sm text-slate-300 text-left">
            Purchase Date
          </label>

          <Input
            type="date"
            value={form.purchaseDate}
            onChange={(e) =>
              setForm({ ...form, purchaseDate: e.target.value })
            }
            className="h-12 w-full  bg-[#071521] border border-cyan-500/20 focus:border-cyan-400"
          />
        </div>

      </div>

      {/* Button */}
      <Button
        type="submit"
        className="w-full h-12 mt-4 bg-gradient-to-r from-cyan-400 to-violet-600 shadow-[0_0_20px_#00ffff66] hover:opacity-90 transition"
      >
        <Send className="mr-2" size={16} />
        Register Warranty
      </Button>

    </form>

  </CardContent>

</Card>




        {/* ---------------- RIGHT LIST ---------------- */}

        <Card className="bg-[#020817] border border-cyan-500/20 shadow-[0_0_25px_#00ffff22]">

          <CardContent className="p-4">

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="text-green-400" />
              </div>

              <div>
                <h2 className="font-semibold">Recent Registrations</h2>
                <p className="text-xs text-slate-400">
                  Latest warranty records
                </p>
              </div>
            </div>

            {/* Scroll Area */}
            <ScrollArea className="h-[520px] pr-3 scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-transparent">

              <div className="space-y-4">

                {records.map((item) => (
                  <div
                    key={item.Id}
                    className="p-4 rounded-xl border border-cyan-500/10 bg-[#071521] hover:border-cyan-400 transition"
                  >

                    <div className="flex justify-between items-start gap-4">

                      <div className="space-y-1">
                        <p className="font-medium">
                          {item.Customer__c}
                        </p>

                        <p className="text-cyan-400 text-sm">
                          {item.Product_Name__c}
                        </p>

                        <p className="text-xs text-slate-400">
                          Serial: {item.Serial_Number__c}
                        </p>
                      </div>

                      <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 h-fit">
                        Active
                      </span>

                    </div>

                    <p className="text-xs text-slate-400 mt-2">
                      Purchased: {item.Purchase_Date__c}
                    </p>

                  </div>
                ))}

              </div>

            </ScrollArea>

          </CardContent>
        </Card>

      </div>

    </div>
  );
};

export default WarrantyRegistration;
