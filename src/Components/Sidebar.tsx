import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardList,
  Warehouse,
  FileText,
  Users,
  Boxes,
  ShieldCheck,
  Tag,
  Receipt,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
 
const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Products", path: "/products", icon: Package },
  { name: "Cart", path: "/cart", icon: ShoppingCart },
  { name: "Orders", path: "/orders", icon: ClipboardList },
  { name: "Inventory", path: "/inventory", icon: Warehouse },
  { name: "GRN", path: "/grn", icon: FileText },
  { name: "Lead Generation", path: "/leads", icon: Users },
  { name: "Stock Management", path: "/stock", icon: Boxes },
  { name: "Warranty Registration", path: "/warranty", icon: ShieldCheck },
  { name: "Price List", path: "/price-list", icon: List },
  { name: "Invoice", path: "/invoice", icon: Receipt },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Settings", path: "/settings", icon: Settings },
];
 
const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
 
  return (
    <>
      {/* ===== MOBILE TOP BAR ===== */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#050b16] border-b border-[#0b1f33]">
        <div className="text-white font-semibold">DMS Portal</div>
        <button onClick={() => setMobileOpen(true)}>
          <Menu className="text-cyan-400" />
        </button>
      </div>
 
      {/* ===== MOBILE OVERLAY ===== */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}
 
      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          fixed lg:static z-50
          top-0 left-0 h-screen
          ${collapsed ? "w-[80px]" : "w-[280px]"}
          bg-gradient-to-b from-[#050b16] via-[#060f1f] to-[#040914]
          border-r border-[#0b1f33]
          transition-all duration-300
          flex flex-col
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* ===== HEADER ===== */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#0b1f33]">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#00c2ff] to-[#005cff] flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">▣</span>
          </div>
 
          {!collapsed && (
            <div>
              <h1 className="text-white font-semibold text-lg">DMS Portal</h1>
              <p className="text-xs text-gray-400">Distributor Management</p>
            </div>
          )}
 
          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto lg:hidden"
          >
            <X className="text-gray-400" />
          </button>
        </div>
 
        {/* ===== NAV ===== */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `
                      group flex items-center
                      ${collapsed ? "justify-center" : "gap-3 px-4"}
                      py-3 rounded-xl transition-all duration-200
                      ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-500/30 to-cyan-500/10 text-white"
                          : "text-gray-400 hover:bg-white/5"
                      }
                    `
                    }
                  >
                    <Icon
                      size={20}
                      className="group-hover:text-cyan-400 transition-colors"
                    />
                    {!collapsed && (
                      <span className="group-hover:text-white transition-colors">
                        {item.name}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
 
        {/* ===== FOOTER ===== */}
        <div className="px-4 py-4 border-t border-[#0b1f33]">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#00c2ff] to-[#7c3aed] flex items-center justify-center shadow-md">
              <User size={18} className="text-white" />
            </div>
 
            {!collapsed && (
              <div>
                <p className="text-sm text-white font-semibold">
                  John Distributor
                </p>
                <p className="text-xs text-gray-400">Distributor</p>
              </div>
            )}
          </div>
 
          {!collapsed && (
            <Button
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
              className="w-full rounded-xl bg-red-600/90 hover:bg-red-600 flex items-center gap-2 justify-center"
            >
              <LogOut size={18} />
              Logout
            </Button>
          )}
        </div>
 
        {/* ===== COLLAPSE ARROW (DESKTOP ONLY) ===== */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            hidden lg:flex
            absolute top-1/2 -right-3
            w-7 h-14
            rounded-full
            bg-[#020817]
            border border-cyan-400/40
            shadow-[0_0_15px_rgba(34,211,238,0.35)]
            items-center justify-center
            text-cyan-400
            hover:bg-cyan-400 hover:text-black
            transition-all
          "
        >
          <ChevronLeft
            size={18}
            className={`transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </aside>
    </>
  );
};
 
export default Sidebar;