import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaUserCircle, FaSearch, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import Popup from '../Popup/Popup';
import axios from 'axios';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState({});
  const [activePopup, setActivePopup] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5000/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser({});
      }
    };

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5000/api/notifications', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setNotifications(response.data);
          localStorage.setItem('notifications', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      }
    };

    fetchUserData();
    fetchNotifications();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('http://localhost:5000/api/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('notifications');
      navigate('/');
    }
  };

  const updateUserData = async (newData) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.put('http://localhost:5000/api/user/profile', newData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const updatedUser = response.data;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const closeAllMenus = () => {
    setIsProfileOpen(false);
    setIsSettingsOpen(false);
    setIsNotificationsOpen(false);
  };

  const openPopup = (popupType) => {
    setActivePopup(popupType);
    closeAllMenus();
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`http://localhost:5000/api/search?q=${e.target.value}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('Search results:', response.data);
          // Implement search results display logic here
        }
      } catch (error) {
        console.error('Error performing search:', error);
      }
    }
  };

  const clearNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.delete('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications([]);
        localStorage.setItem('notifications', JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg p-4 flex justify-between items-center"
      >
        <div className="flex items-center space-x-4">
          {/* Search input removed from here */}
        </div>
        <div className="flex items-center space-x-6">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative cursor-pointer"
            onClick={() => {
              closeAllMenus();
              setIsNotificationsOpen(!isNotificationsOpen);
            }}
          >
            <FaBell className="text-white text-xl" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50"
                >
                  {notifications.length > 0 ? (
                    <>
                      {notifications.map((notification, index) => (
                        <div key={index} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          {notification.message}
                        </div>
                      ))}
                      <button
                        onClick={clearNotifications}
                        className="w-full text-center py-2 text-sm text-indigo-600 hover:bg-indigo-50 transition duration-300"
                      >
                        Clear All
                      </button>
                    </>
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-700">No new notifications</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer relative"
            onClick={() => {
              closeAllMenus();
              setIsSettingsOpen(!isSettingsOpen);
            }}
          >
            <FaCog className="text-white text-xl" />
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                >
                  <button onClick={() => openPopup('accountSettings')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white transition duration-300">Account Settings</button>
                  <button onClick={() => openPopup('privacySettings')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white transition duration-300">Privacy Settings</button>
                  <button onClick={() => openPopup('notificationSettings')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white transition duration-300">Notification Settings</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.div
            className="relative"
            onClick={() => {
              closeAllMenus();
              setIsProfileOpen(!isProfileOpen);
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <FaUserCircle className="text-white text-2xl" />
              <span className="font-medium text-white">{user.name || 'User'}</span>
            </motion.div>
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                >
                  <Link to="/profile" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white transition duration-300">Profile</Link>
                  <button onClick={() => openPopup('settings')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white transition duration-300">Settings</button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white transition duration-300 flex items-center">
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.header>

      <Popup isOpen={activePopup !== null} onClose={closePopup} type={activePopup}>
        {activePopup === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            {/* Add settings content here */}
          </div>
        )}
        {activePopup === 'accountSettings' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
            {/* Add account settings content here */}
          </div>
        )}
        {activePopup === 'privacySettings' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Privacy Settings</h2>
            {/* Add privacy settings content here */}
          </div>
        )}
        {activePopup === 'notificationSettings' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Notification Settings</h2>
            {/* Add notification settings content here */}
          </div>
        )}
      </Popup>
    </>
  );
};

export default Header;
