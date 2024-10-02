import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const Popup = ({ isOpen, onClose, type, children, title, content }) => {
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);
  const [popupDetails, setPopupDetails] = useState({ title: '', content: '' });

  useEffect(() => {
    setLocalIsOpen(isOpen);
    if (isOpen) {
      const details = { type, isOpen, title, content };
      localStorage.setItem('popupState', JSON.stringify(details));
      setPopupDetails({ title, content });
    } else {
      localStorage.removeItem('popupState');
      setPopupDetails({ title: '', content: '' });
    }
  }, [isOpen, type, title, content]);

  useEffect(() => {
    const storedPopupState = localStorage.getItem('popupState');
    if (storedPopupState) {
      const { type: storedType, isOpen: storedIsOpen, title: storedTitle, content: storedContent } = JSON.parse(storedPopupState);
      if (storedType === type && storedIsOpen) {
        setLocalIsOpen(true);
        setPopupDetails({ title: storedTitle, content: storedContent });
      }
    }
  }, [type]);

  const handleClose = () => {
    setLocalIsOpen(false);
    localStorage.removeItem('popupState');
    setPopupDetails({ title: '', content: '' });
    onClose();
  };

  const handleUpdate = (newTitle, newContent) => {
    setPopupDetails({ title: newTitle, content: newContent });
    localStorage.setItem('popupState', JSON.stringify({ type, isOpen: true, title: newTitle, content: newContent }));
  };

  return (
    <AnimatePresence>
      {localIsOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md relative"
          >
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4">{popupDetails.title}</h2>
            <div className="mb-4">{popupDetails.content}</div>
            {children}
            <button
              onClick={() => handleUpdate('Updated Title', 'Updated Content')}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Update Details
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
