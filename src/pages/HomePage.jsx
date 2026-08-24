import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Banner from '../components/Banner';
import DoctorCard from '../components/DoctorCard';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

export default function HomePage({ 
  doctors, 
  searchQuery, 
  setSearchQuery, 
  selectedSpecialty, 
  setSelectedSpecialty, 
  onVoiceSearch, 
  isListening, 
  onViewProfile, 
  onGetToken, 
  openSpecialtiesModal,
  language,
  onRateDoctor
}) {
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [ladyOnly, setLadyOnly] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(6);
  const isUrdu = language === 'ur';

  // Get unique cities and zones dynamically from registered doctors
  const dynamicCities = Array.from(
    new Set(
      doctors
        .filter(d => d && d.isActive !== false && d.city && d.city.trim() !== '')
        .map(d => d.city.trim())
    )
  ).sort();

  const dynamicZones = Array.from(
    new Set(
      doctors
        .filter(d => d && d.isActive !== false && d.zone && d.zone.trim() !== '')
        .filter(d => (selectedCity ? (d.city || 'D.I.K') === selectedCity : true))
        .map(d => d.zone.trim())
    )
  ).sort();

  // Filter active doctors matching search, specialty, city, zone, and lady specialist filters
  const filteredDocs = doctors.filter(doc => {
    if (!doc || doc.isActive === false) return false;
    
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (doc.specialty && doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty = selectedSpecialty ? doc.specialty === selectedSpecialty : true;
    const matchesCity = selectedCity ? (doc.city || 'D.I.K') === selectedCity : true;
    const matchesZone = selectedZone ? doc.zone === selectedZone : true;
    const matchesLady = ladyOnly ? doc.gender === 'Female' : true;
    
    return matchesSearch && matchesSpecialty && matchesCity && matchesZone && matchesLady;
  });

  // Sort doctors by 5-Star rating descending (highest rating first)
  const sortedDocs = [...filteredDocs].sort((a, b) => {
    const rA = typeof a.rating === 'number' ? a.rating : 5.0;
    const rB = typeof b.rating === 'number' ? b.rating : 5.0;
    return rB - rA;
  });

  const visibleDocs = sortedDocs.slice(0, visibleLimit);

  const activeTokens = doctors.reduce((sum, d) => sum + (d && d.queue ? d.queue.length : 0), 0);
  const activeDoctors = doctors.filter(d => d && d.isActive !== false).length;

  const topSpecialties = [
    { name: "Cardiologist", icon: "fa-heart-pulse", bg: "bg-red-50 text-red-500", ur: "امراضِ قلب" },
    { name: "Gynecologist", icon: "fa-baby-carriage", bg: "bg-pink-50 text-pink-500", ur: "امراضِ نسواں" },
    { name: "Pediatrician", icon: "fa-baby", bg: "bg-blue-50 text-blue-500", ur: "بچوں کے معالج" },
    { name: "Neurologist", icon: "fa-brain", bg: "bg-purple-50 text-purple-500", ur: "اعصابی امراض" },
    { name: "Orthopedic", icon: "fa-bone", bg: "bg-amber-50 text-amber-605", ur: "ہڈیوں کے معالج" },
    { name: "Dermatologist", icon: "fa-hand-holding-medical", bg: "bg-teal-50 text-teal-500", ur: "جلد کے معالج" },
    { name: "ENT", icon: "fa-ear-listen", bg: "bg-indigo-50 text-indigo-500", ur: "کان ناک گلا" },
    { name: "Ophthalmologist", icon: "fa-eye", bg: "bg-orange-50 text-orange-500", ur: "آنکھوں کے معالج" },
    { name: "Psychiatrist", icon: "fa-head-side-virus", bg: "bg-rose-50 text-rose-500", ur: "ماہرِ نفسیات" },
    { name: "Urologist", icon: "fa-circle-nodes", bg: "bg-emerald-50 text-emerald-505", ur: "امراضِ بول" },
    { name: "Gastroenterologist", icon: "fa-stethoscope", bg: "bg-sky-50 text-sky-500", ur: "معدہ و جگر" }
  ];

  // Homepage translation dictionary
  const trans = {
    zoneLabel: isUrdu ? 'ڈی آئی کے میڈیکل زون سے فلٹر کریں' : 'Filter by D.I.K Medical Zone',
    clearZone: isUrdu ? 'زون ختم کریں' : 'Clear Zone',
    allZones: isUrdu ? '📍 تمام ڈی آئی کے زونز' : '📍 All D.I.K Zones',
    searchPlaceholder: isUrdu ? 'ڈاکٹر کا نام یا مہارت تلاش کریں...' : 'Search doctors by name or specialty...',
    exploreHeading: isUrdu ? 'طبی مہارتیں دریافت کریں' : 'Explore Medical Specialties',
    exploreSub: isUrdu ? 'ڈاکٹروں کو ان کے متعلقہ شعبہ سے فلٹر کریں' : 'Filter doctors by their medical fields',
    viewAllSpec: isUrdu ? 'تمام مہارتیں دیکھیں' : 'View All Specialties',
    clearFilter: isUrdu ? 'فلٹر ختم کریں' : 'Clear filter',
    availDocs: isUrdu ? 'دستیاب معالجین' : 'Available Doctors',
    availDocsSub: isUrdu 
      ? 'آج کے معائنے کے لیے فوری ڈیجیٹل ٹوکن حاصل کریں' 
      : "Book virtual tokens instantly for today's appointment",
    noDocs: isUrdu ? 'کوئی ڈاکٹر نہیں ملا' : 'No Doctors Matching Criteria',
    noDocsSub: isUrdu 
      ? 'براہ کرم سرچ کی ورڈ تبدیل کریں یا کوئی دوسرا زون منتخب کریں۔' 
      : 'Try resetting search keywords or selecting a different specialty or zone filter pill.',
    resetFilters: isUrdu ? 'فلٹرز دوبارہ سیٹ کریں' : 'Reset Search Filters'
  };

  return (
    <section className="space-y-8">
      
      {/* 1. upgraded Hero Banner */}
      <Banner activeTokens={activeTokens} activeDoctors={activeDoctors} language={language} />

      {/* 2. D.I.K Local Medical Zone Filter Pills */}
      <div className="space-y-3 text-left">
        <div className="flex justify-between items-center">
          <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">{trans.zoneLabel}</span>
          {selectedZone && (
            <button 
              onClick={() => setSelectedZone(null)} 
              className="text-[10px] font-bold text-red-500 hover:underline"
            >
              {trans.clearZone} <i className="fa-solid fa-xmark ml-0.5"></i>
            </button>
          )}
        </div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-wrap gap-2"
        >
          <motion.button 
            variants={itemVariants}
            onClick={() => setSelectedZone(null)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              selectedZone === null 
                ? 'bg-green-500 border-green-500 text-white shadow-sm shadow-green-500/10' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-green-500'
            }`}
          >
            {trans.allZones}
          </motion.button>
          {dynamicZones.map(zone => (
            <motion.button 
              key={zone}
              variants={itemVariants}
              onClick={() => setSelectedZone(zone)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedZone === zone 
                  ? 'bg-green-500 border-green-500 text-white shadow-sm shadow-green-500/10' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-green-500'
              }`}
            >
              📍 {zone}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* 3. Search Bar */}
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="relative shadow-md rounded-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={trans.searchPlaceholder} 
            className="w-full pl-11 pr-12 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm dark:text-slate-100 text-left"
          />
          <button 
            onClick={onVoiceSearch} 
            title="Voice Search" 
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-green-500 active:scale-95 transition-all"
          >
            <i className={`fa-solid ${isListening ? 'fa-circle-notch fa-spin text-red-505' : 'fa-microphone'} text-lg`}></i>
          </button>
        </div>

        {/* Lady Doctors Filter Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setLadyOnly(!ladyOnly)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              ladyOnly
                ? 'bg-pink-500 border-pink-500 text-white shadow-md shadow-pink-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-pink-400'
            }`}
          >
            <span>🌸 {isUrdu ? 'صرف لیڈی ڈاکٹرز' : 'Lady Specialists / Lady Doctors Only'}</span>
            {ladyOnly && <i className="fa-solid fa-circle-check"></i>}
          </button>
        </div>
      </div>

      {/* 4. Specialties Row */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h2 className="text-xl font-bold tracking-tight">{trans.exploreHeading}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{trans.exploreSub}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={openSpecialtiesModal} 
              className="text-xs font-bold text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
            >
              <i className="fa-solid fa-grid-2"></i> {trans.viewAllSpec}
            </button>
            {selectedSpecialty && (
              <button 
                onClick={() => setSelectedSpecialty(null)} 
                className="text-xs font-semibold text-green-600 dark:text-green-400 hover:underline"
              >
                {trans.clearFilter} <i className="fa-solid fa-xmark ml-1"></i>
              </button>
            )}
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-11 gap-3"
        >
          {topSpecialties.map((spec) => (
            <motion.button 
              key={spec.name}
              variants={itemVariants}
              onClick={() => setSelectedSpecialty(spec.name)}
              className={`specialty-card group p-3 rounded-2xl bg-white dark:bg-slate-900 border hover:border-green-500 flex flex-col items-center text-center gap-1.5 shadow-sm transition-all hover:-translate-y-1 ${
                selectedSpecialty === spec.name ? 'border-green-500 bg-green-50/20 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg group-hover:scale-105 transition-transform ${spec.bg}`}>
                <i className={`fa-solid ${spec.icon}`}></i>
              </div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight">
                {isUrdu ? spec.ur : (spec.name.length > 9 ? `${spec.name.slice(0, 8)}...` : spec.name)}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* 5. Active Doctors Grid */}
      <div id="available-doctors" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h2 className="text-xl font-bold tracking-tight">
              {selectedSpecialty 
                ? (isUrdu ? `${selectedSpecialty} کے ماہرین` : `${selectedSpecialty} Specialists`) 
                : trans.availDocs}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedSpecialty 
                ? (isUrdu ? `${selectedSpecialty} کے فعال معالجین دکھائے جا رہے ہیں` : `Showing active ${selectedSpecialty.toLowerCase()} records`) 
                : trans.availDocsSub
              }
            </p>
          </div>
        </div>

        {sortedDocs.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-2xl mb-4">
              <i className="fa-solid fa-user-slash"></i>
            </div>
            <h3 className="text-lg font-bold">{trans.noDocs}</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">{trans.noDocsSub}</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedSpecialty(null); setSelectedZone(null); setSelectedCity(null); }} 
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold shadow hover:bg-green-600 transition-all"
            >
              {trans.resetFilters}
            </button>
          </div>
        ) : (
          <>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {visibleDocs.map((doc) => (
                <motion.div key={doc.id} variants={itemVariants}>
                  <DoctorCard 
                    doc={doc}
                    onViewProfile={() => onViewProfile(doc)}
                    onGetToken={() => onGetToken(doc)}
                    language={language}
                    onRateDoctor={onRateDoctor}
                  />
                </motion.div>
              ))}
            </motion.div>

            {sortedDocs.length > visibleLimit && (
              <div className="flex justify-center pt-6">
                <button
                  onClick={() => setVisibleLimit(prev => prev + 6)}
                  className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-extrabold text-xs shadow-md hover:border-green-500 hover:text-green-600 transition-all flex items-center gap-2"
                >
                  <span>{isUrdu ? `مزید معالجین دیکھیں (${sortedDocs.length - visibleLimit} باقی)` : `Show More Doctors (${sortedDocs.length - visibleLimit} remaining)`}</span>
                  <i className="fa-solid fa-chevron-down text-green-500 animate-bounce"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>

    </section>
  );
}
