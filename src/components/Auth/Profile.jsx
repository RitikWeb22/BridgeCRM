import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = () => {
      // Simulating API call with dummy data
      const dummyUser = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        avatar: 'https://via.placeholder.com/150',
        createdAt: '2023-01-01T00:00:00.000Z'
      };

      setUser(dummyUser);
      setEditedUser(dummyUser);
      setLoading(false);
    };

    fetchUserProfile();
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
  };

  const handleSave = () => {
    // Simulating save operation
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser({ ...editedUser, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl"
      >
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-cover md:w-48" src={editedUser?.avatar || 'https://via.placeholder.com/150'} alt={editedUser?.name} />
            {isEditing && (
              <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-2" />
            )}
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">User Profile</div>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={editedUser?.name || ''}
                  onChange={handleChange}
                  className="block mt-1 text-lg leading-tight font-medium text-black w-full"
                />
                <input
                  type="email"
                  name="email"
                  value={editedUser?.email || ''}
                  onChange={handleChange}
                  className="mt-2 text-gray-500 w-full"
                />
              </>
            ) : (
              <>
                <h2 className="block mt-1 text-lg leading-tight font-medium text-black">{user?.name}</h2>
                <p className="mt-2 text-gray-500">{user?.email}</p>
              </>
            )}
            <p className="mt-2 text-gray-500">Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
            {isEditing ? (
              <div className="mt-4 space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={handleSave}
                >
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={handleCancel}
                >
                  Cancel
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleEdit}
              >
                Edit Profile
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
