import React from 'react';

export default function Banner({ activeTokens, activeDoctors, language }) {
  const isUrdu = language === 'ur';

  // Translation mapping
  const trans = {
    gridTitle: isUrdu ? 'ڈیرا اسماعیل خان ہیلتھ گرڈ' : 'Dera Ismail Khan Healthcare Grid',
    hubTitle: isUrdu ? 'لائیو کیو حب' : 'Live Queue Hub',
    desc: isUrdu 
      ? 'ڈی آئی کے میں کلینک پر لمبی لائنوں اور انتظار گاہوں سے بچیں۔ گھر بیٹھے سیکنڈوں میں ٹوکن حاصل کریں، لائیو قطار کی نگرانی کریں، اور اپنے پسندیدہ ڈاکٹر سے بروقت علاج کروائیں۔'
      : 'Skip physical waiting rooms across D.I.K. Generate digital tokens in real-time, track serving queues online, and receive personalized care from local specialists.',
    servingQ: isUrdu ? 'سرونگ کیو' : 'Serving Queue',
    activeToday: isUrdu ? 'آج فعال' : 'Active Today',
    activeSpec: isUrdu ? 'فعال ماہرین' : 'Active Specialists',
    verified: isUrdu ? 'تصدیق شدہ' : 'Verified'
  };

  return (
    <div className="relative rounded-3xl overflow-hidden text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-200 dark:border-slate-800">
      
      {/* User-focused clinical background image with custom position for mobile */}
      <div 
        className="absolute inset-0 bg-cover bg-[position:75%_center] sm:bg-center" 
        style={{ backgroundImage: "url('/assets/hero-bg-user.jpg')" }}
      ></div>
      
      {/* Translucent Dark Gradient Overlay for optimal text readability */}
      <div 
        className="absolute inset-0 backdrop-blur-[0.5px]" 
        style={{ 
          background: 'linear-gradient(to right, rgba(3, 47, 46, 0.95) 0%, rgba(3, 47, 46, 0.8) 45%, rgba(3, 47, 46, 0.3) 100%)' 
        }}
      ></div>
      
      {/* Subtle glowing elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl -ml-28 -mb-28"></div>

      <div className="relative max-w-3xl space-y-5 text-left">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/40 text-green-300 text-xs font-bold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          {trans.gridTitle}
        </span>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none text-white drop-shadow-md">
          {isUrdu ? 'ڈی آئی کے ڈاکٹر' : 'D.I.K Doctor'} <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-green-300 to-teal-300 bg-clip-text text-transparent">{trans.hubTitle}</span>
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-100 max-w-xl leading-relaxed font-semibold drop-shadow-sm">
          {trans.desc}
        </p>

        <div className="flex flex-wrap gap-4 pt-3 text-xs">
          <div 
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-md"
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(10px)', 
              WebkitBackdropFilter: 'blur(10px)', 
              border: '1px solid rgba(255, 255, 255, 0.15)' 
            }}
          >
            <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center text-sm font-bold shadow">
              <i className="fa-solid fa-users"></i>
            </div>
            <div>
              <div className="text-[10px] text-slate-200 font-bold uppercase tracking-wider">{trans.servingQ}</div>
              <div className="font-extrabold text-white text-sm">{activeTokens} {trans.activeToday}</div>
            </div>
          </div>
          
          <div 
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-md"
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(10px)', 
              WebkitBackdropFilter: 'blur(10px)', 
              border: '1px solid rgba(255, 255, 255, 0.15)' 
            }}
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center text-sm font-bold shadow">
              <i className="fa-solid fa-user-md"></i>
            </div>
            <div>
              <div className="text-[10px] text-slate-200 font-bold uppercase tracking-wider">{trans.activeSpec}</div>
              <div className="font-extrabold text-white text-sm">{activeDoctors} {trans.verified}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
