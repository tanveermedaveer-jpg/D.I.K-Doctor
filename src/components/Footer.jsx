import React, { useState } from 'react';

export default function Footer({ 
  onLoginClick, 
  onContactClick, 
  onPrivacyClick, 
  onTermsClick, 
  onSpecialtiesClick,
  onHistoryClick,
  navigateTo,
  language,
  onLanguageChange
}) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const handleHomeFinder = () => {
    navigateTo('home');
    setShowMoreMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDoctorsClick = () => {
    navigateTo('home');
    setShowMoreMenu(false);
    setTimeout(() => {
      const el = document.getElementById('available-doctors');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  const isUrdu = language === 'ur';

  // Localized Translations
  const trans = {
    tagline: isUrdu 
      ? 'لائیو کیو ٹریکر اور اپائنٹمنٹ مینجمنٹ پورٹل' 
      : 'Live queue track and appointment management portal',
    copyright: isUrdu 
      ? '© 2026 ڈی آئی کے ڈاکٹر۔ جملہ حقوق محفوظ ہیں۔' 
      : '© 2026 D.I.K Doctor (ڈی آئی کے ڈاکٹر). All rights reserved.',
    homeFinder: isUrdu ? 'ہوم فائنڈر' : 'Home Finder',
    contactUs: isUrdu ? 'ہم سے رابطہ کریں' : 'Contact Us',
    privacyPolicy: isUrdu ? 'پرائیویسی پالیسی' : 'Privacy Policy',
    termsOfService: isUrdu ? 'سروس کی شرائط' : 'Terms of Service'
  };

  return (
    <>
      {/* 💻 STANDARD DESKTOP FOOTER (hidden md:block) */}
      <footer className="hidden md:block mt-auto bg-slate-900 text-slate-400 border-t border-slate-800/80 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            {/* Logo & Compact Copyright */}
            <div className="space-y-2 max-w-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-405 flex items-center justify-center text-base">
                  <i className="fa-solid fa-house-medical"></i>
                </div>
                <span className="font-extrabold text-base text-white tracking-tight">{isUrdu ? 'ڈی آئی کے ڈاکٹر' : 'D.I.K Doctor'}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{trans.tagline}</p>
              <p className="text-[10px] text-slate-600 font-medium pt-1">{trans.copyright}</p>
            </div>

            {/* Navigation Links and Language Selector */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3.5 text-xs font-bold w-full md:w-auto">
              <button onClick={handleHomeFinder} className="hover:text-white transition-colors">
                {trans.homeFinder}
              </button>
              <button onClick={onContactClick} className="hover:text-white transition-colors">
                {trans.contactUs}
              </button>
              <button onClick={onPrivacyClick} className="hover:text-white transition-colors">
                {trans.privacyPolicy}
              </button>
              <button onClick={onTermsClick} className="hover:text-white transition-colors">
                {trans.termsOfService}
              </button>

              {/* Language Switcher */}
              <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                <button 
                  onClick={() => onLanguageChange('en')} 
                  className={`px-2 py-1 text-[9px] rounded font-bold transition-all ${
                    language === 'en' 
                      ? 'bg-green-500 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button 
                  onClick={() => onLanguageChange('ur')} 
                  className={`px-2 py-1 text-[9px] rounded font-bold transition-all ${
                    language === 'ur' 
                      ? 'bg-green-500 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  اردو
                </button>
              </div>

              {/* Styled Discrete lock icon (🔒) */}
              <button 
                onClick={onLoginClick} 
                className="text-slate-700 hover:text-slate-500 transition-all text-xs" 
                title="Portal Login"
              >
                🔒
              </button>
            </div>

          </div>

        </div>
      </footer>

      {/* 📱 APP-STYLE FIXED BOTTOM NAVIGATION BAR FOR MOBILE (block md:hidden) */}
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="grid grid-cols-5 h-16 w-full text-center">
          
          {/* Tab 1: Home */}
          <button 
            type="button"
            onClick={handleHomeFinder}
            className="flex flex-col items-center justify-center space-y-1 text-slate-500 dark:text-slate-400 hover:text-green-500 active:scale-95 transition-all"
          >
            <i className="fa-solid fa-house text-lg"></i>
            <span className="text-[9px] font-bold">{isUrdu ? 'ہوم' : 'Home'}</span>
          </button>

          {/* Tab 2: Doctors */}
          <button 
            type="button"
            onClick={handleDoctorsClick}
            className="flex flex-col items-center justify-center space-y-1 text-slate-500 dark:text-slate-400 hover:text-green-500 active:scale-95 transition-all"
          >
            <i className="fa-solid fa-user-doctor text-lg"></i>
            <span className="text-[9px] font-bold">{isUrdu ? 'ڈاکٹرز' : 'Doctors'}</span>
          </button>

          {/* Tab 3: Specialties */}
          <button 
            type="button"
            onClick={() => { setShowMoreMenu(false); onSpecialtiesClick(); }}
            className="flex flex-col items-center justify-center space-y-1 text-slate-500 dark:text-slate-400 hover:text-green-500 active:scale-95 transition-all"
          >
            <i className="fa-solid fa-stethoscope text-lg"></i>
            <span className="text-[9px] font-bold">{isUrdu ? 'شعبہ جات' : 'Specialties'}</span>
          </button>

          {/* Tab 4: My History */}
          <button 
            type="button"
            onClick={() => { setShowMoreMenu(false); onHistoryClick(); }}
            className="flex flex-col items-center justify-center space-y-1 text-slate-500 dark:text-slate-400 hover:text-green-500 active:scale-95 transition-all"
          >
            <i className="fa-solid fa-clock-rotate-left text-lg"></i>
            <span className="text-[9px] font-bold">{isUrdu ? 'ہسٹری' : 'History'}</span>
          </button>

          {/* Tab 5: More */}
          <button 
            type="button"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex flex-col items-center justify-center space-y-1 active:scale-95 transition-all ${
              showMoreMenu ? 'text-green-500' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <i className="fa-solid fa-bars text-lg"></i>
            <span className="text-[9px] font-bold">{isUrdu ? 'مزید' : 'More'}</span>
          </button>

        </div>

        {/* Dynamic More Submenu Overlay above More Tab */}
        {showMoreMenu && (
          <div className="absolute bottom-18 right-4 left-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 flex flex-col gap-3 text-sm font-bold text-slate-700 dark:text-slate-200 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs uppercase text-slate-400 font-bold">{isUrdu ? 'ایپلی کیشن مینو' : 'Application Menu'}</span>
              <button type="button" onClick={() => setShowMoreMenu(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <button 
              type="button"
              onClick={() => { onContactClick(); setShowMoreMenu(false); }} 
              className="flex items-center gap-2.5 py-1.5 hover:text-green-500 transition-colors text-left text-xs"
            >
              <i className="fa-solid fa-envelope text-slate-400 w-4 text-center"></i>
              <span>{trans.contactUs}</span>
            </button>
            
            <button 
              type="button"
              onClick={() => { onPrivacyClick(); setShowMoreMenu(false); }} 
              className="flex items-center gap-2.5 py-1.5 hover:text-green-500 transition-colors text-left text-xs"
            >
              <i className="fa-solid fa-shield-halved text-slate-400 w-4 text-center"></i>
              <span>{trans.privacyPolicy}</span>
            </button>
            
            <button 
              type="button"
              onClick={() => { onTermsClick(); setShowMoreMenu(false); }} 
              className="flex items-center gap-2.5 py-1.5 hover:text-green-500 transition-colors text-left text-xs"
            >
              <i className="fa-solid fa-file-contract text-slate-400 w-4 text-center"></i>
              <span>{trans.termsOfService}</span>
            </button>
            
            <button 
              type="button"
              onClick={() => { onLoginClick(); setShowMoreMenu(false); }} 
              className="flex items-center gap-2.5 py-2 hover:text-green-500 transition-colors text-left text-xs border-t border-slate-100 dark:border-slate-800 pt-2.5"
            >
              <i className="fa-solid fa-user-lock text-slate-400 w-4 text-center"></i>
              <span>{isUrdu ? 'لاگ ان پورٹل (اسٹاف)' : 'Portal Login (Staff)'}</span>
            </button>
            
            {/* Quick Language Switcher inside More drawer */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{isUrdu ? 'زبان منتخب کریں' : 'App Language'}</span>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <button 
                  type="button"
                  onClick={() => { onLanguageChange('en'); setShowMoreMenu(false); }} 
                  className={`px-2.5 py-1 text-[9px] rounded font-bold transition-all ${
                    language === 'en' 
                      ? 'bg-green-500 text-white shadow-sm' 
                      : 'text-slate-500 dark:text-slate-450'
                  }`}
                >
                  EN
                </button>
                <button 
                  type="button"
                  onClick={() => { onLanguageChange('ur'); setShowMoreMenu(false); }} 
                  className={`px-2.5 py-1 text-[9px] rounded font-bold transition-all ${
                    language === 'ur' 
                      ? 'bg-green-500 text-white shadow-sm' 
                      : 'text-slate-500 dark:text-slate-455'
                  }`}
                >
                  اردو
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Padding space to prevent bottom navigation bar overlap on mobile devices */}
      <div className="h-16 block md:hidden"></div>
    </>
  );
}
