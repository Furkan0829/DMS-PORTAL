/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "../Components/ui/button";
import { Badge } from "../Components/ui/badge";
import { Card, CardContent } from "../Components/ui/card";
import { LuPackage } from "react-icons/lu";
import { FiDollarSign } from "react-icons/fi";
import { MdTrendingUp } from "react-icons/md";
import { FaStar } from "react-icons/fa";

import { FiEdit2, FiCamera } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import { useEffect, useState } from "react";


const Profile = () => {

   const [accessToken, setAccessToken] = useState<string | null>(null);
   const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

const getAccessToken = async () => {
  const salesforceUrl="orgfarm-55be5b4cd7-dev-ed.develop.my.salesforce.com/services/oauth2/token";
  const clientId ="3MVG9HtWXcDGV.nEjGlOSARSUWdhaRh3M.MZMxCFek1KeKIjSU61s7elcUSSScL4Jfk.rh.ji7og4gPabrfSA";
  const clientSecret ="3E5E44662F5C43535B785D740B237868AA86DFC6AC4709037876F6223B419354";
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
 
  try {
    const response = await axios.post(salesforceUrl, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    setAccessToken(response.data.access_token);
    console.log("✅ Access Token:", response.data.access_token);

    return response.data.access_token;
  } catch (err: unknown) {
    const errorMessage = axios.isAxiosError(err)
      ? err.response?.data?.error_description || err.message
      : "Unknown error occurred";

    console.error("❌ Error fetching access token:", errorMessage);
    setError("Failed to fetch access token.");
    return null;
  }
};

 useEffect(() => {
    const initializeData = async () => {
      const token = await getAccessToken();
      if (token) {
        //await fetchOrders(token);
      }
    };

    initializeData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#020817] px-4 sm:px-6 lg:px-8 py-4 sm:py-6">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-cyan-400 text-start">Profile</h1>
          <p className="text-gray-400 mt-1">
            Manage your account information
          </p>
        </div>

        <Button
          className="
            mt-4 sm:mt-6 h-10
            flex items-center gap-2
            bg-gradient-to-r from-cyan-400 to-purple-500
            text-black
            shadow-[0_0_25px_rgba(34,211,238,0.45)]
          "
        >
          <FiEdit2 />
          Edit Profile
        </Button>
      </div>

      {/* ================= PROFILE CARD ================= */}
    
<div className="mt-6">
  {/* OUTER GLOW BORDER */}
  <div
    className="
      rounded-2xl
      p-[1.5px]
      bg-gradient-to-r from-cyan-400/40 via-purple-500/40 to-cyan-400/40
      shadow-[0_0_60px_rgba(34,211,238,0.35)]
    "
  >
    {/* INNER CARD */}
    <div className="rounded-2xl overflow-hidden bg-[#020817]">

      {/* TOP GRADIENT STRIP */}
      <div className="h-32 bg-gradient-to-r from-[#0b4a5f] via-[#3b2c6f] to-[#0b4a5f]" />

      {/* CONTENT SECTION */}
      <div className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 py-1 -mt-14">

        {/* Avatar */}
        <div className="relative ">
          <div
            className="
              w-24 h-24 sm:w-32 sm:h-32
              rounded-2xl
              border-4 border-cyan-400
              bg-[#020817]
              flex items-center justify-center
              text-cyan-400
              shadow-[0_0_25px_rgba(34,211,238,0.45)]
            "
          >
            <FaUser size={42} />
          </div>

          <div
            className="
              absolute bottom-2 right-2
              w-8 h-8
              rounded-full
              bg-cyan-400
              flex items-center justify-center
              text-black
            "
          >
            <FiCamera size={16} />
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
  <h2 className="text-2xl font-semibold text-cyan-200 text-start">
    John Distributor
  </h2>

  <Badge
    className="
      bg-cyan-400/20 text-cyan-300
      text-xs sm:text-sm
      px-2 py-0.5 sm:px-3 sm:py-1
      whitespace-nowrap
    "
  >
    🏆 Platinum
  </Badge>
</div>


          <p className="text-gray-400 mt-1 text-start">Distributor</p>
          <p className="text-cyan-400 font-medium mt-1 text-start">
            DIS-MH-0042
          </p>
        </div>

      </div>
    </div>
  </div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mt-8">


  {/* Total Orders */}
  <Card className="
    h-[96px] sm:h-[96px]
    rounded-2xl
    bg-gradient-to-br from-[#020617] to-[#0f172a]
     border border-cyan-400/20
    shadow-[0_0_28px_rgba(34,211,238,0.25)]

  ">
    <CardContent className="h-full px-4 sm:px-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-cyan-400 flex items-center justify-center text-white">
        <LuPackage size={22} />
      </div>
      <div>
        <p className="text-2xl sm:text-2xl font-semibold text-white leading-none text-start">
          1,247
        </p>
        <p className="text-sm text-gray-400 mt-1 text-start">
          Total Orders
        </p>
      </div>
    </CardContent>
  </Card>

  {/* Revenue */}
  <Card className="
    h-[96px] sm:h-[96px]
    rounded-2xl
    bg-gradient-to-br from-[#020617] to-[#0f172a]
    border border-cyan-400/20
    shadow-[0_0_28px_rgba(34,211,238,0.25)]
  ">
    <CardContent className="h-full px-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-green-400 flex items-center justify-center text-white">
        <FiDollarSign  size={22}/>
      </div>
      <div>
        <p className="text-2xl sm:text-2xl font-semibold text-white leading-none text-start">
          ₹2.4 Cr
        </p>
        <p className="text-sm text-gray-400 mt-1 text-start">
          Revenue Generated
        </p>
      </div>
    </CardContent>
  </Card>

  {/* Growth */}
  <Card className="
   h-[96px] sm:h-[96px]
    rounded-2xl
    bg-gradient-to-br from-[#020617] to-[#0f172a]
    border border-cyan-400/20
    shadow-[0_0_28px_rgba(34,211,238,0.25)]
  ">
    <CardContent className="h-full px-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center text-white">
        <MdTrendingUp size={22} />
      </div>
      <div>
        <p className="text-2xl sm:text-2xl font-semibold text-white leading-none text-start">
          +18.5%
        </p>
        <p className="text-sm text-gray-400 mt-1 text-start">
          Growth Rate
        </p>
      </div>
    </CardContent>
  </Card>

  {/* Rating */}
  <Card className="
    h-[96px] sm:h-[96px]
    rounded-2xl
    bg-gradient-to-br from-[#020617] to-[#0f172a]
    border border-cyan-400/20
    shadow-[0_0_28px_rgba(34,211,238,0.25)]
  ">
    <CardContent className="h-full px-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center text-white">
        <FaStar size={22} />
      </div>
      <div>
        <p className="text-2xl sm:text-2xl font-semibold text-white leading-none text-start">
          4.8/5
        </p>
        <p className="text-sm text-gray-400 mt-1 text-start">
          Customer Rating
        </p>
      </div>
    </CardContent>
  </Card>

</div>


    </div>
  );
};

export default Profile;
