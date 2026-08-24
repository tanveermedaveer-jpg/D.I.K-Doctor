const INITIAL_DOCTORS = [
  {
    id: "doc-1",
    name: "Dr. Bilal DIK",
    specialty: "Cardiologist",
    timings: "09:00 AM - 01:00 PM",
    fee: 50,
    phone: "03001234567",
    pin: "1234",
    isOnLeave: false,
    isActive: true,
    banner: "bg-gradient-to-r from-teal-500 to-green-500",
    currentServing: 0,
    queue: [],
    city: "D.I.K",
    zone: "Cantt",
    rating: 0,
    ratingCount: 0
  },
  {
    id: "doc-2",
    name: "Dr. Aisha Malik",
    specialty: "Gynecologist",
    timings: "02:00 PM - 06:00 PM",
    fee: 60,
    phone: "03007654321",
    pin: "5678",
    isOnLeave: false,
    isActive: true,
    banner: "bg-gradient-to-r from-purple-600 to-pink-500",
    currentServing: 0,
    queue: [],
    city: "D.I.K",
    zone: "Muryali",
    rating: 0,
    ratingCount: 0
  },
  {
    id: "doc-3",
    name: "Dr. Haris Khan",
    specialty: "Neurologist",
    timings: "10:00 AM - 02:00 PM",
    fee: 80,
    phone: "03112223333",
    pin: "1111",
    isOnLeave: false,
    isActive: true,
    banner: "bg-gradient-to-r from-blue-600 to-cyan-500",
    currentServing: 0,
    queue: [],
    city: "D.I.K",
    zone: "Circular Road",
    rating: 0,
    ratingCount: 0
  },
  {
    id: "doc-4",
    name: "Dr. Sarah Ahmed",
    specialty: "Pediatrician",
    timings: "04:00 PM - 08:00 PM",
    fee: 45,
    phone: "03224445555",
    pin: "2222",
    isOnLeave: false,
    isActive: true,
    banner: "bg-gradient-to-r from-amber-500 to-orange-600",
    currentServing: 0,
    queue: [],
    city: "D.I.K",
    zone: "Topanwala",
    rating: 0,
    ratingCount: 0
  }
];

export const getCustomCities = () => {
  try {
    const stored = localStorage.getItem('dik_custom_cities');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse custom cities from localStorage", e);
  }
  const defaultCities = ["D.I.K", "Tank", "Lakki Marwat", "Peshawar"];
  localStorage.setItem('dik_custom_cities', JSON.stringify(defaultCities));
  return defaultCities;
};

export const saveCustomCities = (cities) => {
  try {
    localStorage.setItem('dik_custom_cities', JSON.stringify(cities));
  } catch (e) {
    console.error("Failed to save custom cities to localStorage", e);
  }
};

export const getCustomZones = () => {
  try {
    const stored = localStorage.getItem('dik_custom_zones');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse custom zones from localStorage", e);
  }
  const defaultZones = [
    { name: "Cantt", city: "D.I.K" },
    { name: "Muryali", city: "D.I.K" },
    { name: "Circular Road", city: "D.I.K" },
    { name: "Topanwala", city: "D.I.K" },
    { name: "Town Hall", city: "D.I.K" },
    { name: "Main Bazar", city: "D.I.K" },
    { name: "Main City", city: "Tank" }
  ];
  localStorage.setItem('dik_custom_zones', JSON.stringify(defaultZones));
  return defaultZones;
};

export const saveCustomZones = (zones) => {
  try {
    localStorage.setItem('dik_custom_zones', JSON.stringify(zones));
  } catch (e) {
    console.error("Failed to save custom zones to localStorage", e);
  }
};

export const getAdminCreds = () => {
  try {
    const stored = localStorage.getItem('dik_admin_creds');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.phone && parsed.password) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse admin creds from localStorage", e);
  }
  const defaults = { name: "Super Admin", phone: "03103716116", password: "Sadaf@9099" };
  localStorage.setItem('dik_admin_creds', JSON.stringify(defaults));
  return defaults;
};

export const saveAdminCreds = (creds) => {
  try {
    localStorage.setItem('dik_admin_creds', JSON.stringify(creds));
  } catch (e) {
    console.error("Failed to save admin creds to localStorage", e);
  }
};

export const getDoctors = () => {
  try {
    const stored = localStorage.getItem('dik_doctors');
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse doctors from localStorage", e);
  }
  localStorage.setItem('dik_doctors', JSON.stringify(INITIAL_DOCTORS));
  return INITIAL_DOCTORS;
};

export const saveDoctors = (doctors) => {
  try {
    localStorage.setItem('dik_doctors', JSON.stringify(doctors));
  } catch (e) {
    console.error("Failed to save doctors to localStorage", e);
  }
};

export const getLogs = () => {
  const defaultLogs = [
    "System Initialized.",
    "Super Admin credentials configured: 03103716116 / Sadaf@9099."
  ];
  try {
    const stored = localStorage.getItem('dik_logs');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse logs from localStorage", e);
  }
  localStorage.setItem('dik_logs', JSON.stringify(defaultLogs));
  return defaultLogs;
};

export const saveLogs = (logs) => {
  try {
    localStorage.setItem('dik_logs', JSON.stringify(logs));
  } catch (e) {
    console.error("Failed to save logs to localStorage", e);
  }
};

export const getComplaints = () => {
  try {
    const stored = localStorage.getItem('dik_complaints');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse complaints from localStorage", e);
  }
  return [];
};

export const saveComplaints = (complaints) => {
  try {
    localStorage.setItem('dik_complaints', JSON.stringify(complaints));
  } catch (e) {
    console.error("Failed to save complaints to localStorage", e);
  }
};

export const getActiveUser = () => {
  try {
    const stored = localStorage.getItem('dik_active_user');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse active user from localStorage", e);
  }
  return null;
};

export const saveActiveUser = (user) => {
  try {
    if (user) {
      localStorage.setItem('dik_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('dik_active_user');
    }
  } catch (e) {
    console.error("Failed to save active user to localStorage", e);
  }
};

export const getDarkMode = () => {
  return localStorage.getItem('dik_dark_mode') === 'true';
};

export const saveDarkMode = (isDark) => {
  localStorage.setItem('dik_dark_mode', String(isDark));
};
