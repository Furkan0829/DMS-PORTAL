import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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
  ChevronRight,
  Menu,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Products", icon: Package, path: "/products" },
  { name: "Cart", icon: ShoppingCart, path: "/cart" },
  { name: "Orders", icon: ClipboardList, path: "/orders" },
  { name: "Inventory", icon: Warehouse, path: "/inventory" },
  { name: "GRN", icon: FileText, path: "/grn" },
  { name: "Lead Generation", icon: Users, path: "/leads" },
  { name: "Stock Management", icon: Boxes, path: "/stock" },
  { name: "Warranty Registration", icon: ShieldCheck, path: "/warranty" },
  { name: "Price List", icon: Tag, path: "/price" },
  { name: "Invoice", icon: Receipt, path: "/invoice" },
  { name: "Profile", icon: User, path: "/profile" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="lg:hidden flex items-center  px-4 py-3 border-b border-cyan-500/20 fixed top-0 left-0 right-0 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="
          w-11 h-11
          flex items-center justify-center
          rounded-xl
          bg-[#071521]
          border border-cyan-400/40
          shadow-[0_0_12px_rgba(34,211,238,0.25)]
          hover:shadow-[0_0_16px_rgba(34,211,238,0.35)]
          transition
          "
        >
          <Menu className="text-cyan-400" size={20} />
        </button>
      </div>

      {/* BACKDROP */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
        fixed lg:relative top-0 left-0 z-50
        h-screen
        bg-gradient-to-b from-[#050B14] via-[#040A14] to-[#02060C]
        border-r border-cyan-500/10
        flex flex-col
        transition-all duration-300
        ${collapsed ? "w-[90px]" : "w-[300px]"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* LOGO */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-cyan-500/10">
          <div
            className="
    w-11 h-11
    rounded-xl
    bg-gradient-to-br from-violet-500 via-cyan-400 to-blue-500
    flex items-center justify-center
    transition-transform duration-300
    hover:rotate-6 hover:scale-105
    "
          >
            <Package className="text-black" size={22} />
          </div>

          {!collapsed && (
            <div className="flex flex-col justify-center text-start">
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-blue-400 font-semibold text-lg">
                DMS Portal
              </p>

              <span className="text-sm text-[#8FAFC9]">
                Distributor Management
              </span>
            </div>
          )}
        </div>

        {/* MENU + SCROLL AREA */}
        <div className="relative flex flex-col flex-1 min-h-0">
          {/* CENTER ARROW */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="
            absolute
            right-[-14px]
            top-1/2
            -translate-y-1/2
            z-50
            bg-[#071521]
            border border-cyan-400/40
            rounded-full
            p-1.5
            hover:bg-cyan-500/10
            "
          >
            {collapsed ? (
              <ChevronRight className="text-cyan-400" size={18} />
            ) : (
              <ChevronLeft className="text-cyan-400" size={18} />
            )}
          </button>

          {/* MENU LIST (SCROLL WORKING) */}
          <div className="sidebar-scroll flex-1 min-h-0 overflow-y-auto px-3 pr-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={index}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`
                  relative group
                   ${collapsed ? "justify-center px-0" : "gap-4 px-5"}
                  flex items-center 
                  py-3.5 my-1.5
                  rounded-xl
                  transition-all
                  ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-600/30 to-cyan-500/10 text-white"
                      : "text-[#9CB3C9] hover:bg-cyan-500/10 hover:text-white"
                  }
                `}
                >
                  {/* INNER ACTIVE BAR */}
                  <span
                    className={`
                    absolute left-2 top-3 bottom-3 w-[3px] rounded-full
                    bg-gradient-to-b from-violet-500 via-cyan-400 to-cyan-300
                    ${isActive ? "opacity-100" : "opacity-0"}
                  `}
                  />

                  {/* ICON */}
                  <Icon
                    size={collapsed ? 21 : 20}
                    className={`
                    ${
                      isActive
                        ? "text-cyan-400"
                        : "text-[#8FA3B8] group-hover:text-cyan-400"
                    }
                  `}
                  />

                  {!collapsed && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-cyan-500/10 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <User size={18} className="text-cyan-400" />
            </div>

            {!collapsed && (
              <div>
                <p className="text-white text-sm font-medium">
                  John Distributor
                </p>
                <span className="text-xs text-[#8FAFC9]">Distributor</span>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              navigate("/");
            }}
            className="
            flex items-center gap-2
            w-full
            bg-red-500/10
            hover:bg-red-500/20
            text-red-400
            py-2.5 px-4
            rounded-lg
            transition
          "
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
