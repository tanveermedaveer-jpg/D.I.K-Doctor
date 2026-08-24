import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import ContactModal from './components/ContactModal';
import TokenModal from './components/TokenModal';
import HomePage from './pages/HomePage';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { 
  getDoctors, saveDoctors, 
  getLogs, saveLogs, 
  getComplaints, saveComplaints, 
  getActiveUser, saveActiveUser,
  getDarkMode, saveDarkMode 
} from './services/storage';
import { startVoiceSearch } from './services/speech';

const SPECIALTIES_DATA = [
  { name: "Cardiologist", icon: "fa-heart-pulse", ur: "امراضِ قلب", bg: "bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400" },
  { name: "Gynecologist", icon: "fa-baby-carriage", ur: "امراضِ نسواں", bg: "bg-pink-50 text-pink-500 dark:bg-pink-950/40 dark:text-pink-400" },
  { name: "Pediatrician", icon: "fa-baby", ur: "بچوں کے معالج", bg: "bg-blue-50 text-blue-500 dark:bg-blue-950/40 dark:text-blue-400" },
  { name: "Neurologist", icon: "fa-brain", ur: "اعصابی امراض", bg: "bg-purple-50 text-purple-500 dark:bg-purple-950/40 dark:text-purple-400" },
  { name: "Orthopedic", icon: "fa-bone", ur: "ہڈیوں کے معالج", bg: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400" },
  { name: "Dermatologist", icon: "fa-hand-holding-medical", ur: "جلد کے معالج", bg: "bg-teal-50 text-teal-500 dark:bg-teal-950/40 dark:text-teal-400" },
  { name: "ENT", icon: "fa-ear-listen", ur: "کان ناک گلا", bg: "bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400" },
  { name: "Ophthalmologist", icon: "fa-eye", ur: "آنکھوں کے معالج", bg: "bg-orange-50 text-orange-500 dark:bg-orange-950/40 dark:text-orange-400" },
  { name: "Psychiatrist", icon: "fa-head-side-virus", ur: "ماہرِ نفسیات", bg: "bg-rose-50 text-rose-500 dark:bg-rose-950/40 dark:text-rose-400" },
  { name: "Urologist", icon: "fa-circle-nodes", ur: "امراضِ بول", bg: "bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-400" },
  { name: "Gastroenterologist", icon: "fa-stethoscope", ur: "معدہ و جگر", bg: "bg-sky-50 text-sky-500 dark:bg-sky-950/40 dark:text-sky-400" },
  { name: "Pulmonologist", icon: "fa-lungs", ur: "امراضِ ریہ (پھیپھڑے)", bg: "bg-cyan-50 text-cyan-500 dark:bg-cyan-950/40 dark:text-cyan-400" },
  { name: "Nephrologist", icon: "fa-hospital-user", ur: "امراضِ گردہ", bg: "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400" },
  { name: "General Physician", icon: "fa-user-doctor", ur: "عام معالج", bg: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400" },
  { name: "General Surgeon", icon: "fa-syringe", ur: "جنرل سرجن", bg: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400" },
  { name: "Oncologist", icon: "fa-dna", ur: "کینسر کے ماہر", bg: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400" },
  { name: "Endocrinologist", icon: "fa-flask", ur: "ہارمونز کے ماہر", bg: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400" },
  { name: "Radiologist", icon: "fa-x-ray", ur: "ریڈیالوجسٹ", bg: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" },
  { name: "Pathologist", icon: "fa-microscope", ur: "پیتھالوجسٹ", bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" },
  { name: "Anesthesiologist", icon: "fa-capsules", ur: "بے ہوشی کے ماہر", bg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400" },
  { name: "Rheumatologist", icon: "fa-child", ur: "جوڑوں کے معالج", bg: "bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400" },
  { name: "Dentist", icon: "fa-tooth", ur: "دندان ساز", bg: "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400" }
];

export default function App() {
  // Persistence Hooks
  const [doctors, setDoctors] = useState([]);
  const [logs, setLogs] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' or 'ur'

  // Home Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [historySearch, setHistorySearch] = useState('');

  // Modals Visibility
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isTokenOpen, setIsTokenOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSpecialtiesOpen, setIsSpecialtiesOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [tokenHistory, setTokenHistory] = useState([]);

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [generatedSlip, setGeneratedSlip] = useState(null);

  // Toast Notification
  const [toastText, setToastText] = useState('');
  const [toastIcon, setToastIcon] = useState('fa-circle-check text-green-500');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastTimeout, setToastTimeout] = useState(null);

  useEffect(() => {
    setDoctors(getDoctors());
    setLogs(getLogs());
    setComplaints(getComplaints());
    setCurrentUser(getActiveUser());
    
    // Recovery & 24-Hour Expiry Logic for Token History
    try {
      const stored = localStorage.getItem('dik_token_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const now = Date.now();
          const activeHistory = parsed.filter(t => t && t.createdAt && (now - t.createdAt <= 86400000));
          setTokenHistory(activeHistory);
          localStorage.setItem('dik_token_history', JSON.stringify(activeHistory));
        }
      }
    } catch (e) {
      console.error("Failed to load/prune token history", e);
    }

    const view = localStorage.getItem('dik_current_view') || 'home';
    setCurrentView(view);

    const dark = getDarkMode();
    setIsDarkMode(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const triggerToast = (text, iconClass = 'fa-circle-check text-green-500') => {
    setToastText(text);
    setToastIcon(`fa-solid ${iconClass}`);
    setToastVisible(true);

    if (toastTimeout) clearTimeout(toastTimeout);
    const timeout = setTimeout(() => {
      setToastVisible(false);
    }, 4000);
    setToastTimeout(timeout);
  };

  const addActivityLog = (action) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const updated = [`[${time}] ${action}`, ...logs];
    if (updated.length > 50) updated.pop();
    setLogs(updated);
    saveLogs(updated);
  };

  const handleToggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    saveDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      triggerToast("Switched to Dark Mode", "fa-moon text-blue-500");
    } else {
      document.documentElement.classList.remove('dark');
      triggerToast("Switched to Light Mode", "fa-sun text-amber-500");
    }
  };

  const handleNavigate = (view) => {
    // Route guard
    if (view === 'admin-dashboard' && (!currentUser || currentUser.role !== 'admin')) {
      triggerToast("Access Denied", "fa-triangle-exclamation text-red-505");
      return;
    }
    if (view === 'doctor-dashboard' && (!currentUser || currentUser.role !== 'doctor')) {
      triggerToast("Access Denied", "fa-triangle-exclamation text-red-505");
      return;
    }

    setCurrentView(view);
    localStorage.setItem('dik_current_view', view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Operations
  const handleLoginSuccess = (cred) => {
    if (cred.role === 'admin') {
      setCurrentUser(cred);
      saveActiveUser(cred);
      addActivityLog("Super Admin logged in successfully.");
      triggerToast("Welcome to Super Admin Dashboard", "fa-user-shield text-green-500");
      
      // Directly set state view to bypass async state update lag
      setCurrentView('admin-dashboard');
      localStorage.setItem('dik_current_view', 'admin-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    } else {
      const inputStr = (cred.phone || '').trim().toLowerCase();
      const pinStr = (cred.pin || '').trim();

      const match = doctors.find(d => {
        const phoneMatch = d.phone && d.phone.trim() === inputStr;
        const nameMatch = d.name && d.name.trim().toLowerCase() === inputStr;
        return (phoneMatch || nameMatch) && d.pin === pinStr;
      });

      if (match) {
        if (match.isActive === false) {
          addActivityLog(`Access Denied: Blocked deactivated doctor "${match.name}"`);
          return false;
        }
        const user = { role: 'doctor', doctorId: match.id };
        setCurrentUser(user);
        saveActiveUser(user);
        addActivityLog(`Doctor logged in: ${match.name}`);
        triggerToast(`Welcome back, ${match.name}`, "fa-user-doctor text-green-500");
        
        // Directly set state view to bypass async state update lag
        setCurrentView('doctor-dashboard');
        localStorage.setItem('dik_current_view', 'doctor-dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return true;
      }
    }
    return false;
  };

  const handleLogout = () => {
    const roleName = currentUser?.role === 'admin' ? 'Admin' : 'Doctor';
    addActivityLog(`${roleName} logged out.`);
    setCurrentUser(null);
    saveActiveUser(null);
    triggerToast("Logged out successfully", "fa-circle-check text-green-500");
    handleNavigate('home');
  };

  // Voice Search Operations
  const handleVoiceSearch = () => {
    startVoiceSearch(
      () => {
        setIsListening(true);
        triggerToast("Listening...", "fa-microphone text-red-500");
      },
      (err) => {
        setIsListening(false);
        triggerToast("Voice capture error.", "fa-triangle-exclamation text-amber-500");
      },
      (transcript) => {
        setSearchQuery(transcript);
        triggerToast(`Searched: "${transcript}"`, "fa-check text-green-500");
      },
      () => {
        setIsListening(false);
      }
    );
  };

  // Footer complaint submit
  const handleContactSubmit = (name, phone, message) => {
    const newComplaint = {
      id: `complaint-${Date.now()}`,
      name,
      phone,
      message,
      time: new Date().toLocaleString()
    };
    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    saveComplaints(updated);
    addActivityLog(`Query submitted by visitor: ${name} (${phone})`);
    setIsContactOpen(false);
    triggerToast("Complaint submitted directly to Super Admin Panel.", "fa-circle-check text-green-500");
  };

  // Smart Token Generator
  const handleTokenGenerated = (patientName, patientPhone, isPrivateName) => {
    if (!selectedDoc) return;
    if (selectedDoc.isOnLeave) {
      triggerToast("Error: Doctor is currently on leave", "fa-triangle-exclamation text-red-500");
      setIsTokenOpen(false);
      return;
    }

    const docIndex = doctors.findIndex(d => d.id === selectedDoc.id);
    if (docIndex === -1) return;

    const doc = doctors[docIndex];
    const displayPatientName = isPrivateName ? "F. Patient / Token Holder" : patientName;

    let nextNum = 1;
    if (doc.queue?.length > 0) {
      nextNum = doc.queue[doc.queue.length - 1].tokenNumber + 1;
    }

    const newToken = {
      tokenNumber: nextNum,
      patientName: displayPatientName,
      patientPhone,
      registeredTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'online'
    };

    const updatedQueue = [...(doc.queue || []), newToken];
    const updatedDocs = [...doctors];
    updatedDocs[docIndex] = { ...doc, queue: updatedQueue };

    setDoctors(updatedDocs);
    saveDoctors(updatedDocs);
    addActivityLog(`Token #${newToken.tokenNumber} generated online for ${doc.name} (Patient: ${displayPatientName}).`);
    setIsTokenOpen(false);

    // Save to Token History in Local Storage
    const historyItem = {
      id: `history-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      docName: doc.name,
      specialty: doc.specialty,
      tokenNumber: newToken.tokenNumber,
      patientName: displayPatientName,
      patientPhone: newToken.patientPhone,
      registeredTime: newToken.registeredTime,
      createdAt: Date.now()
    };
    const updatedHistory = [historyItem, ...tokenHistory];
    setTokenHistory(updatedHistory);
    localStorage.setItem('dik_token_history', JSON.stringify(updatedHistory));

    // Calculate wait estimate
    let servingVal = doc.currentServing || 0;
    let diff = nextNum - servingVal - 1;
    if (diff < 0) diff = 0;
    const waitMins = diff * 15;

    setGeneratedSlip({
      docName: doc.name,
      token: newToken,
      serving: servingVal,
      wait: waitMins === 0 ? "Serving Now" : `~ ${waitMins} mins`
    });
  };

  // Doctor Dashboard Queue Operations
  const handleCallNext = (docId) => {
    const docIndex = doctors.findIndex(d => d.id === docId);
    if (docIndex === -1) return;

    const doc = doctors[docIndex];
    const current = doc.currentServing || 0;

    if (!doc.queue || doc.queue.length === 0) {
      triggerToast("Queue Empty. No patient to call.", "fa-triangle-exclamation text-amber-500");
      return;
    }

    const nextTokenNum = current + 1;
    const exist = doc.queue.find(item => item.tokenNumber === nextTokenNum);

    if (exist) {
      const updatedDocs = [...doctors];
      updatedDocs[docIndex] = { ...doc, currentServing: nextTokenNum };
      setDoctors(updatedDocs);
      saveDoctors(updatedDocs);
      addActivityLog(`${doc.name} called Token #${nextTokenNum} (${exist.patientName}) to room.`);
      triggerToast(`Calling Token #${nextTokenNum} (${exist.patientName})`, "fa-volume-high text-green-500");
    } else {
      triggerToast("All patients in queue have been called/served.", "fa-circle-check text-green-500");
    }
  };

  const handleAddWalkIn = (docId, patientName, patientPhone) => {
    const docIndex = doctors.findIndex(d => d.id === docId);
    if (docIndex === -1) return null;

    const doc = doctors[docIndex];
    let nextNum = 1;
    if (doc.queue?.length > 0) {
      nextNum = doc.queue[doc.queue.length - 1].tokenNumber + 1;
    }

    const newToken = {
      tokenNumber: nextNum,
      patientName,
      patientPhone,
      registeredTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'walk-in'
    };

    const updatedQueue = [...(doc.queue || []), newToken];
    const updatedDocs = [...doctors];
    updatedDocs[docIndex] = { ...doc, queue: updatedQueue };

    setDoctors(updatedDocs);
    saveDoctors(updatedDocs);
    addActivityLog(`${doc.name} registered walk-in Token #${newToken.tokenNumber} (${patientName}) manually.`);
    triggerToast(`Walk-in Token #${newToken.tokenNumber} registered`, "fa-check text-green-500");
    return newToken;
  };

  const handleToggleLeave = (docId) => {
    const docIndex = doctors.findIndex(d => d.id === docId);
    if (docIndex === -1) return;

    const doc = doctors[docIndex];
    const isLeave = !doc.isOnLeave;

    const updatedDocs = [...doctors];
    updatedDocs[docIndex] = { ...doc, isOnLeave: isLeave };

    setDoctors(updatedDocs);
    saveDoctors(updatedDocs);
    addActivityLog(`${doc.name} toggled Leave Status: ${isLeave ? 'On Leave' : 'Available'}`);
    triggerToast(
      isLeave ? "Status updated: ON LEAVE" : "Status updated: ACTIVE serving",
      isLeave ? "fa-circle-xmark text-red-505" : "fa-circle-check text-green-500"
    );
  };

  const handleUpdateConfig = (docId, config) => {
    const docIndex = doctors.findIndex(d => d.id === docId);
    if (docIndex === -1) return;

    const doc = doctors[docIndex];
    const updatedDocs = [...doctors];
    updatedDocs[docIndex] = { ...doc, ...config };

    setDoctors(updatedDocs);
    saveDoctors(updatedDocs);

    if (config.isDelayed !== undefined) {
      addActivityLog(`${doc.name} toggled delay status: ${config.isDelayed ? 'Delayed' : 'Serving normally'}`);
      triggerToast(config.isDelayed ? "Emergency Delay Broadcasted" : "Queue Resumed Normally", config.isDelayed ? "fa-pause text-amber-500" : "fa-play text-green-500");
    } else {
      addActivityLog(`${config.name || doc.name} updated profile & clinic configs.`);
      triggerToast("Clinic Configuration Saved", "fa-check text-green-500");
    }
  };

  const handleSkipToken = (docId) => {
    const docIndex = doctors.findIndex(d => d.id === docId);
    if (docIndex === -1) return;

    const doc = doctors[docIndex];
    const current = doc.currentServing || 0;

    if (!doc.queue || doc.queue.length === 0) {
      triggerToast("Queue Empty. No patient to skip.", "fa-triangle-exclamation text-amber-500");
      return;
    }

    const targetTokenNum = current + 1;
    const exist = doc.queue.find(item => item.tokenNumber === targetTokenNum);

    if (exist) {
      const updatedQueue = doc.queue.map(item => 
        item.tokenNumber === targetTokenNum ? { ...item, status: 'skipped' } : item
      );
      const updatedDocs = [...doctors];
      updatedDocs[docIndex] = { ...doc, currentServing: targetTokenNum, queue: updatedQueue };
      setDoctors(updatedDocs);
      saveDoctors(updatedDocs);
      addActivityLog(`${doc.name} skipped Token #${targetTokenNum} (${exist.patientName}).`);
      triggerToast(`Token #${targetTokenNum} (${exist.patientName}) marked as SKIPPED`, "fa-angles-right text-amber-500");
    } else {
      triggerToast("No current patient token is active to skip.", "fa-circle-check text-green-500");
    }
  };

  const handleMarkComplete = (docId) => {
    const docIndex = doctors.findIndex(d => d.id === docId);
    if (docIndex === -1) return;

    const doc = doctors[docIndex];
    const current = doc.currentServing || 0;

    if (!doc.queue || doc.queue.length === 0) {
      triggerToast("Queue is empty. Nothing to mark complete.", "fa-triangle-exclamation text-amber-500");
      return;
    }

    const targetTokenNum = current + 1;
    const exist = doc.queue.find(item => item.tokenNumber === targetTokenNum);

    if (exist) {
      const updatedQueue = doc.queue.map(item =>
        item.tokenNumber === targetTokenNum ? { ...item, status: 'complete' } : item
      );
      const updatedDocs = [...doctors];
      updatedDocs[docIndex] = { ...doc, currentServing: targetTokenNum, queue: updatedQueue };
      setDoctors(updatedDocs);
      saveDoctors(updatedDocs);
      addActivityLog(`${doc.name} marked Token #${targetTokenNum} (${exist.patientName}) as COMPLETE.`);
      triggerToast(`Token #${targetTokenNum} — ${exist.patientName} marked as served ✅`, "fa-circle-check text-teal-500");
    } else {
      triggerToast("No active token to mark complete.", "fa-circle-check text-green-500");
    }
  };

  const handleDeleteToken = (docId, tokenNumber) => {
    const docIndex = doctors.findIndex(d => d.id === docId);
    if (docIndex === -1) return;

    const doc = doctors[docIndex];
    const updatedQueue = (doc.queue || []).filter(item => item.tokenNumber !== tokenNumber);
    const updatedDocs = [...doctors];
    updatedDocs[docIndex] = { ...doc, queue: updatedQueue };

    setDoctors(updatedDocs);
    saveDoctors(updatedDocs);
    addActivityLog(`${doc.name} deleted patient Token #${tokenNumber}.`);
    triggerToast(`Token #${tokenNumber} deleted`, "fa-trash text-red-500");
  };

  const handleClearQueue = (docId) => {
    const docIndex = doctors.findIndex(d => d.id === docId);
    if (docIndex === -1) return;

    const doc = doctors[docIndex];
    const updatedDocs = [...doctors];
    updatedDocs[docIndex] = { ...doc, currentServing: 0, queue: [] };

    setDoctors(updatedDocs);
    saveDoctors(updatedDocs);
    addActivityLog(`${doc.name} cleared today's queue/tokens.`);
    triggerToast("Queue cleared successfully", "fa-broom text-green-500");
  };

  // Super Admin Registrations
  const handleRegisterDoctor = (details) => {
    if (details.id) {
      // Edit
      const docIndex = doctors.findIndex(d => d.id === details.id);
      if (docIndex !== -1) {
        const updated = [...doctors];
        updated[docIndex] = { ...updated[docIndex], ...details };
        setDoctors(updated);
        saveDoctors(updated);
        addActivityLog(`Admin updated Doctor access profiles: ${details.name} (Phone: ${details.phone})`);
        triggerToast(`Access profiles updated: ${details.name}`, "fa-check text-green-500");
      }
    } else {
      // New Doc
      const dup = doctors.find(d => d.phone === details.phone);
      if (dup) {
        triggerToast("Error: Phone number exists already.", "fa-triangle-exclamation text-red-500");
        return;
      }
      const newDoc = {
        ...details,
        id: `doc-${Date.now()}`,
        isOnLeave: false,
        isActive: true,
        banner: 'bg-gradient-to-r from-teal-500 to-green-500',
        currentServing: 0,
        queue: []
      };
      const updated = [...doctors, newDoc];
      setDoctors(updated);
      saveDoctors(updated);
      addActivityLog(`Admin registered new Doctor: ${details.name} (Phone: ${details.phone})`);
      triggerToast(`Doctor registration completed: ${details.name}`, "fa-check-double text-green-500");
    }
  };

  const handleToggleActive = (docId) => {
    const docIndex = doctors.findIndex(d => d.id === docId);
    if (docIndex === -1) return;

    const doc = doctors[docIndex];
    const current = doc.isActive !== false;
    const updated = [...doctors];
    updated[docIndex] = { ...doc, isActive: !current };

    setDoctors(updated);
    saveDoctors(updated);
    addActivityLog(`Admin toggled doctor ${doc.name} status: ${!current ? 'Active' : 'Inactive'}`);
    triggerToast(`${doc.name} status ${!current ? 'Enabled' : 'Disabled'}`, "fa-circle-info text-teal-505");
  };

  const handleDeleteDoctor = (docId) => {
    const doc = doctors.find(d => d.id === docId);
    if (!doc) return;

    if (confirm(`Are you sure you want to revoke credentials for ${doc.name}? All queues will be purged.`)) {
      const updated = doctors.filter(d => d.id !== docId);
      setDoctors(updated);
      saveDoctors(updated);
      addActivityLog(`Admin revoked credentials for: ${doc.name}`);
      triggerToast(`Revoked credentials for ${doc.name}`, "fa-circle-xmark text-red-500");
    }
  };

  const handleRateDoctor = (docId, ratingVal) => {
    const docIndex = doctors.findIndex(d => d.id === docId);
    if (docIndex === -1) return;
    const doc = doctors[docIndex];
    const currentRating = typeof doc.rating === 'number' ? doc.rating : 5.0;
    const count = doc.ratingCount || 1;
    const updatedAvg = parseFloat(((currentRating * count + ratingVal) / (count + 1)).toFixed(1));
    
    const updatedDocs = [...doctors];
    updatedDocs[docIndex] = {
      ...doc,
      rating: updatedAvg,
      ratingCount: count + 1
    };
    setDoctors(updatedDocs);
    saveDoctors(updatedDocs);
    addActivityLog(`User rated ${doc.name}: ${ratingVal} stars (New Avg: ${updatedAvg})`);
    triggerToast(`Thank you! Rated ${doc.name} ${ratingVal} ⭐`, "fa-star text-amber-400");
  };

  const handleDeleteComplaint = (compId) => {
    if (confirm("Delete this query?")) {
      const updated = complaints.filter(c => c.id !== compId);
      setComplaints(updated);
      saveComplaints(updated);
      triggerToast("Query deleted from inbox.", "fa-circle-xmark text-red-500");
    }
  };

  const handleClearLogs = () => {
    const cleared = ["Log Cleared."];
    setLogs(cleared);
    saveLogs(cleared);
    triggerToast("All logs wiped.", "fa-broom text-red-500");
  };

  const handleDeleteLog = (idx) => {
    const updated = logs.filter((_, i) => i !== idx);
    setLogs(updated);
    saveLogs(updated);
  };

  // Profile modal helpers
  const handleOpenProfile = (doc) => {
    setSelectedDoc(doc);
    setIsProfileOpen(true);
  };

  const handleOpenGetToken = (doc) => {
    setSelectedDoc(doc);
    setIsTokenOpen(true);
  };

  const handleOpenSpecialtiesModal = () => {
    setIsSpecialtiesOpen(true);
  };

  const activeDocObj = currentUser?.role === 'doctor' 
    ? doctors.find(d => d.id === currentUser.doctorId) 
    : null;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header 
        currentUser={currentUser} 
        navigateTo={handleNavigate} 
        logout={handleLogout} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={handleToggleDarkMode}
        onContactClick={() => setIsContactOpen(true)}
        onEmergencyClick={() => setIsEmergencyOpen(true)}
        onHistoryClick={() => setIsHistoryOpen(true)}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Pages Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'home' && (
          <HomePage 
            doctors={doctors}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedSpecialty={selectedSpecialty}
            setSelectedSpecialty={setSelectedSpecialty}
            onVoiceSearch={handleVoiceSearch}
            isListening={isListening}
            onViewProfile={handleOpenProfile}
            onGetToken={handleOpenGetToken}
            openSpecialtiesModal={handleOpenSpecialtiesModal}
            language={language}
            onRateDoctor={handleRateDoctor}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboard 
            doctors={doctors}
            logs={logs}
            complaints={complaints}
            onRegisterDoctor={handleRegisterDoctor}
            onToggleActive={handleToggleActive}
            onDeleteDoctor={handleDeleteDoctor}
            onDeleteComplaint={handleDeleteComplaint}
            onDeleteLog={handleDeleteLog}
            onClearLogs={handleClearLogs}
            navigateTo={handleNavigate}
            logout={handleLogout}
            language={language}
          />
        )}

        {currentView === 'doctor-dashboard' && activeDocObj && (
          <DoctorDashboard 
            doc={activeDocObj}
            onUpdateConfig={handleUpdateConfig}
            onToggleLeave={handleToggleLeave}
            onCallNext={handleCallNext}
            onSkipToken={handleSkipToken}
            onMarkComplete={handleMarkComplete}
            onDeleteToken={handleDeleteToken}
            onClearQueue={handleClearQueue}
            onAddWalkIn={handleAddWalkIn}
            navigateTo={handleNavigate}
            logout={handleLogout}
            language={language}
          />
        )}
      </main>

      {/* Footer */}
      <Footer 
        onLoginClick={() => setIsLoginOpen(true)}
        onContactClick={() => setIsContactOpen(true)}
        onPrivacyClick={() => setIsPrivacyOpen(true)}
        onTermsClick={() => setIsTermsOpen(true)}
        navigateTo={handleNavigate}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Modals & Dialogs */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />

      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
        onFormSubmit={handleContactSubmit}
      />

      <TokenModal 
        isOpen={isTokenOpen} 
        onClose={() => { setIsTokenOpen(false); setSelectedDoc(null); }} 
        doc={selectedDoc}
        onTokenGenerated={handleTokenGenerated}
        generatedSlip={generatedSlip}
        onCloseSlip={() => setGeneratedSlip(null)}
      />

      {/* Specialties Full Grid Modal with Icons */}
      {isSpecialtiesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-x-hidden">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-[95%] max-w-3xl mx-auto overflow-hidden text-left">
            <div className="bg-slate-50 dark:bg-slate-950 p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-850 dark:text-white tracking-tight">
                  {language === 'ur' ? 'تمام طبی مہارتیں (میڈیکل اسپیشلٹیز)' : 'All Medical Specialties'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {language === 'ur' ? 'اپنی مطلوبہ بیماری یا علاج کے مطابق ڈاکٹر منتخب کریں' : 'Select a medical field to filter active specialists'}
                </p>
              </div>
              <button 
                onClick={() => setIsSpecialtiesOpen(false)} 
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs hover:bg-red-500 hover:text-white transition-all shrink-0"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {SPECIALTIES_DATA.map(spec => (
                  <button 
                    key={spec.name}
                    onClick={() => { setSelectedSpecialty(spec.name); setIsSpecialtiesOpen(false); }}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-green-500 hover:bg-green-50/20 dark:hover:bg-slate-800 flex items-center gap-3 transition-all text-left group shadow-sm"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 group-hover:scale-110 transition-transform ${spec.bg}`}>
                      <i className={`fa-solid ${spec.icon}`}></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-green-600 dark:group-hover:text-green-400">
                        {language === 'ur' ? spec.ur : spec.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Profile Details Modal */}
      {isProfileOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-x-hidden">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-[95%] max-w-md mx-auto overflow-hidden">
            <div 
              className={`h-32 relative flex items-end p-4 ${
                selectedDoc.banner && selectedDoc.banner.startsWith('bg-') ? selectedDoc.banner : 'bg-cover bg-center'
              }`}
              style={selectedDoc.banner && selectedDoc.banner.startsWith('bg-') ? {} : { backgroundImage: `url('${selectedDoc.banner || ''}')` }}
            >
              <div className="absolute inset-0 bg-black/25"></div>
              <button 
                onClick={() => { setIsProfileOpen(false); setSelectedDoc(null); }} 
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/35 text-white flex items-center justify-center text-xs hover:bg-red-500 transition-all"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-6 space-y-5 text-left">
              <div className="flex items-center gap-3.5 -mt-14 relative z-10">
                <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl font-bold shadow-md overflow-hidden shrink-0">
                  {selectedDoc.avatar ? (
                    <img src={selectedDoc.avatar} alt={selectedDoc.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-green-500 to-teal-500 text-white">
                      {selectedDoc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                </div>
                <div className="pt-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="text-xl font-bold dark:text-slate-100">{selectedDoc.name}</h2>
                    {selectedDoc.gender === 'Female' && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-pink-100 dark:bg-pink-955 text-pink-600 dark:text-pink-400 text-[9px] font-extrabold uppercase border border-pink-200 dark:border-pink-900/30 shrink-0">
                        👩‍⚕️ Lady Specialist
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-green-605 dark:text-green-400 font-semibold">{selectedDoc.specialty}</p>
                </div>
              </div>

              {selectedDoc.isDelayed && (
                <div className="px-3.5 py-2.5 bg-amber-50 dark:bg-amber-955/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex items-center gap-2 text-xs text-amber-605 dark:text-amber-400 font-bold text-left">
                  <i className="fa-solid fa-triangle-exclamation animate-bounce text-amber-500"></i>
                  <span>{language === 'ur' ? 'ڈاکٹر فی الحال تاخیر کا شکار ہیں' : 'Doctor temporarily delayed'}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-955 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Consultation Hours</div>
                  <div className="text-xs font-bold mt-0.5 dark:text-slate-200">{selectedDoc.timings}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Consultation Fee</div>
                  <div className="text-xs font-bold text-green-600 dark:text-green-400 mt-0.5">${selectedDoc.fee}</div>
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-955 p-3 rounded-2xl border border-slate-100 dark:border-slate-850 text-xs">
                <span className="text-slate-400 font-bold"><i className="fa-solid fa-phone text-green-550 mr-1"></i>Contact Number:</span>
                <span className="font-extrabold font-mono dark:text-slate-200">
                  {selectedDoc.hidePhone ? (
                    <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider"><i className="fa-solid fa-building-user mr-0.5"></i> Contact via Clinic Desk</span>
                  ) : (
                    <span>{selectedDoc.phone}</span>
                  )}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-slate-450 tracking-wider">About & Clinic</h3>
                <p className="text-xs text-slate-655 dark:text-slate-300 leading-relaxed">
                  Highly experienced specialist providing patient-centered care. Clinic features advanced facilities, immediate laboratory tests, and convenient queue booking track via D.I.K Doctor.
                </p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-150 dark:border-slate-800">
                <button 
                  onClick={() => { setIsProfileOpen(false); setSelectedDoc(null); }} 
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all"
                >
                  Close
                </button>
                <button 
                  onClick={() => { setIsProfileOpen(false); handleOpenGetToken(selectedDoc); }} 
                  disabled={selectedDoc.isOnLeave}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1 ${
                    selectedDoc.isOnLeave 
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/10'
                  }`}
                >
                  <i className="fa-solid fa-ticket"></i> Get Token
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Helplines Modal */}
      {isEmergencyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-x-hidden">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-[95%] max-w-md mx-auto overflow-hidden text-left">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 border-b border-slate-105 dark:border-slate-850 flex justify-between items-center">
              <h2 className="text-xs font-extrabold text-red-500 dark:text-red-450 uppercase flex items-center gap-1.5">
                <i className="fa-solid fa-truck-medical animate-pulse"></i> 🚨 Emergency Helplines (D.I.K)
              </h2>
              <button 
                onClick={() => setIsEmergencyOpen(false)} 
                className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs hover:bg-red-500 hover:text-white transition-all"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500">Tap to call emergency medical support or hospital help desks directly from your device:</p>
              
              <div className="space-y-2.5">
                <a 
                  href="tel:1122" 
                  className="flex items-center justify-between p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-450 hover:bg-red-500 hover:text-white transition-all group"
                >
                  <div>
                    <span className="block text-xs font-bold">Rescue 1122 D.I.K</span>
                    <span className="block text-[10px] text-slate-400 group-hover:text-red-200">First responders & ambulance</span>
                  </div>
                  <span className="text-sm font-extrabold flex items-center gap-1"><i className="fa-solid fa-phone"></i> 1122</span>
                </a>

                <a 
                  href="tel:0966-9280100" 
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-250 hover:border-green-500 transition-all"
                >
                  <div>
                    <span className="block text-xs font-bold">DHQ Hospital Emergency Desk</span>
                    <span className="block text-[10px] text-slate-400">Main District Headquarter desk</span>
                  </div>
                  <span className="text-xs font-extrabold flex items-center gap-1"><i className="fa-solid fa-phone text-green-550"></i> 0966-9280100</span>
                </a>

                <a 
                  href="tel:0966-852600" 
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-250 hover:border-green-500 transition-all"
                >
                  <div>
                    <span className="block text-xs font-bold">Mufti Mahmud Hospital Desk</span>
                    <span className="block text-[10px] text-slate-400">Reception & Emergency Desk</span>
                  </div>
                  <span className="text-xs font-extrabold flex items-center gap-1"><i className="fa-solid fa-phone text-green-550"></i> 0966-852600</span>
                </a>

                <a 
                  href="tel:0966-9280112" 
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-250 hover:border-green-500 transition-all"
                >
                  <div>
                    <span className="block text-xs font-bold">City Hospital Desk (D.I.K)</span>
                    <span className="block text-[10px] text-slate-400">Central City ward reception desk</span>
                  </div>
                  <span className="text-xs font-extrabold flex items-center gap-1"><i className="fa-solid fa-phone text-green-550"></i> 0966-9280112</span>
                </a>

                <a 
                  href="tel:0333-9821122" 
                  className="flex items-center justify-between p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-all group"
                >
                  <div>
                    <span className="block text-xs font-bold">Local Ambulance Hotline</span>
                    <span className="block text-[10px] text-slate-400 group-hover:text-red-200">24/7 D.I.K city ambulance network</span>
                  </div>
                  <span className="text-sm font-extrabold flex items-center gap-1"><i className="fa-solid fa-phone"></i> 0333-9821122</span>
                </a>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-955 border-t border-slate-100 dark:border-slate-850 text-right">
              <button 
                onClick={() => setIsEmergencyOpen(false)} 
                className="px-4 py-2 bg-red-500 hover:bg-red-650 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                Close Dialog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-x-hidden">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-[95%] max-w-md mx-auto overflow-hidden text-left flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-slate-50 dark:bg-slate-955 p-4 sm:p-5 border-b border-slate-100 dark:border-slate-850 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xs sm:text-sm font-extrabold text-slate-500 dark:text-slate-400 uppercase">
                  {language === 'ur' ? '📜 میرے قطار ٹوکنز' : '📜 My Booked Tokens'}
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {language === 'ur' ? 'آخری 24 گھنٹے کی معلومات' : 'Booking history of last 24 hours'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { setIsHistoryOpen(false); setHistorySearch(''); }} 
                  className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs hover:bg-red-500 hover:text-white transition-all"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            {/* Search filter within drawer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-955 border-b border-slate-100 dark:border-slate-850 shrink-0">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </span>
                <input 
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder={language === 'ur' ? 'ڈاکٹر، مریض کا نام یا فون نمبر تلاش کریں...' : 'Search by doctor, patient, phone...'}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-green-500 dark:text-slate-100 text-left"
                />
              </div>
            </div>

            {/* List Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
              {tokenHistory.filter(item => {
                if (!item) return false;
                const query = historySearch.toLowerCase().trim();
                if (!query) return true;
                return (
                  (item.docName && item.docName.toLowerCase().includes(query)) ||
                  (item.patientName && item.patientName.toLowerCase().includes(query)) ||
                  (item.patientPhone && item.patientPhone.toLowerCase().includes(query)) ||
                  (item.tokenNumber && item.tokenNumber.toString().includes(query))
                );
              }).length === 0 ? (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                  <i className="fa-solid fa-folder-open text-3xl mb-2"></i>
                  <p className="text-xs font-semibold">
                    {language === 'ur' ? 'کوئی ریکارڈ نہیں ملا۔' : 'No bookings matched.'}
                  </p>
                </div>
              ) : (
                tokenHistory.filter(item => {
                  if (!item) return false;
                  const query = historySearch.toLowerCase().trim();
                  if (!query) return true;
                  return (
                    (item.docName && item.docName.toLowerCase().includes(query)) ||
                    (item.patientName && item.patientName.toLowerCase().includes(query)) ||
                    (item.patientPhone && item.patientPhone.toLowerCase().includes(query)) ||
                    (item.tokenNumber && item.tokenNumber.toString().includes(query))
                  );
                }).map(item => (
                  <div key={item.id} className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center justify-between gap-3 shadow-inner">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-205 truncate">{item.docName}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium shrink-0">{item.specialty}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 space-y-0.5">
                        <p>{language === 'ur' ? 'مریض:' : 'Patient:'} <span className="font-bold text-slate-705 dark:text-slate-300">{item.patientName}</span></p>
                        <p className="font-mono text-[9px]">{item.patientPhone}</p>
                      </div>
                    </div>
                    <div className="text-center shrink-0">
                      <span className="block text-[9px] uppercase font-bold text-slate-400 leading-none mb-1">{language === 'ur' ? 'ٹوکن نمبر' : 'Token'}</span>
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-green-500 text-white font-extrabold text-sm sm:text-base shadow shadow-green-500/10">
                        {item.tokenNumber < 10 ? `0${item.tokenNumber}` : item.tokenNumber}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-955 border-t border-slate-100 dark:border-slate-850 text-right shrink-0">
              <button 
                onClick={() => { setIsHistoryOpen(false); setHistorySearch(''); }} 
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                {language === 'ur' ? 'ٹھیک ہے' : 'Dismiss'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-x-hidden">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-[95%] max-w-md mx-auto overflow-hidden text-left">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 border-b border-slate-100 dark:border-slate-850 flex justify-between items-center">
              <h2 className="text-xs font-extrabold text-slate-500 dark:text-slate-450 uppercase">
                {language === 'ur' ? 'پرائیویسی پالیسی اور ڈیٹا کی حفاظت' : 'Privacy Policy & Data Safety'}
              </h2>
              <button 
                onClick={() => setIsPrivacyOpen(false)} 
                className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs hover:bg-red-500 hover:text-white transition-all"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-shield-halved text-green-500"></i>
                  <span>{language === 'ur' ? 'محفوظ مقامی ڈیٹا سیکیورٹی' : 'Sandboxed Data Security'}</span>
                </h3>
                <p>
                  {language === 'ur' 
                    ? 'تمام لاگز، رجسٹرڈ مریضوں کے نام، قطار کے اوقات، اور ڈاکٹروں کی ترتیب آپ کے براؤزر کے محفوظ لوکل اسٹوریج میں محفوظ رہتی ہے۔ کوئی بھی معلومات بیرونی ڈیٹا بیس پر شیئر یا اپ لوڈ نہیں کی جاتی۔' 
                    : "All logs, registered patient names, queue timelines, and doctor configurations are saved strictly within your browser's private sandbox storage (`localStorage`). No information is processed, shared, or compiled on external cloud databases."}
                </p>
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-user-lock text-green-500"></i>
                  <span>{language === 'ur' ? 'ڈیٹا عدم افشاء کی پالیسی' : 'Non-Sharing Policy'}</span>
                </h3>
                <p>
                  {language === 'ur' 
                    ? 'ہم ٹوکن کی بکنگ کے دوران فراہم کیے گئے موبائل نمبروں کی راز داری کا مکمل احترام کرتے ہیں۔ یہ معلومات صرف روزانہ سلپ بنانے اور ڈیش بورڈ کے لاگز کے لیے استعمال ہوتی ہیں۔ انہیں کبھی فروخت یا شیئر نہیں کیا جاتا۔' 
                    : 'We respect the confidentiality of mobile numbers supplied during token bookings. These parameters are used solely to generate daily slips and log dashboard audit trails. They are never sold or shared.'}
                </p>
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-circle-check text-green-500"></i>
                  <span>{language === 'ur' ? 'سیکیورٹی اور پلے اسٹور پالیسی تعمیل' : 'Play Store Policy Compliance'}</span>
                </h3>
                <p>
                  {language === 'ur' 
                    ? 'ڈی آئی کے ڈاکٹر مکمل طور پر تمام تکنیکی اور سیکیورٹی کی ہدایات پر عمل پیرا ہے۔ اس میں کوئی پوشیدہ بیک گراؤنڈ ٹریکنگ یا بلا اجازت کوکیز کا استعمال نہیں ہے۔' 
                    : 'D.I.K Doctor adheres fully to mobile platform security guidelines. There are no background telemetry collections, device location sweeps, or unauthorized cookie storage methods.'}
                </p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 text-right">
              <button 
                onClick={() => setIsPrivacyOpen(false)} 
                className="px-4 py-2 bg-green-500 text-white font-bold text-xs rounded-xl hover:bg-green-600 transition-colors shadow"
              >
                {language === 'ur' ? 'سمجھ گیا / ٹھیک ہے' : 'Understood'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-x-hidden">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-[95%] max-w-md mx-auto overflow-hidden text-left">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 border-b border-slate-100 dark:border-slate-850 flex justify-between items-center">
              <h2 className="text-xs font-extrabold text-slate-500 dark:text-slate-450 uppercase">
                {language === 'ur' ? 'سروس کی شرائط اور ہدایات' : 'Terms of Service & Guidelines'}
              </h2>
              <button 
                onClick={() => setIsTermsOpen(false)} 
                className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs hover:bg-red-500 hover:text-white transition-all"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-hourglass-half text-teal-500"></i>
                  <span>{language === 'ur' ? 'روزانہ ٹوکن کی میعاد' : 'Daily Token Queue Expiry'}</span>
                </h3>
                <p>
                  {language === 'ur' 
                    ? 'تمام اپائنٹمنٹ قطار کے نمبر صرف تاریخِ اجرا کے لیے کارآمد ہیں۔ کلینک کے اوقات ختم ہونے پر تمام قطاریں خود بخود ختم ہو جاتی ہیں۔' 
                    : 'All appointment queue numbers and serving lists are auto-incremented and valid solely for the date of generation. Timelines purge automatically at the end of clinic hours.'}
                </p>
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-clock text-teal-500"></i>
                  <span>{language === 'ur' ? 'وقت کی پابندی کی ہدایات' : 'Punctuality Guidelines'}</span>
                </h3>
                <p>
                  {language === 'ur' 
                    ? 'مریضوں سے گزارش ہے کہ وہ ہوم پیج ٹریکر پر لائیو سرونگ سٹیٹس چیک کرتے رہیں۔ برائے مہربانی اپنی باری سے کم از کم 15 منٹ پہلے کلینک پہنچیں۔' 
                    : 'Patients are requested to regularly check the Live Serving state on the home page tracker. Please plan your arrival at the clinic site at least 15 minutes before your estimated queue turn.'}
                </p>
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-hand-holding-hand text-teal-500"></i>
                  <span>{language === 'ur' ? 'خدمات اور ترتیب میں تبدیلی' : 'Serve Adjustments'}</span>
                </h3>
                <p>
                  {language === 'ur' 
                    ? 'قطار کی ترتیب، اوقات کار میں تبدیلی، اور چھٹیوں کا اعلان رجسٹرڈ ڈاکٹرز یا سپریم ایڈمن کی صوابدید پر منحصر ہے۔' 
                    : 'Queuing sequences, schedule shifts, and leave announcements are configured at the discretion of the registered medical specialists or super administrators.'}
                </p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 text-right">
              <button 
                onClick={() => setIsTermsOpen(false)} 
                className="px-4 py-2 bg-green-500 text-white font-bold text-xs rounded-xl hover:bg-green-600 transition-colors shadow"
              >
                {language === 'ur' ? 'مجھے منظور ہے' : 'I Agree'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast popup */}
      <div 
        className={`fixed bottom-4 right-4 z-50 transform transition-all duration-300 max-w-sm w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between border border-slate-800 dark:border-slate-200 ${
          toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-semibold">
          <i className={toastIcon}></i>
          <span>{toastText}</span>
        </div>
        <button onClick={() => setToastVisible(false)} className="text-xs opacity-60 hover:opacity-100">
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
}
