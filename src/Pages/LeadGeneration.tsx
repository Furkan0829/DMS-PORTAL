/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../Components/ui/dialog";

import { Input } from "../Components/ui/input";
import { Button } from "../Components/ui/button";

import { Briefcase, ShoppingBag } from "lucide-react";

const LeadGeneration = () => {

  // ---------------- STATE ----------------

  const [open, setOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<any>({
    FirstName: "",
    LastName: "",
    Company: "",
    Phone: "",
    Email: "",
  });

  // ---------------- SALESFORCE TOKEN ----------------

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

  // ---------------- FETCH LEADS ----------------

  const fetchLeadRecords = async (token: string) => {

    const query = `
      SELECT Id, Name, Company, Phone, Email, Status
      FROM Lead
      ORDER BY CreatedDate DESC
      LIMIT 20
    `;

    const encodedQuery = encodeURIComponent(query);

    const url = `https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodedQuery}`;

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setRecentLeads(res.data.records);
    setLoading(false);
  };

  // ---------------- INIT ----------------

  useEffect(() => {

    const init = async () => {
      const token = await getAccessToken();

      if (token) {
        fetchLeadRecords(token);
      }
    };

    init();

  }, []);

  // ---------------- SUBMIT ----------------

  const handleSubmit = async () => {

    if (!accessToken) {
      console.error("❌ Token not ready");
      return;
    }

    const payload = {
      FirstName: form.FirstName,
      LastName: form.LastName,           // REQUIRED
      Company: form.Company || "NA",     // REQUIRED
      Phone: form.Phone,
      Email: form.Email,
      Status: "Open - Not Contacted",    // REQUIRED
    };

    try {

      await axios.post(
        "https://orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/apexrest/creteLead",
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Lead Created Successfully");

      // Refresh leads
      fetchLeadRecords(accessToken);

      // Reset form
      setForm({
        FirstName: "",
        LastName: "",
        Company: "",
        Phone: "",
        Email: "",
      });

      // Close modal
      setOpen(false);

    } catch (error: any) {
      console.error("❌ Lead Create Error:", error.response?.data || error);
    }
  };

  // ---------------- UI ----------------

  return (

    <div className="min-h-screen bg-[#020817] p-6 text-white">

      {/* HEADER */}
      <div className="mb-6 text-left">
        <h1 className="text-2xl font-semibold text-cyan-400">
          Lead Generation
        </h1>
        <p className="text-sm text-gray-400">
          Create and manage your sales leads
        </p>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">

        <div
          onClick={() => setOpen(true)}
          className="cursor-pointer rounded-xl border border-cyan-500/30 p-6 bg-[#040d1f] hover:border-cyan-400 transition h-[130px]"
        >
          <div className="flex gap-4 items-center">
            <div className="bg-cyan-500/20 p-3 rounded-lg">
              <Briefcase className="text-cyan-400" />
            </div>

            <div>
              <h2 className="font-semibold">Commercial Lead</h2>
              <p className="text-sm text-gray-400">
                B2B clients & partnerships
              </p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setOpen(true)}
          className="cursor-pointer rounded-xl border border-purple-500/30 p-6 bg-[#040d1f] hover:border-purple-400 transition h-[130px]"
        >
          <div className="flex gap-4 items-center">
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <ShoppingBag className="text-purple-400" />
            </div>

            <div>
              <h2 className="font-semibold">Retail Lead</h2>
              <p className="text-sm text-gray-400">
                Individual customers
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* RECENT LEADS */}
      <h3 className="mb-3 font-semibold">Recent Leads</h3>

      <div className="space-y-3">

        {!loading && recentLeads.map((l) => (

          <div
            key={l.Id}
            className="bg-[#040d1f] p-4 rounded-xl border border-cyan-500/20"
          >
            <p className="font-medium">{l.Name}</p>
            <p className="text-sm text-gray-400">{l.Company}</p>
            <p className="text-xs text-gray-500">{l.Phone}</p>
          </div>

        ))}

      </div>

      {/* FORM MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>

        <DialogContent className="bg-[#020817] text-white">

          <DialogHeader>
            <DialogTitle>Create Lead</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3">

            <Input
              placeholder="First Name"
              value={form.FirstName}
              onChange={(e) =>
                setForm({ ...form, FirstName: e.target.value })
              }
            />

            <Input
              placeholder="Last Name"
              value={form.LastName}
              onChange={(e) =>
                setForm({ ...form, LastName: e.target.value })
              }
            />

            <Input
              placeholder="Company"
              value={form.Company}
              onChange={(e) =>
                setForm({ ...form, Company: e.target.value })
              }
            />

            <Input
              placeholder="Phone"
              value={form.Phone}
              onChange={(e) =>
                setForm({ ...form, Phone: e.target.value })
              }
            />

            <Input
              placeholder="Email"
              value={form.Email}
              onChange={(e) =>
                setForm({ ...form, Email: e.target.value })
              }
            />

            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              Create Lead
            </Button>

          </div>

        </DialogContent>

      </Dialog>

    </div>
  );
};

export default LeadGeneration;
