import React, { useState } from 'react';

export default function Header({ 
  currentUser, 
  navigateTo, 
  logout, 
  isDarkMode, 
  toggleDarkMode, 
  onEmergencyClick,
  onHistoryClick,
  language
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isUrdu = language === 'ur';

  const handleNav = (view) => {
    navigateTo(view);
    setMobileMenuOpen(false);
  };

  const handleAction = (callback) => {
    callback();
    setMobileMenuOpen(false);
  };

  const handleFindDoctors = () => {
    navigateTo('home');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById('available-doctors');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
  };

  // Localized Navigation strings
  const trans = {
    home: isUrdu ? 'ہوم' : 'Home',
    findDocs: isUrdu ? 'معالج تلاش کریں' : 'Find Doctors',
    emergency: isUrdu ? '🚨 ہنگامی مدد' : '🚨 Emergency',
    myHistory: isUrdu ? '📜 میری معلومات' : '📜 My History',
    menuTitle: isUrdu ? 'مینیو گائیڈ' : 'Navigation Menu',
    dashboard: isUrdu ? 'ڈیش بورڈ پر جائیں' : 'Go to Dashboard',
    signOut: isUrdu ? 'سائن آؤٹ' : 'Sign Out',
    emergencyDrawer: isUrdu ? '🚨 ہنگامی ہیلپ لائنز' : '🚨 Emergency Helplines',
    profileTitle: isUrdu ? 'لاگ ان پروفائل' : 'Logged in Profile'
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Branding & Logo */}
        <button onClick={() => handleNav('home')} className="flex items-center gap-2.5 group text-left">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-green-500/20 transform group-hover:scale-105 transition-transform">
            <i className="fa-solid fa-house-medical text-lg"></i>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent block">
              D.I.K Doctor
            </span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase -mt-1">
              ڈی آئی کے ڈاکٹر
            </span>
          </div>
        </button>

        {/* Desktop Navigation Items */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-300">
          <button onClick={() => handleNav('home')} className="hover:text-green-550 dark:hover:text-green-400 transition-colors">{trans.home}</button>
          <button onClick={handleFindDoctors} className="hover:text-green-550 dark:hover:text-green-400 transition-colors">{trans.findDocs}</button>
          <button onClick={onHistoryClick} className="hover:text-green-550 dark:hover:text-green-400 transition-colors">{trans.myHistory}</button>
          <button 
            onClick={onEmergencyClick} 
            className="px-3.5 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 animate-pulse"
          >
            {trans.emergency}
          </button>
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Light/Dark Mode Switch */}
          <button 
            onClick={toggleDarkMode} 
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center transition-colors text-slate-600 dark:text-slate-300"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <i className="fa-solid fa-sun text-lg"></i>
            ) : (
              <i className="fa-solid fa-moon text-lg"></i>
            )}
          </button>

          {/* Logged in badge shortcuts */}
          {currentUser && (
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => handleNav(currentUser.role === 'admin' ? 'admin-dashboard' : 'doctor-dashboard')} 
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-green-500 text-white font-bold text-xs hover:bg-green-600 transition-all shadow-sm"
              >
                <i className="fa-solid fa-chart-line"></i>
                <span className="hidden sm:inline">{trans.dashboard}</span>
              </button>
              <button 
                onClick={logout} 
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-605 dark:text-slate-300 font-bold text-xs hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-all"
                title="Logout"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-805 dark:hover:bg-slate-750 flex lg:hidden items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Toggle menu"
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
          </button>
        </div>

      </div>

      {/* Sliding Mobile Side Drawer Menu */}
      <div className={`fixed inset-0 z-[9999] lg:hidden transform transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Backdrop overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-none" onClick={() => setMobileMenuOpen(false)}></div>
        
        {/* Drawer panel */}
        <div className="absolute right-0 top-0 bottom-0 max-w-xs w-full bg-white dark:bg-slate-900 p-6 shadow-2xl flex flex-col space-y-6 opacity-100 z-50">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="font-black text-slate-900 dark:text-white text-base tracking-tight">{trans.menuTitle}</span>
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-red-500 hover:text-white dark:bg-slate-800 flex items-center justify-center text-xs text-slate-700 dark:text-slate-200 transition-all"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="flex flex-col gap-4 text-sm font-extrabold text-slate-900 dark:text-slate-100">
            <button onClick={() => handleNav('home')} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors">
              <i className="fa-solid fa-house text-green-550 w-5 text-base"></i> {trans.home}
            </button>
            <button onClick={handleFindDoctors} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors">
              <i className="fa-solid fa-user-doctor text-green-550 w-5 text-base"></i> {trans.findDocs}
            </button>
            <button onClick={() => handleAction(onHistoryClick)} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors">
              <i className="fa-solid fa-scroll text-green-550 w-5 text-base"></i> {trans.myHistory}
            </button>
            <button onClick={() => handleAction(onEmergencyClick)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-left transition-colors">
              <i className="fa-solid fa-truck-medical w-5 text-base animate-pulse"></i> {trans.emergencyDrawer}
            </button>
          </div>

          {currentUser && (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col gap-3">
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{trans.profileTitle}</div>
              <button 
                onClick={() => handleNav(currentUser.role === 'admin' ? 'admin-dashboard' : 'doctor-dashboard')} 
                className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
              >
                <i className="fa-solid fa-gauge"></i> {trans.dashboard}
              </button>
              <button 
                onClick={() => handleAction(logout)} 
                className="w-full py-2.5 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <i className="fa-solid fa-right-from-bracket"></i> {trans.signOut}
              </button>
            </div>
          )}
        </div>
      </div>

    </header>
  );
}
