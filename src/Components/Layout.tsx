import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
 
const Layout = () => {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar (only scrollable area) */}
      <Sidebar />
 
      {/* Main content (NO SCROLL EVER) */}
      <div className="flex-1 bg-[#020817] overflow-hidden">
        <div className="h-full w-full pt-4 pl-5 pr-6 box-border overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
    </div>
  );
};
 
export default Layout;
