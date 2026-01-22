import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CiShoppingCart } from "react-icons/ci";
import { LuPackage } from "react-icons/lu";
import { GoPeople } from "react-icons/go";
import { TbActivityHeartbeat } from "react-icons/tb";
import { FaArrowTrendUp } from "react-icons/fa6";
import { LuClock4 } from "react-icons/lu";

const Dashboard = () => {
  const salesData = [
  { month: "Jan", value: 4000 },
  { month: "Feb", value: 3000 },
  { month: "Mar", value: 5000 },
  { month: "Apr", value: 4500 },
  { month: "May", value: 6000 },
  { month: "Jun", value: 5500 },
  { month: "Jul", value: 7000 },
];
const categoryData = [
  { name: "Electronics", value: 35, color: "#22d3ee" },
  { name: "Appliances", value: 30, color: "#8b5cf6" },
  { name: "Kitchen", value: 20, color: "#22c55e" },
  { name: "Others", value: 15, color: "#f59e0b" },
];
  return (
    <div className=" bg-[#020817] p-4 sm:p-6 lg:p-8 overflow-x-hidden">


      {/* Header */}
      <div className="text-start">
        <h1 className="text-3xl text-cyan-500 mt-5 font-medium">
          Dashboard
        </h1>
        <p className="text-gray-400 mt-1">
          Welcome back! Here's your business overview
        </p>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sd:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">

        {/* Card 1 */}
        <div className="h-[130px] p-4 sm:p-6 rounded-2xl flex flex-col justify-between
          bg-gradient-to-br from-[#020617] to-[#161B24]
          shadow-[0_0_0_1px_rgba(14,165,233,0.35),_0_0_30px_rgba(14,165,233,0.35)] 
        ">
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-400">Total Revenue</p>
            <div className="w-11 h-11 rounded-xl bg-cyan-500/20 flex items-center justify-center text-white text-xl bg-gradient-to-br from-[#22D3EE] to-[#06B6D4]">
              $
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white -mt-2 -ml-22">
            ₹24,56,890
          </h2>

          <div className="flex items-center gap-2 text-sm mt-1">
            <span className="text-green-400">↑ 12.5%</span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="h-[130px] p-4 sm:p-6 rounded-2xl flex flex-col justify-between
          bg-gradient-to-br from-[#020617] to-[#161B24]
          shadow-[0_0_0_1px_rgba(14,165,233,0.35),_0_0_30px_rgba(14,165,233,0.35)]
        ">
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-400">Total Orders</p>
            <div className="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center text-white text-lg bg-gradient-to-br from-[#A855F7] to-[#EC4899]">
              <CiShoppingCart className="w-5 h-5 font-semibold" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white -mt-2 -ml-42">
            1,247
          </h2>

          <div className="flex items-center gap-2 text-sm mt-1">
            <span className="text-green-400">↑ 8.2%</span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="h-[130px] p-4 sm:p-6 rounded-2xl flex flex-col justify-between
          bg-gradient-to-br from-[#020617] to-[#161B24]
          shadow-[0_0_0_1px_rgba(14,165,233,0.35),_0_0_30px_rgba(14,165,233,0.35)] 
          bg-gradient-to-br from-[#22C55E] to-[#16A34A]

        ">
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-400">Products Sold</p>
            <div className="w-11 h-11 rounded-xl bg-[#22c55e] flex items-center justify-center text-white text-lg">
            <LuPackage className="w-6 h-6"/>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white -ml-41 -mt-4">
            3,842
          </h2>

          <div className="flex items-center gap-2 text-sm mt-1">
            <span className="text-green-400">↑ 15.3%</span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="h-[130px] p-4 sm:p-6 rounded-2xl flex flex-col justify-between
          bg-gradient-to-br from-[#020617] to-[#161B24]
          shadow-[0_0_0_1px_rgba(14,165,233,0.35),_0_0_30px_rgba(14,165,233,0.35)]
        ">
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-400">Active Leads</p>
            <div className="w-11 h-11 rounded-xl bg-orange-500/20 flex items-center justify-center text-white text-lg bg-gradient-to-br from-[#FB923C] to-[#F97316]">
            <GoPeople />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white -ml-48 -mt-4">
            428
          </h2>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-red-400">↓ 2.4%</span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>
      </div>

    {/* ================= LOWER SECTION ================= */}
<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

  {/* ===== LEFT : SALES OVERVIEW (2 columns) ===== */}
  <div
    className="
      col-span-2
      h-[370px]
      sm:h-[370px]
      p-4
      rounded-2xl
      bg-gradient-to-br from-[#020617] to-[#161B24]
      shadow-[0_0_0_1px_rgba(14,165,233,0.35),_0_0_40px_rgba(14,165,233,0.25)]
    "
  >
    {/* Header */}
    <div className="flex justify-between items-start mb-4">
      <div>
        <h2 className="text-xl font-semibold text-white text-start">
          Sales Overview
        </h2>
        <p className="text-sm text-gray-400">
          Monthly sales performance
        </p>
      </div>

      <div className="px-4 py-2 rounded-lg border border-cyan-400/30 text-cyan-400 text-sm bg-[#022137]">
        📊 This Year
      </div>
    </div>

    {/* Line Chart */}
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="80%" >
        <AreaChart data={salesData}>
          <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />

          <XAxis
            dataKey="month"
            stroke="#9ca3af"
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="#9ca3af"
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            cursor={{ stroke: "#22d3ee", strokeWidth: 1 }}
            contentStyle={{
              backgroundColor: "#020817",
              border: "1px solid #22d3ee",
              borderRadius: "10px",
              padding: "10px",
            }}
            labelStyle={{ color: "#9ca3af" }}
            formatter={(value) => [value, "Sales"]}
          />

          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="value"
            stroke="#22d3ee"
            strokeWidth={3}
            fill="url(#salesGradient)"
            dot={false}
            activeDot={{
              r: 6,
              stroke: "#22d3ee",
              strokeWidth: 2,
              fill: "#020817",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* ===== RIGHT : SALES BY CATEGORY (1 column) ===== */}
  <div
    className="
      col-span-1
      h-[380px]
      p-6
      rounded-2xl
      bg-gradient-to-br from-[#020617] to-[#161B24]
      shadow-[0_0_0_1px_rgba(14,165,233,0.35),_0_0_40px_rgba(14,165,233,0.25)]
    "
  >
    <h2 className="text-xl font-semibold text-white text-start ">
      Sales by Category
    </h2>
    <p className="text-sm text-gray-400 mb-4 text-start">
      Distribution overview
    </p>

    {/* Pie Chart */}
    <div className="h-[180px] sm:h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
      content={({ active, payload }) => {
        if (active && payload && payload.length) {
          return (
            <div className="
              bg-[#020817]
              border border-cyan-400/40
              rounded-xl
              px-4 py-2
              w-38 h-13
              shadow-[0_0_20px_rgba(34,211,238,0.25)] text-center align-middle
            ">
              <p className="text-gray-300 text-sm mt-2">
                {payload[0].name} :{" "}
                <span className="text-white font-semibold">
                  {payload[0].value}
                </span>
              </p>
            </div>
          );
        }
        return null;
      }}
    />
          <Pie
            data={categoryData}
            dataKey="value"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            stroke="#020817"
            strokeWidth={2}
          >
            {categoryData.map((item, index) => (
              <Cell key={index} fill={item.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Legend */}
    <div className="grid grid-cols-2 gap-y-4 mt-6 text-sm">
      <div className="flex items-center gap-3">
        <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
        <span className="text-gray-400">Electronics</span>
        <span className="ml-auto text-white font-semibold mr-3">35%</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-3 h-3 rounded-full bg-purple-500"></span>
        <span className="text-gray-400">Appliances</span>
        <span className="ml-auto text-white font-semibold">30%</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-3 h-3 rounded-full bg-green-400"></span>
        <span className="text-gray-400">Kitchen</span>
        <span className="ml-auto text-white font-semibold mr-3">20%</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-3 h-3 rounded-full bg-orange-400"></span>
        <span className="text-gray-400">Others</span>
        <span className="ml-auto text-white font-semibold">15%</span>
      </div>
    </div>
  </div>

</div>

{/*  */}
{/* ================= RECENT ACTIVITY ================= */}
<div
  className="
    mt-8
   p-4 sm:p-6 
    rounded-2xl
    bg-gradient-to-br from-[#020617] to-[#0b1220]
    shadow-[0_0_0_1px_rgba(34,211,238,0.25),_0_0_40px_rgba(34,211,238,0.15)]">
  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <div>
      <h2 className="text-xl font-semibold text-white text-start">
        Recent Activity
      </h2>
      <p className="text-sm text-gray-400 text-start mt-2">
        Latest updates from your portal
      </p>
    </div>

    <span className="text-cyan-400 text-xl text-cyan-500"><TbActivityHeartbeat className="w-6 h-9" /></span>
  </div>

  {/* Activity List */}
  <div className="space-y-4">

    {/* Item 1 */}
    <div className="
      flex items-center justify-between
      p-4
      rounded-xl
      bg-gradient-to-r from-[#020617] to-[#0f172a]
      hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]
    ">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
          <CiShoppingCart className="w-6 h-6"/>
        </div>
        <div>
          <p className="text-white font-medium text-start">
            New order received
          </p>
          <p className="text-sm text-gray-400 text-start">
            Order #ORD-1248-₹45,999
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-400 flex items-center gap-1">
        <LuClock4 className="w-4 h-4" /> 2 min ago
      </p>
    </div>

    {/* Item 2 */}
    <div className="
      flex items-center justify-between
      p-4
      rounded-xl
      bg-gradient-to-r from-[#020617] to-[#0f172a]
      hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]
    ">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-cyan-500/20 flex items-center justify-center text-green-400">
           <LuPackage className="w-6 h-6"/>
        </div>

        <div>
          <p className="text-white font-medium text-start">
            Stock updated
          </p>
          <p className="text-sm text-gray-400 text-start">
            Smart TV 55&quot;-Added 50 units
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-400 flex items-center gap-1">
        <LuClock4 className="w-4 h-4" /> 15 min ago
      </p>
    </div>

    {/* Item 3 */}
    <div className="
      flex items-center justify-between
      p-4
      rounded-xl
      bg-gradient-to-r from-[#020617] to-[#0f172a]
      hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]
    ">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-cyan-500/20 flex items-center justify-center text-purple-400">
          <GoPeople className="w-6 h-6"/>
        </div>

        <div>
          <p className="text-white font-medium text-start">
            New lead generated
          </p>
          <p className="text-sm text-gray-400 text-start">
            Commercial-ABC Electronics
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-400 flex items-center gap-1">
        <LuClock4 className="w-4 h-4" />32 min ago
      </p>
    </div>

    {/* Item 4 */}
    <div className="
      flex items-center justify-between
      p-4
      rounded-xl
      bg-gradient-to-r from-[#020617] to-[#0f172a]
      hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]
    ">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-cyan-500/20 flex items-center justify-center text-orange-400">
          <FaArrowTrendUp className="w-6 h-6"/>
        </div>

        <div>
          <p className="text-white font-medium text-start">
            Order dispatched
          </p>
          <p className="text-sm text-gray-400 text-start">
            Order #ORD-1245 to XYZ Mart
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-400 flex items-center gap-1">
        <LuClock4 className="w-4 h-4" /> 1 hour ago
      </p>
    </div>

    {/* Item 5 */}
    <div className="
      flex items-center justify-between
      p-4
      rounded-xl
      bg-gradient-to-r from-[#020617] to-[#0f172a]
      hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]
    ">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
          <TbActivityHeartbeat className="w-6 h-6"/>
        </div>

        <div>
          <p className="text-white font-medium text-start">
            Warranty registered
          </p>
          <p className="text-sm text-gray-400 text-start">
            Split AC-Customer:John Doe
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-400 flex items-center gap-1">
        <LuClock4 className="w-4 h-4" /> 2 hours ago
      </p>
    </div>

  </div>
</div>

      </div>   
  );
};

export default Dashboard;
