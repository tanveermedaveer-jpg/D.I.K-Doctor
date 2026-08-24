import React, { useState } from 'react';

export default function ContactModal({ isOpen, onClose, onFormSubmit }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;
    onFormSubmit(name.trim(), phone.trim(), message.trim());
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-x-hidden">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-805 shadow-2xl w-[95%] max-w-md mx-auto overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-5 border-b border-slate-100 dark:border-slate-850 flex justify-between items-center">
          <h2 className="text-xs sm:text-sm font-extrabold text-slate-550 dark:text-slate-400 uppercase">Contact Us & Complaints</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs hover:bg-red-500 hover:text-white transition-all">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-655 dark:text-slate-400 mb-1">Your Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="Enter your name" 
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-green-500 outline-none dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-655 dark:text-slate-400 mb-1">Your Phone Number</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
              placeholder="Enter your phone number" 
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-green-500 outline-none dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-655 dark:text-slate-400 mb-1">Message / Complaint</label>
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              required 
              rows="3" 
              placeholder="Write your message or complaint..." 
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-green-500 outline-none dark:text-slate-100"
            ></textarea>
          </div>

          <button type="submit" className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl shadow-md transition-all">
            Submit Message
          </button>
        </form>
      </div>
    </div>
  );
}
