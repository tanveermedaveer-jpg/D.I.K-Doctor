import React from 'react';

export default function Footer({ 
  onLoginClick, 
  onContactClick, 
  onPrivacyClick, 
  onTermsClick, 
  navigateTo,
  language,
  onLanguageChange
}) {
  const handleHomeFinder = () => {
    navigateTo('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <footer className="mt-auto bg-slate-900 text-slate-400 border-t border-slate-800/80 text-left">
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
  );
}
