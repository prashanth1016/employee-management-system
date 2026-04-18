// src/layouts/Layout.jsx
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {children}   {/* Page content renders here */}
        </main>
      </div>
    </div>
  );
};

export default Layout;