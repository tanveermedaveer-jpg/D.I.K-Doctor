import React, { useState } from 'react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [role, setRole] = useState('doctor'); // 'doctor' or 'admin'
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  
  const [showPin, setShowPin] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (role === 'admin') {
      // Super Admin credentials check: 03103716116 and Sadaf@9099
      if (adminUser === '03103716116' && adminPass === 'Sadaf@9099') {
        onLoginSuccess({ role: 'admin' });
        handleClose();
      } else {
        setErrorMsg('Access Denied: Invalid credentials.');
      }
    } else {
      // Doctor check: matching against database (passed from App.jsx via onLoginSuccess callback checks)
      const success = onLoginSuccess({ role: 'doctor', phone, pin });
      if (success) {
        handleClose();
      } else {
        setErrorMsg('Access Denied: Invalid Phone/Name or PIN.');
      }
    }
  };

  const handleClose = () => {
    setPhone('');
    setPin('');
    setAdminUser('');
    setAdminPass('');
    setErrorMsg('');
    setShowPin(false);
    setShowPass(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-x-hidden">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-805 shadow-2xl w-[92%] max-w-[460px] mx-auto overflow-hidden space-y-4">
        
        {/* Modal Header */}
        <div className="bg-slate-50 dark:bg-slate-955 p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xs sm:text-sm font-extrabold tracking-tight uppercase text-slate-500 dark:text-slate-400">Portal Security Gateway</h2>
          <button onClick={handleClose} className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs hover:bg-red-500 hover:text-white transition-all">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-2 bg-slate-105 dark:bg-slate-805 p-1 rounded-xl">
            <button 
              type="button"
              onClick={() => { setRole('doctor'); setErrorMsg(''); }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap px-1 ${
                role === 'doctor' 
                  ? 'bg-white dark:bg-slate-900 shadow-sm text-green-606 dark:text-green-400' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
              }`}
            >
              <i className="fa-solid fa-user-doctor"></i>
              <span>Doctor Login</span>
            </button>
            <button 
              type="button"
              onClick={() => { setRole('admin'); setErrorMsg(''); }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap px-1 ${
                role === 'admin' 
                  ? 'bg-white dark:bg-slate-900 shadow-sm text-green-606 dark:text-green-400' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
              }`}
            >
              <i className="fa-solid fa-user-gear"></i>
              <span>Super Admin</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 pb-6 space-y-4">
          
          {role === 'doctor' ? (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-605 dark:text-slate-400 mb-1">Registered Phone or Doctor Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs"><i className="fa-solid fa-user-doctor"></i></span>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                    autoComplete="off"
                    placeholder="Enter registered phone number or doctor name" 
                    className="w-full block pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-green-500 dark:text-slate-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-605 dark:text-slate-400 mb-1">Security PIN (4-Digit)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs"><i className="fa-solid fa-key"></i></span>
                  <input 
                    type={showPin ? 'text' : 'password'} 
                    value={pin} 
                    onChange={(e) => setPin(e.target.value)} 
                    required 
                    autoComplete="new-password"
                    pattern="[0-9]{4}" 
                    maxLength={4} 
                    placeholder="Enter 4-digit PIN" 
                    className="w-full block pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-green-500 dark:text-slate-100"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPin(!showPin)} 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-355"
                  >
                    <i className={`fa-solid ${showPin ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-605 dark:text-slate-400 mb-1">Admin Phone/Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs"><i className="fa-solid fa-user"></i></span>
                   <input 
                    type="text" 
                    value={adminUser} 
                    onChange={(e) => setAdminUser(e.target.value)} 
                    required 
                    autoComplete="off"
                    placeholder="Enter admin phone number" 
                    className="w-full block pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-green-500 dark:text-slate-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-605 dark:text-slate-400 mb-1">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs"><i className="fa-solid fa-lock"></i></span>
                  <input 
                    type={showPass ? 'text' : 'password'} 
                    value={adminPass} 
                    onChange={(e) => setAdminPass(e.target.value)} 
                    required 
                    autoComplete="new-password"
                    placeholder="Enter admin password" 
                    className="w-full block pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-green-500 dark:text-slate-100"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)} 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-355"
                  >
                    <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                  </button>
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="text-xs bg-red-50 dark:bg-red-950/20 text-red-655 dark:text-red-405 p-3 rounded-xl border border-red-100 dark:border-red-950/40">
              <i className="fa-solid fa-circle-exclamation mr-1"></i> {errorMsg}
            </div>
          )}

          <button type="submit" className="w-full block py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all">
            Authenticate Portal
          </button>
        </form>

      </div>
    </div>
  );
}
