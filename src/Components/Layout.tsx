import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
 
const Layout = () => {
  return (
    <div className="flex h-screen w-full bg-[#020817] overflow-hidden">
 
      {/* Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
 
      {/* Main content */}
      <div className="flex-1 min-w-0 overflow-y-auto overflow-x-auto">
        <Outlet />
      </div>
 
    </div>
    </div>
  );
};
 
export default Layout;
 