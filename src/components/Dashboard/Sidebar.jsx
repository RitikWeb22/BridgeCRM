import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaClipboardList, FaBoxes, FaFileInvoiceDollar, FaChartBar, FaUsers, FaPlug, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import axios from 'axios';

const menuItems = [
  { icon: FaTachometerAlt, text: 'Dashboard', path: '/dashboard' },
  { icon: FaClipboardList, text: 'Order Management', path: '/orders' },
  { icon: FaBoxes, text: 'Inventory Management', path: '/inventory' },
  { icon: FaFileInvoiceDollar, text: 'Invoicing & Payments', path: '/invoices' },
  { icon: FaChartBar, text: 'Reporting & Notifications', path: '/reporting' },
  { icon: FaUsers, text: 'User Management', path: '/users' },
  { icon: FaPlug, text: 'Integration & API', path: '/integration' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <aside className="w-64 bg-gray-900 text-gray-100 h-screen fixed left-0 top-0 overflow-y-auto z-10 shadow-xl transition-all duration-300 ease-in-out">
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-8 text-white">BridgeCRM</h1>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    location.pathname.startsWith(item.path)
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="text-lg" />
                  <span>{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="absolute bottom-5 left-5 flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
      >
        <FaSignOutAlt className="text-lg" />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
