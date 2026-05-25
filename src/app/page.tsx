'use client';

import { useEffect, useMemo, useState } from 'react';

type Nutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type Entry = {
  id: string;
  name: string;
  amount: number;
  unit: string; // 'g' or serving unit like 'cup', 'medium banana'
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string; // YYYY-MM-DD
};

type Workout = {
  id: string;
  name: string;
  duration: number; // minutes
  caloriesBurned: number;
  date: string; // YYYY-MM-DD
};

type SmtpConfig = {
  host: string;
  port: string;
  user: string;
  pass: string;
  from: string;
};

const nutritionDatabase: Record<string, Nutrition> = {
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  chicken: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  'chicken thigh': { calories: 209, protein: 24, carbs: 0, fat: 11 },
  rice: { calories: 206, protein: 4.3, carbs: 45, fat: 0.4 },
  'white rice': { calories: 206, protein: 4.3, carbs: 45, fat: 0.4 },
  'brown rice': { calories: 216, protein: 5, carbs: 45, fat: 1.8 },
  banana: { calories: 105, protein: 1.3, carbs: 27, fat: 0.3 },
  apple: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  egg: { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  milk: { calories: 42, protein: 3.4, carbs: 5, fat: 1 },
  oats: { calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
  'peanut butter': { calories: 588, protein: 25, carbs: 20, fat: 50 },
  salmon: { calories: 208, protein: 20, carbs: 0, fat: 13 },
  broccoli: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  avocado: { calories: 160, protein: 2, carbs: 8.5, fat: 14.7 },
  bread: { calories: 265, protein: 9, carbs: 49, fat: 3.2 },
  potato: { calories: 77, protein: 2, carbs: 17, fat: 0.1 },
  steak: { calories: 271, protein: 25, carbs: 0, fat: 19 },
  salad: { calories: 15, protein: 1, carbs: 3, fat: 0.2 },
  yogurt: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
  puttu: { calories: 250, protein: 5, carbs: 50, fat: 3.5 },
  'kadala curry': { calories: 146, protein: 6, carbs: 21.3, fat: 4.7 },
  appam: { calories: 240, protein: 4, carbs: 46, fat: 4 },
  'vegetable stew': { calories: 120, protein: 2, carbs: 10, fat: 8 },
  'kerala parotta': { calories: 373, protein: 8, carbs: 60, fat: 11.3 },
  'beef fry': { calories: 213, protein: 18.7, carbs: 2.7, fat: 13.3 },
  'beef roast': { calories: 213, protein: 18.7, carbs: 2.7, fat: 13.3 },
  avial: { calories: 100, protein: 2, carbs: 8, fat: 6.7 },
  sambar: { calories: 60, protein: 2.5, carbs: 9, fat: 1.5 },
  thoran: { calories: 90, protein: 2, carbs: 8, fat: 6 },
  'karimeen pollichathu': { calories: 140, protein: 16, carbs: 1.3, fat: 8 },
  'kerala fish curry': { calories: 120, protein: 12, carbs: 2.7, fat: 6.7 },
  'kappa biriyani': { calories: 180, protein: 7.2, carbs: 24, fat: 6 },
  'kappa puzhukku': { calories: 187, protein: 1.3, carbs: 41.3, fat: 2 },
  'pazham pori': { calories: 257, protein: 2.9, carbs: 45.7, fat: 7.1 },
  'banana fritters': { calories: 257, protein: 2.9, carbs: 45.7, fat: 7.1 },
  unniyappam: { calories: 367, protein: 5, carbs: 60, fat: 13.3 },
  'ada pradhaman': { calories: 213, protein: 2, carbs: 36.7, fat: 6.7 },
  idiyappam: { calories: 200, protein: 3.8, carbs: 45, fat: 0.5 },
  'egg curry': { calories: 127, protein: 8.7, carbs: 4, fat: 8 },
  'egg roast': { calories: 127, protein: 8.7, carbs: 4, fat: 8 },
  payasam: { calories: 167, protein: 2.7, carbs: 30, fat: 4 },
};

const foodServings: Record<string, { size: number; unit: string }> = {
  'chicken breast': { size: 170, unit: 'breast' },
  chicken: { size: 150, unit: 'serving' },
  'chicken thigh': { size: 100, unit: 'thigh' },
  rice: { size: 195, unit: 'cup' },
  'white rice': { size: 195, unit: 'cup' },
  'brown rice': { size: 195, unit: 'cup' },
  banana: { size: 120, unit: 'medium banana' },
  apple: { size: 182, unit: 'medium apple' },
  egg: { size: 50, unit: 'large egg' },
  milk: { size: 244, unit: 'cup' },
  oats: { size: 40, unit: 'cup (dry)' },
  'peanut butter': { size: 32, unit: 'tbsp' },
  salmon: { size: 150, unit: 'fillet' },
  broccoli: { size: 91, unit: 'cup' },
  avocado: { size: 150, unit: 'medium avocado' },
  bread: { size: 28, unit: 'slice' },
  potato: { size: 173, unit: 'medium potato' },
  steak: { size: 200, unit: 'serving' },
  salad: { size: 100, unit: 'bowl' },
  yogurt: { size: 170, unit: 'container' },
  puttu: { size: 100, unit: 'piece (100g)' },
  'kadala curry': { size: 150, unit: 'bowl (150g)' },
  appam: { size: 50, unit: 'piece (50g)' },
  'vegetable stew': { size: 150, unit: 'bowl (150g)' },
  'kerala parotta': { size: 75, unit: 'parotta (75g)' },
  'beef fry': { size: 150, unit: 'serving (150g)' },
  'beef roast': { size: 150, unit: 'serving (150g)' },
  avial: { size: 150, unit: 'cup (150g)' },
  sambar: { size: 200, unit: 'cup (200g)' },
  thoran: { size: 100, unit: 'cup (100g)' },
  'karimeen pollichathu': { size: 150, unit: 'fish (150g)' },
  'kerala fish curry': { size: 150, unit: 'bowl (150g)' },
  'kappa biriyani': { size: 250, unit: 'plate (250g)' },
  'kappa puzhukku': { size: 150, unit: 'serving (150g)' },
  'pazham pori': { size: 70, unit: 'piece (70g)' },
  'banana fritters': { size: 70, unit: 'piece (70g)' },
  unniyappam: { size: 30, unit: 'piece (30g)' },
  'ada pradhaman': { size: 150, unit: 'cup (150g)' },
  idiyappam: { size: 40, unit: 'piece (40g)' },
  'egg curry': { size: 150, unit: 'bowl (150g)' },
  'egg roast': { size: 150, unit: 'bowl (150g)' },
  payasam: { size: 150, unit: 'cup (150g)' },
};

const quickFoods = [
  { food: 'chicken breast', label: 'Chicken Breast (100g)', calories: 165 },
  { food: 'white rice', label: 'White Rice (100g)', calories: 206 },
  { food: 'banana', label: 'Banana (100g)', calories: 105 },
  { food: 'egg', label: 'Egg (100g)', calories: 155 },
];

const keralaCuisineCategories = [
  {
    category: 'Breakfast 🌅',
    items: [
      { food: 'puttu', label: 'Puttu', calories: 250, desc: 'Steamed rice cake with coconut' },
      { food: 'kadala curry', label: 'Kadala Curry', calories: 220, desc: 'Black chickpeas in coconut gravy' },
      { food: 'appam', label: 'Appam', calories: 120, desc: 'Lacy rice pancakes' },
      { food: 'vegetable stew', label: 'Vegetable Stew', calories: 180, desc: 'Mild coconut milk stew' },
      { food: 'idiyappam', label: 'Idiyappam', calories: 80, desc: 'Steamed string hoppers' },
      { food: 'egg curry', label: 'Egg Curry', calories: 190, desc: 'Kerala style egg roast' },
    ]
  },
  {
    category: 'Lunch & Dinner 🍛',
    items: [
      { food: 'kerala parotta', label: 'Kerala Parotta', calories: 280, desc: 'Layered flaky flatbread' },
      { food: 'beef fry', label: 'Beef Fry', calories: 320, desc: 'Spicy roasted beef' },
      { food: 'karimeen pollichathu', label: 'Karimeen Pollichathu', calories: 210, desc: 'Baked pearl spot fish' },
      { food: 'kerala fish curry', label: 'Kerala Fish Curry', calories: 180, desc: 'Spicy & tangy fish curry' },
      { food: 'kappa biriyani', label: 'Kappa Biriyani', calories: 450, desc: 'Mashed tapioca with beef' },
      { food: 'kappa puzhukku', label: 'Kappa Puzhukku', calories: 280, desc: 'Mashed spiced tapioca' },
    ]
  },
  {
    category: 'Traditional Sides 🥗',
    items: [
      { food: 'avial', label: 'Avial', calories: 150, desc: 'Mixed vegetables with coconut & yogurt' },
      { food: 'sambar', label: 'Sambar', calories: 120, desc: 'Tangy lentil vegetable soup' },
      { food: 'thoran', label: 'Thoran', calories: 90, desc: 'Dry cabbage/bean stir fry with coconut' },
    ]
  },
  {
    category: 'Snacks & Sweets 🍌',
    items: [
      { food: 'pazham pori', label: 'Pazham Pori', calories: 180, desc: 'Sweet banana fritters' },
      { food: 'unniyappam', label: 'Unniyappam', calories: 110, desc: 'Sweet round rice fritters' },
      { food: 'ada pradhaman', label: 'Ada Pradhaman', calories: 320, desc: 'Traditional rich jaggery payasam' },
      { food: 'payasam', label: 'Payasam', calories: 250, desc: 'Sweet milk pudding' },
    ]
  }
];

const getNutritionEstimate = (foodName: string): Nutrition => {
  const nameClean = foodName.toLowerCase().trim();
  if (nutritionDatabase[nameClean]) {
    return nutritionDatabase[nameClean];
  }
  
  // Keyword-based simple "AI" estimation
  let calories = 100;
  let protein = 5;
  let carbs = 15;
  let fat = 2;

  if (/protein|chicken|beef|meat|fish|salmon|tuna|egg|tofu|pork|turkey|steak/i.test(nameClean)) {
    calories = 200;
    protein = 25;
    carbs = 0;
    fat = 10;
  } else if (/rice|bread|pasta|oats|potato|banana|apple|fruit|sugar|sweet|berry/i.test(nameClean)) {
    calories = 150;
    protein = 3;
    carbs = 35;
    fat = 1;
  } else if (/butter|oil|avocado|cheese|nut|peanut|almond|fat|grease/i.test(nameClean)) {
    calories = 300;
    protein = 5;
    carbs = 5;
    fat = 28;
  } else if (/salad|lettuce|broccoli|cucumber|spinach|vegetable|green/i.test(nameClean)) {
    calories = 30;
    protein = 1.5;
    carbs = 5;
    fat = 0.2;
  } else {
    // Deterministic hash-based fallback so the same name always yields same result
    let hash = 0;
    for (let i = 0; i < nameClean.length; i++) {
      hash = nameClean.charCodeAt(i) + ((hash << 5) - hash);
    }
    calories = Math.abs((hash % 400) + 50);
    protein = Math.abs((hash % 30));
    carbs = Math.abs(((hash >> 2) % 60));
    fat = Math.abs(((hash >> 4) % 20));
  }

  return { calories, protein, carbs, fat };
};

const getServingInfo = (foodName: string): { size: number; unit: string } => {
  const nameClean = foodName.toLowerCase().trim();
  if (foodServings[nameClean]) {
    return foodServings[nameClean];
  }
  // Keyword-based guesses for serving sizes
  if (/chicken|breast|thigh|steak|salmon|fish|meat/i.test(nameClean)) {
    return { size: 150, unit: 'serving (150g)' };
  }
  if (/rice|oats|broccoli|salad|yogurt/i.test(nameClean)) {
    return { size: 150, unit: 'serving/cup (150g)' };
  }
  if (/banana|apple|egg|potato|avocado/i.test(nameClean)) {
    return { size: 100, unit: 'piece (100g)' };
  }
  if (/milk|juice|water/i.test(nameClean)) {
    return { size: 240, unit: 'cup/glass (240g)' };
  }
  if (/bread|slice/i.test(nameClean)) {
    return { size: 25, unit: 'slice (25g)' };
  }
  if (/puttu|appam|parotta|idiyappam|fritter|unniyappam/i.test(nameClean)) {
    return { size: 75, unit: 'piece (75g)' };
  }
  if (/curry|stew|sambar|avial|thoran|puzhukku|payasam|pradhaman/i.test(nameClean)) {
    return { size: 150, unit: 'serving (150g)' };
  }
  return { size: 100, unit: 'serving (100g)' };
};

const formatNumber = (num: number, decimals = 1): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

const getTodayDateString = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const formatDate = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getDaysInMonth = (dateString: string): string[] => {
  if (!dateString) return [];
  const [yearStr, monthStr] = dateString.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  
  const date = new Date(year, month - 1, 1);
  const days: string[] = [];
  while (date.getMonth() === month - 1) {
    days.push(formatDate(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const getFirstDayOfWeekIndex = (dateString: string): number => {
  if (!dateString) return 0;
  const [yearStr, monthStr] = dateString.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const date = new Date(year, month - 1, 1);
  return date.getDay();
};

const getMonthYearLabel = (dateString: string): string => {
  if (!dateString) return '';
  const [yearStr, monthStr] = dateString.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(100);
  const [unitMode, setUnitMode] = useState<'g' | 'serving'>('g');
  const [message, setMessage] = useState('Enter a food name to see nutrition estimates.');
  const [mounted, setMounted] = useState(false);

  // Date selections & Goal Setting
  const [selectedDate, setSelectedDate] = useState('');
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2000);

  // Guide tab & Interactive Leaf portion states
  const [activeGuideTab, setActiveGuideTab] = useState<'standard' | 'kerala'>('standard');
  const [selectedLeafPortion, setSelectedLeafPortion] = useState<string | null>(null);

  // Suggestions state
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Auth State
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authState, setAuthState] = useState<'email' | 'otp'>('email');
  const [authEmail, setAuthEmail] = useState('');
  const [authOtpInput, setAuthOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [authError, setAuthError] = useState('');
  const [mockOtpMessage, setMockOtpMessage] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState<string[]>([]);

  // Load User Data helper
  const loadUserData = (email: string) => {
    const savedEntries = localStorage.getItem(`nutriflux_entries_${email}`);
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (e) {
        setEntries([]);
      }
    } else {
      setEntries([]);
    }

    const savedGoal = localStorage.getItem(`nutriflux_goal_${email}`);
    if (savedGoal) {
      const g = Number(savedGoal);
      setDailyCalorieGoal(g > 0 ? g : 2000);
    } else {
      setDailyCalorieGoal(2000);
    }
  };

  useEffect(() => {
    // Load registered users list
    const savedUsers = localStorage.getItem('nutriflux_users');
    if (savedUsers) {
      try {
        setRegisteredUsers(JSON.parse(savedUsers));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Seed default user for testing
      const defaultUsers = ['demo@nutriflux.com'];
      localStorage.setItem('nutriflux_users', JSON.stringify(defaultUsers));
      setRegisteredUsers(defaultUsers);

      const today = getTodayDateString();
      const demoEntries = [
        {
          id: 'demo-1',
          name: 'banana',
          amount: 1,
          unit: 'medium banana',
          grams: 120,
          calories: 105,
          protein: 1.3,
          carbs: 27,
          fat: 0.3,
          date: today,
        },
        {
          id: 'demo-2',
          name: 'white rice',
          amount: 1,
          unit: 'cup',
          grams: 195,
          calories: 401.7,
          protein: 8.38,
          carbs: 87.75,
          fat: 0.78,
          date: today,
        },
        {
          id: 'demo-3',
          name: 'chicken breast',
          amount: 200,
          unit: 'g',
          grams: 200,
          calories: 330,
          protein: 62,
          carbs: 0,
          fat: 7.2,
          date: today,
        }
      ];
      localStorage.setItem('nutriflux_entries_demo@nutriflux.com', JSON.stringify(demoEntries));
      localStorage.setItem('nutriflux_goal_demo@nutriflux.com', '2000');
    }

    // Load active session
    const activeUser = localStorage.getItem('nutriflux_current_user');
    if (activeUser) {
      setCurrentUser(activeUser);
      loadUserData(activeUser);
    }

    setSelectedDate(getTodayDateString());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && currentUser) {
      localStorage.setItem(`nutriflux_entries_${currentUser}`, JSON.stringify(entries));
    }
  }, [entries, currentUser, mounted]);

  useEffect(() => {
    if (mounted && currentUser) {
      localStorage.setItem(`nutriflux_goal_${currentUser}`, String(dailyCalorieGoal));
    }
  }, [dailyCalorieGoal, currentUser, mounted]);

  // Auth Operations
  const handleSendOtp = () => {
    setAuthError('');
    setMockOtpMessage('');
    const emailClean = authEmail.trim().toLowerCase();

    if (!emailClean) {
      setAuthError('Please enter a valid email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
      setAuthError('Please enter a valid email format');
      return;
    }

    if (authMode === 'signin') {
      if (!registeredUsers.includes(emailClean)) {
        setAuthError('No account found with this email. Please click "Create Account" first.');
        return;
      }
    } else {
      if (registeredUsers.includes(emailClean)) {
        setAuthError('This email is already registered. Please click "Sign In" instead.');
        return;
      }
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setMockOtpMessage(`OTP verification code: ${code}`);
    setAuthState('otp');
    setAuthOtpInput('');
  };

  const handleVerifyOtp = () => {
    setAuthError('');
    const emailClean = authEmail.trim().toLowerCase();

    if (authOtpInput.trim() !== generatedOtp) {
      setAuthError('Incorrect OTP code. Please try again.');
      return;
    }

    if (authMode === 'signup') {
      const updatedUsers = [...registeredUsers, emailClean];
      localStorage.setItem('nutriflux_users', JSON.stringify(updatedUsers));
      setRegisteredUsers(updatedUsers);

      const today = getTodayDateString();
      const sampleEntries = [
        {
          id: Date.now().toString() + 's1',
          name: 'apple',
          amount: 1,
          unit: 'medium apple',
          grams: 182,
          calories: 95,
          protein: 0.5,
          carbs: 25,
          fat: 0.3,
          date: today,
        },
        {
          id: Date.now().toString() + 's2',
          name: 'oats',
          amount: 1,
          unit: 'cup (dry)',
          grams: 40,
          calories: 155,
          protein: 6.8,
          carbs: 26.5,
          fat: 2.8,
          date: today,
        }
      ];
      localStorage.setItem(`nutriflux_entries_${emailClean}`, JSON.stringify(sampleEntries));
      localStorage.setItem(`nutriflux_goal_${emailClean}`, '2000');
    }

    localStorage.setItem('nutriflux_current_user', emailClean);
    setCurrentUser(emailClean);
    loadUserData(emailClean);

    setAuthEmail('');
    setAuthOtpInput('');
    setGeneratedOtp('');
    setMockOtpMessage('');
    setAuthState('email');
  };

  const handleLogout = () => {
    localStorage.removeItem('nutriflux_current_user');
    setCurrentUser(null);
    setEntries([]);
    setDailyCalorieGoal(2000);
  };

  // Date Navigation handlers
  const handlePrevDay = () => {
    if (!selectedDate) return;
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() - 1);
    setSelectedDate(formatDate(date));
  };

  const handleNextDay = () => {
    if (!selectedDate) return;
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 1);
    setSelectedDate(formatDate(date));
  };

  const handleGoToToday = () => {
    setSelectedDate(getTodayDateString());
  };

  // Switch between weight (g) and custom serving (piece, cup, etc.)
  const handleUnitModeChange = (mode: 'g' | 'serving') => {
    setUnitMode(mode);
    if (mode === 'serving') {
      setAmount(1);
    } else {
      setAmount(100);
    }
  };

  // Estimations & Totals
  const baseEstimate = useMemo(() => {
    return getNutritionEstimate(name);
  }, [name]);

  const isFoodAvailable = useMemo(() => {
    const query = name.toLowerCase().trim();
    return Object.prototype.hasOwnProperty.call(nutritionDatabase, query);
  }, [name]);

  const filteredSuggestions = useMemo(() => {
    const query = name.toLowerCase().trim();
    if (!query) return [];
    return Object.keys(nutritionDatabase).filter((key) =>
      key.includes(query)
    );
  }, [name]);

  const servingInfo = useMemo(() => {
    return getServingInfo(name);
  }, [name]);

  const calculatedGrams = useMemo(() => {
    if (unitMode === 'g') {
      return amount;
    } else {
      return amount * servingInfo.size;
    }
  }, [amount, unitMode, servingInfo]);

  const calories = name.trim() ? (baseEstimate.calories * calculatedGrams) / 100 : 0;
  const protein = name.trim() ? (baseEstimate.protein * calculatedGrams) / 100 : 0;
  const carbs = name.trim() ? (baseEstimate.carbs * calculatedGrams) / 100 : 0;
  const fat = name.trim() ? (baseEstimate.fat * calculatedGrams) / 100 : 0;

  const activeEntries = useMemo(() => {
    if (!selectedDate) return [];
    return entries.filter((e) => e.date === selectedDate);
  }, [entries, selectedDate]);

  const totals = useMemo(() => {
    return activeEntries.reduce(
      (acc, entry) => {
        acc.calories += entry.calories;
        acc.protein += entry.protein;
        acc.carbs += entry.carbs;
        acc.fat += entry.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [activeEntries]);

  // Group days of current month for Monthly Report
  const monthlyDaysData = useMemo(() => {
    const targetDate = selectedDate || getTodayDateString();
    const days = getDaysInMonth(targetDate);
    
    const dailyMap: Record<
      string,
      { calories: number; protein: number; carbs: number; fat: number; hasLogs: boolean }
    > = {};

    days.forEach((day) => {
      dailyMap[day] = { calories: 0, protein: 0, carbs: 0, fat: 0, hasLogs: false };
    });

    entries.forEach((entry) => {
      if (dailyMap[entry.date] !== undefined) {
        dailyMap[entry.date].calories += entry.calories;
        dailyMap[entry.date].protein += entry.protein;
        dailyMap[entry.date].carbs += entry.carbs;
        dailyMap[entry.date].fat += entry.fat;
        dailyMap[entry.date].hasLogs = true;
      }
    });

    return days.map((day) => ({
      date: day,
      ...dailyMap[day],
    }));
  }, [entries, selectedDate]);

  const loggedDays = useMemo(() => {
    return monthlyDaysData.filter((d) => d.hasLogs);
  }, [monthlyDaysData]);

  const averageCalories = useMemo(() => {
    if (loggedDays.length === 0) return 0;
    return loggedDays.reduce((sum, d) => sum + d.calories, 0) / loggedDays.length;
  }, [loggedDays]);

  const adherenceRate = useMemo(() => {
    if (loggedDays.length === 0) return 0;
    const adhered = loggedDays.filter((d) => d.calories <= dailyCalorieGoal);
    return (adhered.length / loggedDays.length) * 100;
  }, [loggedDays, dailyCalorieGoal]);

  const averageMacros = useMemo(() => {
    if (loggedDays.length === 0) return { protein: 0, carbs: 0, fat: 0 };
    return {
      protein: loggedDays.reduce((sum, d) => sum + d.protein, 0) / loggedDays.length,
      carbs: loggedDays.reduce((sum, d) => sum + d.carbs, 0) / loggedDays.length,
      fat: loggedDays.reduce((sum, d) => sum + d.fat, 0) / loggedDays.length,
    };
  }, [loggedDays]);

  // Operations
  const handleAdd = () => {
    if (!name.trim()) {
      setMessage('Please enter a food name');
      return;
    }
    if (amount <= 0) {
      setMessage(`Please enter a valid ${unitMode === 'g' ? 'weight in grams' : 'number of servings'}`);
      return;
    }

    const newEntry: Entry = {
      id: Date.now().toString() + Math.random().toString(),
      name: name.trim(),
      amount: amount,
      unit: unitMode === 'g' ? 'g' : servingInfo.unit,
      grams: calculatedGrams,
      calories: calories,
      protein: protein,
      carbs: carbs,
      fat: fat,
      date: selectedDate || getTodayDateString(),
    };

    setEntries((prev) => [newEntry, ...prev]);
    setName('');
    setAmount(unitMode === 'g' ? 100 : 1);
    setMessage(`Successfully added "${newEntry.name}"!`);
  };

  const handleRemove = (id: string) => {
    const removed = entries.find((e) => e.id === id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (removed) {
      setMessage(`Removed "${removed.name}"`);
    }
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-slate-400 font-bold italic animate-pulse">Loading NutriFlux...</div>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-[#fafafa] text-slate-800 p-4 sm:p-8 flex items-center justify-center relative overflow-hidden">
        {/* Neon Aurora Blur Background */}
        <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-400/20 blur-[130px] pointer-events-none z-0" />
        <div className="absolute bottom-[20%] right-[-10%] w-[550px] h-[550px] rounded-full bg-fuchsia-400/25 blur-[140px] pointer-events-none z-0" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-emerald-400/15 blur-[100px] pointer-events-none z-0" />

        <div className="w-full max-w-md relative z-10 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-5xl font-black italic bg-gradient-to-r from-cyan-600 via-blue-600 to-fuchsia-600 bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(6,182,212,0.2)]"
              style={{ fontFamily: 'Poppins' }}
            >
              NutriFlux
            </h1>
            <p
              className="text-sm text-slate-500 italic mt-2 font-semibold"
              style={{ fontFamily: 'DM Sans' }}
            >
              Personalized AI Calorie & Macro Tracker
            </p>
          </div>

          {/* Mock OTP Delivery Toast Banner */}
          {mockOtpMessage && (
            <div className="mb-4 rounded-xl border border-cyan-200 bg-cyan-50/80 backdrop-blur-md p-4 text-xs font-semibold text-cyan-800 shadow-lg animate-bounce flex items-start gap-2.5">
              <span className="text-lg">📧</span>
              <div className="flex-1">
                <div className="font-bold text-cyan-900">Demo Mailer Notification</div>
                <div className="mt-0.5 leading-relaxed font-mono select-all bg-white/60 p-2 rounded border border-cyan-100 mt-1 cursor-pointer" title="Double click to copy code">
                  {mockOtpMessage}
                </div>
                <div className="text-[10px] text-cyan-600 mt-1.5 italic font-medium">Click code to highlight and copy. Paste it below to log in!</div>
              </div>
            </div>
          )}

          {/* Auth Card Container */}
          <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 sm:p-8 border border-slate-200/80 shadow-2xl shadow-slate-100">
            {/* Tabs */}
            {authState === 'email' && (
              <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200/50">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthError('');
                  }}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    authMode === 'signin'
                      ? 'bg-white text-slate-800 shadow-sm border border-slate-200/40'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  style={{ fontFamily: 'Poppins' }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthError('');
                  }}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    authMode === 'signup'
                      ? 'bg-white text-slate-800 shadow-sm border border-slate-200/40'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  style={{ fontFamily: 'Poppins' }}
                >
                  Create Account
                </button>
              </div>
            )}

            <h2
              className="text-xl sm:text-2xl font-black italic text-slate-800 mb-2"
              style={{ fontFamily: 'Poppins' }}
            >
              {authState === 'email'
                ? authMode === 'signin'
                  ? 'Welcome Back'
                  : 'Get Started'
                : 'Enter OTP Code'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold italic mb-6">
              {authState === 'email'
                ? authMode === 'signin'
                  ? 'Sign in to access your custom calorie and macro trackers.'
                  : 'Create a new profile. Ready-to-go dummy logs will be seeded.'
                : `We sent a 6-digit OTP code to ${authEmail}.`}
            </p>

            {authError && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-150 p-3 text-xs font-bold text-red-600">
                ⚠️ {authError}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); authState === 'email' ? handleSendOtp() : handleVerifyOtp(); }}>
              {authState === 'email' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold italic text-slate-500 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="e.g. demo@nutriflux.com"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 outline-none focus:border-cyan-500 transition text-sm shadow-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold shadow-lg shadow-cyan-500/10 active:scale-95 transition-all py-3.5 text-center italic text-sm"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    {authMode === 'signin' ? 'Send OTP Code ➔' : 'Register Email ➔'}
                  </button>
                  
                  {authMode === 'signin' && (
                    <div className="mt-4 text-center">
                      <span className="text-xs text-slate-400 font-medium">Quick Demo Account: </span>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthEmail('demo@nutriflux.com');
                          setAuthMode('signin');
                        }}
                        className="text-xs text-cyan-600 hover:underline font-bold"
                      >
                        demo@nutriflux.com
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold italic text-slate-500 uppercase tracking-wider mb-2">
                      6-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      pattern="\d{6}"
                      value={authOtpInput}
                      onChange={(e) => setAuthOtpInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 123456"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-lg font-black tracking-widest text-slate-800 placeholder-slate-300 outline-none focus:border-cyan-500 transition shadow-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold shadow-lg shadow-emerald-500/10 active:scale-95 transition-all py-3.5 text-center italic text-sm"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    Verify & Sign In ✓
                  </button>

                  <div className="flex items-center justify-between text-xs font-bold italic mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthState('email');
                        setAuthError('');
                      }}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ← Edit Email
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-cyan-600 hover:text-cyan-700"
                    >
                      Resend Code ⟳
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] text-slate-800 p-4 sm:p-8 relative overflow-hidden">
      {/* Light Neon Aurora Blur Blobs in Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-400/20 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[550px] h-[550px] rounded-full bg-fuchsia-400/25 blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-emerald-400/15 blur-[100px] pointer-events-none z-0" />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1
              className="text-4xl sm:text-5xl font-black italic bg-gradient-to-r from-cyan-600 via-blue-600 to-fuchsia-600 bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(6,182,212,0.2)]"
              style={{ fontFamily: 'Poppins' }}
            >
              NutriFlux
            </h1>
            <p
              className="text-xs sm:text-sm text-slate-500 italic mt-1 font-semibold"
              style={{ fontFamily: 'DM Sans' }}
            >
              AI food tracker with daily nutrition totals and meal logging.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-sm self-start sm:self-auto">
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" style={{ fontFamily: 'Poppins' }}>Logged in as</p>
              <p className="text-xs font-black text-slate-700 truncate max-w-[150px] sm:max-w-[200px]" style={{ fontFamily: 'DM Sans' }} title={currentUser}>
                {currentUser}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-150 px-3 py-1.5 text-xs font-black italic text-red-650 text-red-600 hover:text-red-700 transition active:scale-95 shadow-sm"
              style={{ fontFamily: 'Poppins' }}
            >
              Logout ➔
            </button>
          </div>
        </div>

        {/* Date Selector & Calorie Goal Bar */}
        {mounted && (
          <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white/60 backdrop-blur-md p-4 sm:p-6 sm:flex-row sm:items-center sm:justify-between border border-slate-200/80 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
              <span
                className="text-sm font-semibold italic text-slate-500 hidden sm:inline"
                style={{ fontFamily: 'Poppins' }}
              >
                Log Date:
              </span>
              <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  onClick={handlePrevDay}
                  className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 transition active:scale-95 shadow-sm"
                  title="Previous Day"
                >
                  ◀
                </button>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-cyan-500 flex-1 sm:flex-none shadow-sm"
                />
                <button
                  onClick={handleNextDay}
                  className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 transition active:scale-95 shadow-sm"
                  title="Next Day"
                >
                  ▶
                </button>
              </div>
              <button
                onClick={handleGoToToday}
                className="rounded-lg bg-cyan-600 border border-cyan-500/20 px-4 py-2 text-xs font-black italic text-cyan-50 hover:bg-cyan-700 transition w-full sm:w-auto text-center shadow-md shadow-cyan-500/10"
                style={{ fontFamily: 'Poppins' }}
              >
                Today
              </button>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t border-slate-200/80 sm:border-t-0 pt-3 sm:pt-0">
              <label
                className="flex items-center justify-between sm:justify-end gap-2 text-sm font-semibold italic text-slate-500 w-full sm:w-auto"
                style={{ fontFamily: 'Poppins' }}
              >
                <span>Daily Calorie Goal:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={500}
                    max={10000}
                    step={50}
                    value={dailyCalorieGoal}
                    onChange={(e) => setDailyCalorieGoal(Number(e.target.value))}
                    className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-center text-sm font-bold text-cyan-600 focus:outline-none focus:border-cyan-500 shadow-sm"
                  />
                  <span className="text-xs text-slate-400 not-italic">kcal</span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Totals Section */}
        {mounted && (
          <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-cyan-50/50 backdrop-blur-sm p-4 sm:p-6 col-span-2 sm:col-span-1 border border-cyan-200/60 shadow-[0_0_20px_rgba(6,182,212,0.06)]">
              <p
                className="text-xs sm:text-sm font-bold italic text-cyan-600 uppercase tracking-wider"
                style={{ fontFamily: 'Poppins' }}
              >
                Calories
              </p>
              <div className="flex items-baseline gap-2">
                <p
                  className="mt-1 sm:mt-2 text-3xl sm:text-4xl font-black text-cyan-700 filter drop-shadow-[0_0_6px_rgba(6,182,212,0.15)]"
                  style={{ fontFamily: 'Poppins' }}
                >
                  {formatNumber(totals.calories, 0)}
                </p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-semibold italic">
                  / {dailyCalorieGoal} kcal
                </p>
              </div>
              <div className="w-full bg-cyan-100/85 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    totals.calories > dailyCalorieGoal 
                      ? 'bg-red-500' 
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${Math.min((totals.calories / dailyCalorieGoal) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="rounded-xl bg-emerald-50/50 backdrop-blur-sm p-4 sm:p-6 border border-emerald-200/60 shadow-[0_0_20px_rgba(16,185,129,0.06)]">
              <p
                className="text-xs sm:text-sm font-bold italic text-emerald-600 uppercase tracking-wider"
                style={{ fontFamily: 'Poppins' }}
              >
                Protein
              </p>
              <p
                className="mt-1 sm:mt-2 text-3xl sm:text-4xl font-black text-emerald-700 filter drop-shadow-[0_0_6px_rgba(16,185,129,0.15)]"
                style={{ fontFamily: 'Poppins' }}
              >
                {formatNumber(totals.protein)}g
              </p>
            </div>
            <div className="rounded-xl bg-amber-50/50 backdrop-blur-sm p-4 sm:p-6 border border-amber-200/60 shadow-[0_0_20px_rgba(245,158,11,0.06)]">
              <p
                className="text-xs sm:text-sm font-bold italic text-amber-600 uppercase tracking-wider"
                style={{ fontFamily: 'Poppins' }}
              >
                Carbs
              </p>
              <p
                className="mt-1 sm:mt-2 text-3xl sm:text-4xl font-black text-amber-700 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.15)]"
                style={{ fontFamily: 'Poppins' }}
              >
                {formatNumber(totals.carbs)}g
              </p>
            </div>
            <div className="rounded-xl bg-fuchsia-50/50 backdrop-blur-sm p-4 sm:p-6 border border-fuchsia-200/60 shadow-[0_0_20px_rgba(217,70,239,0.06)]">
              <p
                className="text-xs sm:text-sm font-bold italic text-fuchsia-600 uppercase tracking-wider"
                style={{ fontFamily: 'Poppins' }}
              >
                Fat
              </p>
              <p
                className="mt-1 sm:mt-2 text-3xl sm:text-4xl font-black text-fuchsia-700 filter drop-shadow-[0_0_6px_rgba(217,70,239,0.15)]"
                style={{ fontFamily: 'Poppins' }}
              >
                {formatNumber(totals.fat)}g
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Add Food Section */}
          <div className="rounded-xl bg-white/60 backdrop-blur-md p-5 sm:p-8 border border-slate-200/80 shadow-lg">
            <h2
              className="text-2xl sm:text-3xl font-black italic text-slate-800"
              style={{ fontFamily: 'Poppins' }}
            >
              Add Food
            </h2>
            <p
              className="mt-1 text-sm text-slate-500 italic font-semibold"
              style={{ fontFamily: 'DM Sans' }}
            >
              Enter a food name and size
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="block relative">
                <span
                  className="text-sm font-semibold italic text-slate-600"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Food name
                </span>
                <input
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 outline-none focus:border-cyan-500 transition text-sm sm:text-base shadow-sm"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="e.g. banana, rice, chicken"
                />

                {/* Suggestions Dropdown */}
                {showSuggestions && name.trim() !== '' && filteredSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 z-30 mt-1 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl py-1 divide-y divide-slate-100 animate-fade-in">
                    {filteredSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          setName(suggestion);
                          setShowSuggestions(false);
                          setMessage(`Selected ${suggestion}`);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 font-bold transition flex items-center justify-between"
                      >
                        <span>{suggestion}</span>
                        <span className="text-[10px] text-cyan-600 font-black font-mono">
                          ~{nutritionDatabase[suggestion].calories} kcal/100g
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="block">
                <span
                  className="text-sm font-semibold italic text-slate-600 flex items-center justify-between"
                  style={{ fontFamily: 'Poppins' }}
                >
                  <span>Measure by</span>
                  <div className="flex gap-0.5 bg-slate-100 p-0.5 rounded-md text-[10px] sm:text-xs not-italic border border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleUnitModeChange('g')}
                      className={`px-2.5 py-1 rounded-sm font-semibold transition ${
                        unitMode === 'g' 
                          ? 'bg-white text-slate-800 shadow-sm border border-slate-200/40' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Weight (g)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUnitModeChange('serving')}
                      className={`px-2.5 py-1 rounded-sm font-semibold transition ${
                        unitMode === 'serving' 
                          ? 'bg-white text-slate-800 shadow-sm border border-slate-200/40' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Serving Unit
                    </button>
                  </div>
                </span>

                <div className="mt-2 flex rounded-lg border border-slate-200 bg-white overflow-hidden focus-within:border-cyan-500 transition shadow-sm">
                  <input
                    className="w-full px-4 py-3 bg-transparent text-slate-800 placeholder-slate-400 outline-none text-sm sm:text-base"
                    type="number"
                    min={unitMode === 'g' ? 1 : 0.1}
                    step={unitMode === 'g' ? 1 : 0.1}
                    value={amount}
                    onChange={(event) => setAmount(Number(event.target.value))}
                  />
                  <div className="bg-slate-50 px-3 flex items-center justify-center text-xs sm:text-sm font-bold text-slate-500 border-l border-slate-200 select-none whitespace-nowrap min-w-[95px] max-w-[120px] text-ellipsis overflow-hidden">
                    {unitMode === 'g' ? 'g' : servingInfo.unit}
                  </div>
                </div>
                {unitMode === 'serving' && name.trim() && (
                  <p className="mt-1 text-[11px] text-slate-400 italic font-medium">
                    = {formatNumber(calculatedGrams)} grams total ({servingInfo.size}g per {servingInfo.unit})
                  </p>
                )}
              </div>
            </div>

            {/* Nutrition Estimate */}
            <div className="mt-6 rounded-lg bg-slate-50 p-4 sm:p-6 border border-slate-200/60 shadow-inner">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <p
                  className="text-xs sm:text-sm font-semibold italic text-slate-500"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Nutrition Estimate
                </p>
                {name.trim() && (
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all ${
                    isFoodAvailable 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {isFoodAvailable ? '✓ Verified In Database' : '⚠️ Food Item Not Available in List (Estimating)'}
                  </span>
                )}
              </div>
              <div className="mt-4 grid gap-3 grid-cols-2">
                <div className="rounded-lg bg-cyan-50 border border-cyan-100 p-3 sm:p-4">
                  <p
                    className="text-xs italic text-cyan-600 font-bold"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    Calories
                  </p>
                  <p
                    className="mt-1 text-xl sm:text-2xl font-black text-cyan-700 filter drop-shadow-[0_0_4px_rgba(6,182,212,0.1)]"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    {formatNumber(calories, 0)}
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 sm:p-4">
                  <p
                    className="text-xs italic text-emerald-600 font-bold"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    Protein
                  </p>
                  <p
                    className="mt-1 text-xl sm:text-2xl font-black text-emerald-700 filter drop-shadow-[0_0_4px_rgba(16,185,129,0.1)]"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    {formatNumber(protein)}g
                  </p>
                </div>
                <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 sm:p-4">
                  <p
                    className="text-xs italic text-amber-600 font-bold"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    Carbs
                  </p>
                  <p
                    className="mt-1 text-xl sm:text-2xl font-black text-amber-700 filter drop-shadow-[0_0_4px_rgba(245,158,11,0.1)]"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    {formatNumber(carbs)}g
                  </p>
                </div>
                <div className="rounded-lg bg-fuchsia-50 border border-fuchsia-100 p-3 sm:p-4">
                  <p
                    className="text-xs italic text-fuchsia-600 font-bold"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    Fat
                  </p>
                  <p
                    className="mt-1 text-xl sm:text-2xl font-black text-fuchsia-700 filter drop-shadow-[0_0_4px_rgba(217,70,239,0.1)]"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    {formatNumber(fat)}g
                  </p>
                </div>
              </div>
            </div>

            {/* Add Button */}
            <button
              type="button"
              onClick={handleAdd}
              className="mt-6 w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] active:scale-95 transition-all py-3 text-center italic text-sm sm:text-base"
              style={{ fontFamily: 'Poppins' }}
            >
              Add to Log
            </button>

            {/* Message */}
            <p
              className="mt-4 text-xs sm:text-sm italic text-slate-500"
              style={{ fontFamily: 'DM Sans' }}
            >
              {message}
            </p>

            {/* Quick Foods Guide */}
            <div className="mt-6 rounded-lg border border-slate-200/80 p-4 sm:p-6 bg-slate-50/50">
              {/* Tab Switcher */}
              <div className="flex bg-slate-200/60 p-1 rounded-xl mb-4 border border-slate-200/50">
                <button
                  type="button"
                  onClick={() => setActiveGuideTab('standard')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeGuideTab === 'standard'
                      ? 'bg-white text-slate-800 shadow-sm border border-slate-200/40'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  style={{ fontFamily: 'Poppins' }}
                >
                  Standard Foods
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGuideTab('kerala')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                    activeGuideTab === 'kerala'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm border border-emerald-500/20'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  style={{ fontFamily: 'Poppins' }}
                >
                  Kerala Cuisine Hub 🌴
                </button>
              </div>

              {activeGuideTab === 'standard' ? (
                <>
                  <h3
                    className="font-black italic text-slate-800 text-sm sm:text-base"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    Quick Reference
                  </h3>
                  <p
                    className="mt-1 text-xs text-slate-400 italic"
                    style={{ fontFamily: 'DM Sans' }}
                  >
                    Click a food to select it quickly
                  </p>
                  <div className="mt-4 grid gap-2 grid-cols-2">
                    {quickFoods.map((item) => (
                      <button
                        key={item.food}
                        type="button"
                        onClick={() => {
                          setName(item.food);
                          setUnitMode('serving');
                          setAmount(1);
                          setMessage(`Selected ${item.label}`);
                        }}
                        className="rounded-lg bg-white hover:bg-slate-100 border border-slate-200 shadow-sm p-2.5 sm:p-3 text-left transition focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs sm:text-sm text-slate-700 font-semibold"
                      >
                        <div className="truncate text-slate-800">
                          {item.label}
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 font-normal">
                          ~{item.calories} kcal
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className="font-black italic text-emerald-800 text-sm sm:text-base flex items-center gap-1.5"
                        style={{ fontFamily: 'Poppins' }}
                      >
                        Kerala Food Explorer 🌴
                      </h3>
                      <p
                        className="text-[11px] text-emerald-600/80 italic font-semibold"
                        style={{ fontFamily: 'DM Sans' }}
                      >
                        Select from traditional Kerala dishes
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                    {keralaCuisineCategories.map((cat) => (
                      <div key={cat.category} className="space-y-2">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">{cat.category}</h4>
                        <div className="grid gap-2 grid-cols-2">
                          {cat.items.map((item) => (
                            <button
                              key={item.food}
                              type="button"
                              onClick={() => {
                                setName(item.food);
                                setUnitMode('serving');
                                setAmount(1);
                                setMessage(`Selected Kerala Special: ${item.label}`);
                              }}
                              className="rounded-lg bg-white hover:bg-emerald-50/30 border border-slate-200 hover:border-emerald-200 shadow-sm p-2.5 text-left transition focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs text-slate-700 font-semibold flex flex-col justify-between"
                              title={item.desc}
                            >
                              <div className="truncate text-slate-800 font-black">
                                {item.label}
                              </div>
                              <div className="text-[9px] text-slate-400 font-medium truncate mt-0.5 leading-tight">
                                {item.desc}
                              </div>
                              <div className="text-[10px] text-emerald-600 font-black mt-1.5 font-mono">
                                ~{item.calories} kcal
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Food Log Section */}
          <div className="rounded-xl bg-white/60 backdrop-blur-md p-5 sm:p-8 border border-slate-200/80 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  className="text-2xl sm:text-3xl font-black italic text-slate-800"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Daily Log
                </h2>
                {mounted && (
                  <p
                    className="mt-1 text-xs sm:text-sm text-slate-500 italic font-semibold"
                    style={{ fontFamily: 'DM Sans' }}
                  >
                    {activeEntries.length} item{activeEntries.length === 1 ? '' : 's'} added on{' '}
                    {selectedDate}
                  </p>
                )}
              </div>
            </div>

            {!mounted ? (
              <div className="rounded-lg border border-slate-200 py-12 text-center bg-slate-50">
                <p className="text-slate-400">Loading daily log...</p>
              </div>
            ) : activeEntries.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 py-12 text-center bg-slate-50/50">
                <p className="text-sm sm:text-base text-slate-400 font-semibold">No foods logged on this day</p>
                <p className="text-xs text-slate-500 mt-1 italic">
                  Change date or add a food to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[600px]">
                {activeEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg bg-white p-4 shadow-sm hover:shadow-md hover:border-cyan-500/20 transition border border-slate-150"
                  >
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-black text-slate-800 truncate text-sm sm:text-base"
                        style={{ fontFamily: 'Poppins' }}
                      >
                        {entry.name}
                      </div>
                      <div
                        className="text-[11px] sm:text-xs italic text-slate-400 mt-0.5 font-semibold"
                        style={{ fontFamily: 'DM Sans' }}
                      >
                        {entry.unit === 'g' ? (
                          `Weight: ${formatNumber(entry.grams)}g`
                        ) : (
                          `Qty: ${formatNumber(entry.amount)} ${entry.unit} (${formatNumber(entry.grams)}g)`
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-slate-100 sm:border-t-0 pt-2 sm:pt-0">
                      <div className="grid grid-cols-4 gap-3 sm:gap-4 text-right text-xs">
                        <div>
                          <p
                            className="text-slate-400 italic text-[9px] sm:text-xs font-bold"
                            style={{ fontFamily: 'Poppins' }}
                          >
                            Cal
                          </p>
                          <p
                            className="font-black text-cyan-600 text-xs sm:text-sm"
                            style={{ fontFamily: 'Poppins' }}
                          >
                            {formatNumber(entry.calories, 0)}
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-slate-400 italic text-[9px] sm:text-xs font-bold"
                            style={{ fontFamily: 'Poppins' }}
                          >
                            P
                          </p>
                          <p
                            className="font-black text-emerald-600 text-xs sm:text-sm"
                            style={{ fontFamily: 'Poppins' }}
                          >
                            {formatNumber(entry.protein, 0)}g
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-slate-400 italic text-[9px] sm:text-xs font-bold"
                            style={{ fontFamily: 'Poppins' }}
                          >
                            C
                          </p>
                          <p
                            className="font-black text-amber-600 text-xs sm:text-sm"
                            style={{ fontFamily: 'Poppins' }}
                          >
                            {formatNumber(entry.carbs, 0)}g
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-slate-400 italic text-[9px] sm:text-xs font-bold"
                            style={{ fontFamily: 'Poppins' }}
                          >
                            F
                          </p>
                          <p
                            className="font-black text-fuchsia-600 text-xs sm:text-sm"
                            style={{ fontFamily: 'Poppins' }}
                          >
                            {formatNumber(entry.fat, 0)}g
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(entry.id)}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded border border-transparent transition p-1.5"
                        title="Delete entry"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kerala Diet & Wellness Hub 🌴 */}
        {mounted && (
          <div className="mt-8 rounded-2xl bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950 text-slate-100 p-6 sm:p-8 border border-emerald-500/20 shadow-xl relative overflow-hidden animate-fade-in">
            {/* Ambient glows inside the card */}
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-emerald-500/10 blur-[60px] pointer-events-none" />
            <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 rounded-full bg-teal-500/10 blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-emerald-500/25 pb-4 mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black italic bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins' }}>
                    Kerala Diet & Wellness Companion 🌴
                  </h2>
                  <p className="text-xs text-emerald-300/80 italic font-semibold mt-1" style={{ fontFamily: 'DM Sans' }}>
                    Balancing traditional flavors with healthy macros & superfoods.
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 px-3 py-1 bg-emerald-900/60 border border-emerald-500/30 rounded-full text-[10px] sm:text-xs font-bold text-emerald-300 tracking-wide uppercase">
                  Traditional Insights
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8">
                {/* Left side: Banana Leaf Diet Balance */}
                <div className="space-y-4">
                  <div className="bg-emerald-900/20 border border-emerald-500/15 p-4 rounded-xl">
                    <h3 className="text-sm sm:text-base font-black text-emerald-300 italic mb-1" style={{ fontFamily: 'Poppins' }}>
                      Traditional Banana Leaf Plate Balance
                    </h3>
                    <p className="text-xs text-slate-350 italic">
                      Click different portions of the banana leaf plate to explore diet tips & nutritional insights.
                    </p>

                    {/* Banana Leaf Layout */}
                    <div className="mt-4 flex flex-col items-center">
                      <div className="w-full max-w-[450px] aspect-[2/1] relative bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-[50%/10%] border-2 border-emerald-500/40 p-2 overflow-hidden shadow-inner flex flex-col justify-between">
                        {/* Leaf Spine / Center Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-400/30 -translate-y-1/2" />
                        
                        {/* Top half: Curries & Sides */}
                        <div className="grid grid-cols-2 h-1/2 relative z-10 pb-0.5">
                          <button
                            type="button"
                            onClick={() => setSelectedLeafPortion('fiber')}
                            className={`m-1 rounded bg-emerald-950/40 hover:bg-emerald-950/60 border transition-all flex flex-col items-center justify-center p-1 cursor-pointer ${
                              selectedLeafPortion === 'fiber' 
                                ? 'border-emerald-300 ring-2 ring-emerald-300/50 bg-emerald-950/80 text-white font-black' 
                                : 'border-emerald-500/20 text-slate-300'
                            }`}
                          >
                            <span className="text-xs sm:text-sm font-bold">🥗 Fiber & Vitamins</span>
                            <span className="text-[9px] text-emerald-300/80 font-semibold italic mt-0.5">Thoran & Avial</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedLeafPortion('protein')}
                            className={`m-1 rounded bg-emerald-950/40 hover:bg-emerald-950/60 border transition-all flex flex-col items-center justify-center p-1 cursor-pointer ${
                              selectedLeafPortion === 'protein' 
                                ? 'border-emerald-300 ring-2 ring-emerald-300/50 bg-emerald-950/80 text-white font-black' 
                                : 'border-emerald-500/20 text-slate-300'
                            }`}
                          >
                            <span className="text-xs sm:text-sm font-bold">🍗 Lean Proteins</span>
                            <span className="text-[9px] text-emerald-300/80 font-semibold italic mt-0.5">Fish/Egg Curry, Kadala</span>
                          </button>
                        </div>

                        {/* Bottom half: Carbs & Fats/Probiotics */}
                        <div className="grid grid-cols-2 h-1/2 relative z-10 pt-0.5">
                          <button
                            type="button"
                            onClick={() => setSelectedLeafPortion('carbs')}
                            className={`m-1 rounded bg-emerald-950/40 hover:bg-emerald-950/60 border transition-all flex flex-col items-center justify-center p-1 cursor-pointer ${
                              selectedLeafPortion === 'carbs' 
                                ? 'border-emerald-300 ring-2 ring-emerald-300/50 bg-emerald-950/80 text-white font-black' 
                                : 'border-emerald-500/20 text-slate-300'
                            }`}
                          >
                            <span className="text-xs sm:text-sm font-bold">🍚 Energy Source</span>
                            <span className="text-[9px] text-emerald-300/80 font-semibold italic mt-0.5">Matta Rice, Tapioca</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedLeafPortion('fats')}
                            className={`m-1 rounded bg-emerald-950/40 hover:bg-emerald-950/60 border transition-all flex flex-col items-center justify-center p-1 cursor-pointer ${
                              selectedLeafPortion === 'fats' 
                                ? 'border-emerald-300 ring-2 ring-emerald-300/50 bg-emerald-950/80 text-white font-black' 
                                : 'border-emerald-500/20 text-slate-300'
                            }`}
                          >
                            <span className="text-xs sm:text-sm font-bold">🥥 Fats & Probiotics</span>
                            <span className="text-[9px] text-emerald-300/80 font-semibold italic mt-0.5">Coconut, Curd, Pachadi</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Educational feedback panel */}
                    <div className="mt-4 rounded-xl bg-emerald-950/60 p-4 border border-emerald-500/20 text-xs min-h-[90px] flex items-start gap-3">
                      <div className="text-lg">💡</div>
                      <div className="flex-1">
                        {!selectedLeafPortion ? (
                          <p className="text-emerald-300/90 font-medium italic animate-pulse">
                            Tap any banana leaf portion above (Fiber, Protein, Energy, or Fats) to view expert dietary insights for balancing a Kerala meal.
                          </p>
                        ) : selectedLeafPortion === 'fiber' ? (
                          <div>
                            <h4 className="font-bold text-emerald-300 text-sm mb-0.5">Thoran & Avial (50% Leaf Area Recommended)</h4>
                            <p className="text-slate-300 leading-relaxed">
                              Traditional vegetable sides like Cabbage Thoran and Avial are loaded with fiber, potassium, and micronutrients. 
                              <strong> Fitness Tip:</strong> Increase the portion size of Thoran and Avial. Their high fiber content provides fullness (satiety) on fewer calories, helping control weight while getting vital nutrients.
                            </p>
                          </div>
                        ) : selectedLeafPortion === 'protein' ? (
                          <div>
                            <h4 className="font-bold text-emerald-300 text-sm mb-0.5">Proteins & Curries (25% Leaf Area Recommended)</h4>
                            <p className="text-slate-300 leading-relaxed">
                              Spicy fish curry, beef fry, egg roast, and Kadala (chickpea) curry are excellent protein options.
                              <strong> Fitness Tip:</strong> Kerala breakfast foods (Appam, Puttu, Idiyappam) are naturally high in carbohydrates. Always pair them with Kadala curry or Egg curry rather than plain sugar or coconut milk to balance the macro ratio and prevent blood sugar spikes.
                            </p>
                          </div>
                        ) : selectedLeafPortion === 'carbs' ? (
                          <div>
                            <h4 className="font-bold text-emerald-300 text-sm mb-0.5">Starchy Carbohydrates (25% Leaf Area Recommended)</h4>
                            <p className="text-slate-300 leading-relaxed">
                              Matta Rice (brown/red parboiled rice) and Kappa (tapioca) are staples that supply glycogen.
                              <strong> Fitness Tip:</strong> Matta rice is highly recommended over white rice because it retains the outer bran layers, yielding a lower glycemic index, more B vitamins, and high dietary fiber for stable, sustained energy release.
                            </p>
                          </div>
                        ) : (
                          <div>
                            <h4 className="font-bold text-emerald-300 text-sm mb-0.5">Fats & Digestion (Subtle Accents Recommended)</h4>
                            <p className="text-slate-300 leading-relaxed">
                              Coconut oil, coconut milk, and curd/pachadi are used to flavor dishes. Curd acts as a natural probiotic.
                              <strong> Fitness Tip:</strong> Coconut contains Medium-Chain Triglycerides (MCTs) which are burned rapidly by the liver for energy. However, fats are calorie-dense (9 kcal/g), so watch overall cooking oil amounts if trying to lose weight!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side: Kerala Superfoods Highlights */}
                <div className="space-y-4">
                  <div className="bg-emerald-900/20 border border-emerald-500/15 p-4 rounded-xl h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-emerald-300 italic mb-3" style={{ fontFamily: 'Poppins' }}>
                        Kerala Wellness Superfoods
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex gap-2.5 p-2 bg-emerald-950/40 rounded-lg border border-emerald-500/10">
                          <span className="text-lg">🌿</span>
                          <div>
                            <h4 className="text-xs font-black text-emerald-200">Moringa (Muringakkai)</h4>
                            <p className="text-[11px] text-slate-350 mt-0.5 leading-relaxed">
                              Rich in Iron, Vitamin C, and plant-based Calcium. Helps lower blood pressure and combat cellular inflammation.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2.5 p-2 bg-emerald-950/40 rounded-lg border border-emerald-500/10">
                          <span className="text-lg">🌶️</span>
                          <div>
                            <h4 className="text-xs font-black text-emerald-200">Turmeric & Black Pepper</h4>
                            <p className="text-[11px] text-slate-350 mt-0.5 leading-relaxed">
                              Traditional curries blend turmeric (curcumin) with black pepper (piperine). Pepper increases curcumin absorption by up to 2000%!
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2.5 p-2 bg-emerald-950/40 rounded-lg border border-emerald-500/10">
                          <span className="text-lg">🍃</span>
                          <div>
                            <h4 className="text-xs font-black text-emerald-200">Curry Leaves (Kariveppila)</h4>
                            <p className="text-[11px] text-slate-350 mt-0.5 leading-relaxed">
                              Contains antioxidant compounds. Promotes healthy digestion, supports hair strength, and aids cholesterol control.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2.5 p-2 bg-emerald-950/40 rounded-lg border border-emerald-500/10">
                          <span className="text-lg">🍊</span>
                          <div>
                            <h4 className="text-xs font-black text-emerald-200">Kudampuli (Garcinia Cambogia)</h4>
                            <p className="text-[11px] text-slate-350 mt-0.5 leading-relaxed">
                              Traditional wood-smoked tamarind used in fish curries. Contains Hydroxycitric Acid (HCA) which supports natural appetite control.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-emerald-500/20 text-center">
                      <p className="text-[10px] text-emerald-300 font-semibold italic">
                        Tip: Explore Matta Rice, Fish Curry, Thoran & Appam in the "Kerala Cuisine Hub 🌴" above!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Performance Report */}
        {mounted && (
          <div className="mt-8 rounded-xl bg-white/60 backdrop-blur-md p-4 sm:p-8 border border-slate-200/80 shadow-lg animate-fade-in">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2
                  className="text-2xl sm:text-3xl font-black italic text-slate-800"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Monthly Performance
                </h2>
                <p
                  className="mt-1 text-xs sm:text-sm text-slate-500 italic font-semibold"
                  style={{ fontFamily: 'DM Sans' }}
                >
                  Day-by-day analysis for {getMonthYearLabel(selectedDate || getTodayDateString())}
                </p>
              </div>
              <div
                className="text-[11px] sm:text-xs font-semibold text-slate-500 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 shadow-inner flex items-center gap-1 self-start sm:self-auto"
                style={{ fontFamily: 'DM Sans' }}
              >
                <span>📅 Click a day cell to view or modify its meal log</span>
              </div>
            </div>

            {/* Stats Dashboard */}
            <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-4 sm:p-5 border border-slate-150 shadow-inner">
                <p
                  className="text-[10px] sm:text-xs font-semibold italic text-slate-500"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Avg Daily Calories
                </p>
                <p
                  className="mt-1.5 text-xl sm:text-2xl font-black text-cyan-600 filter drop-shadow-[0_0_4px_rgba(6,182,212,0.15)]"
                  style={{ fontFamily: 'Poppins' }}
                >
                  {formatNumber(averageCalories, 0)} kcal
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 not-italic">
                  Across {loggedDays.length} active day{loggedDays.length === 1 ? '' : 's'}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 sm:p-5 border border-slate-150 shadow-inner">
                <p
                  className="text-[10px] sm:text-xs font-semibold italic text-slate-500"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Goal Adherence
                </p>
                <p
                  className="mt-1.5 text-xl sm:text-2xl font-black text-emerald-655 text-emerald-600 filter drop-shadow-[0_0_4px_rgba(16,185,129,0.15)]"
                  style={{ fontFamily: 'Poppins' }}
                >
                  {formatNumber(adherenceRate, 0)}%
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 not-italic flex flex-wrap gap-1">
                  <span>{loggedDays.filter((d) => d.calories <= dailyCalorieGoal).length} of</span>
                  <span>{loggedDays.length} days met goal</span>
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 sm:p-5 border border-slate-150 shadow-inner">
                <p
                  className="text-[10px] sm:text-xs font-semibold italic text-slate-500"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Average Macros
                </p>
                <div
                  className="mt-1.5 flex items-baseline gap-0.5 sm:gap-1 text-slate-700 font-bold"
                  style={{ fontFamily: 'Poppins' }}
                >
                  <span className="text-sm sm:text-base text-emerald-600">
                    {formatNumber(averageMacros.protein, 0)}g
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-normal">P</span>
                  <span className="text-xs text-slate-300 mx-0.5">|</span>
                  <span className="text-sm sm:text-base text-amber-600">
                    {formatNumber(averageMacros.carbs, 0)}g
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-normal">C</span>
                  <span className="text-xs text-slate-300 mx-0.5">|</span>
                  <span className="text-sm sm:text-base text-fuchsia-600">
                    {formatNumber(averageMacros.fat, 0)}g
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-normal">F</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 not-italic">
                  Daily average macronutrients
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 sm:p-5 border border-slate-150 shadow-inner">
                <p
                  className="text-[10px] sm:text-xs font-semibold italic text-slate-500"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Logged Days
                </p>
                <p
                  className="mt-1.5 text-xl sm:text-2xl font-black text-slate-700"
                  style={{ fontFamily: 'Poppins' }}
                >
                  {loggedDays.length}{' '}
                  <span className="text-xs sm:text-sm font-normal text-slate-400 not-italic">
                    / {monthlyDaysData.length}
                  </span>
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 not-italic">
                  Total logged days this month
                </p>
              </div>
            </div>

            {/* Calendar Widget (visible on PC/Tablet, hidden on mobile) */}
            <div className="hidden md:block bg-slate-50/50 rounded-xl p-6 border border-slate-200 shadow-md">
              {/* Weekdays labels */}
              <div
                className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider"
                style={{ fontFamily: 'Poppins' }}
              >
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>

              {/* Grid cells */}
              <div className="grid grid-cols-7 gap-2">
                {/* Padding cells prior to 1st of month */}
                {Array.from({ length: getFirstDayOfWeekIndex(selectedDate || getTodayDateString()) }).map(
                  (_, index) => (
                    <div
                      key={`pad-${index}`}
                      className="aspect-square bg-slate-100/50 rounded-lg border border-dashed border-slate-200/40"
                    />
                  )
                )}

                {/* Calendar cells for each month day */}
                {monthlyDaysData.map((dayData) => {
                  const dateObj = new Date(dayData.date + 'T00:00:00');
                  const dayNum = dateObj.getDate();
                  const isSelected = dayData.date === selectedDate;

                  let cellClass = 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50/50 text-slate-600';
                  let badgeClass = 'text-slate-500 bg-slate-100';

                  if (dayData.hasLogs) {
                    const ratio = dayData.calories / dailyCalorieGoal;
                    if (ratio > 1.0) {
                      cellClass =
                        'bg-red-50/80 border-red-200 text-red-800 hover:bg-red-50 shadow-sm';
                      badgeClass = 'bg-red-100 text-red-700 border border-red-200/45';
                    } else if (ratio >= 0.8) {
                      cellClass =
                        'bg-emerald-50/80 border-emerald-200 text-emerald-800 hover:bg-emerald-50 shadow-sm';
                      badgeClass = 'bg-emerald-100 text-emerald-700 border border-emerald-200/45';
                    } else {
                      cellClass =
                        'bg-cyan-50/80 border-cyan-200 text-cyan-800 hover:bg-cyan-50 shadow-sm';
                      badgeClass = 'bg-cyan-100 text-cyan-700 border border-cyan-200/45';
                    }
                  }

                  if (isSelected) {
                    cellClass += ' ring-2 ring-cyan-500 border-transparent z-10 shadow-[0_0_12px_rgba(6,182,212,0.25)]';
                  }

                  return (
                    <button
                      key={dayData.date}
                      type="button"
                      onClick={() => setSelectedDate(dayData.date)}
                      className={`flex flex-col justify-between p-3 aspect-square rounded-lg border text-left transition cursor-pointer group ${cellClass}`}
                    >
                      <div className="flex items-start justify-between w-full">
                        <span
                          className={`text-sm font-bold rounded px-1.5 py-0.5 ${
                            isSelected ? 'bg-cyan-600 text-white font-black' : 'text-slate-700'
                          }`}
                          style={{ fontFamily: 'Poppins' }}
                        >
                          {dayNum}
                        </span>
                        {dayData.hasLogs && (
                          <span
                            className={`text-[9px] font-black rounded px-1 py-0.5 ${badgeClass}`}
                            style={{ fontFamily: 'Poppins' }}
                          >
                            {formatNumber(dayData.calories, 0)} kcal
                          </span>
                        )}
                      </div>

                      {dayData.hasLogs ? (
                        <div className="w-full mt-1.5">
                          {/* Visual Progress bar */}
                          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mb-1">
                            <div
                              className={`h-full rounded-full transition-all ${
                                dayData.calories > dailyCalorieGoal
                                  ? 'bg-red-500'
                                  : dayData.calories >= dailyCalorieGoal * 0.8
                                  ? 'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.3)]'
                                  : 'bg-cyan-500 shadow-[0_0_4px_rgba(6,182,212,0.3)]'
                              }`}
                              style={{
                                width: `${Math.min((dayData.calories / dailyCalorieGoal) * 100, 100)}%`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-[8px] text-slate-500 font-bold">
                            <span>P:{formatNumber(dayData.protein, 0)}</span>
                            <span>C:{formatNumber(dayData.carbs, 0)}</span>
                            <span>F:{formatNumber(dayData.fat, 0)}</span>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="text-[9px] text-slate-300 italic group-hover:text-cyan-600 transition font-medium"
                          style={{ fontFamily: 'DM Sans' }}
                        >
                          + Log day
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List View (visible on mobile, hidden on PC) */}
            <div className="block md:hidden bg-slate-50/50 rounded-xl p-4 border border-slate-200 shadow-md space-y-2 max-h-[400px] overflow-y-auto">
              {monthlyDaysData.map((dayData) => {
                const dateObj = new Date(dayData.date + 'T00:00:00');
                const isSelected = dayData.date === selectedDate;
                const ratio = dayData.calories / dailyCalorieGoal;

                let rowBg = 'bg-white border-slate-200 hover:border-slate-350 text-slate-600';
                let statusText = 'No entries logged';
                let statusColor = 'text-slate-400';

                if (dayData.hasLogs) {
                  statusText = `${formatNumber(dayData.calories, 0)} kcal`;
                  if (ratio > 1.0) {
                    rowBg = 'bg-red-50/80 border-red-200 text-red-850 hover:bg-red-100/50 shadow-sm';
                    statusColor = 'text-red-600 font-bold';
                  } else if (ratio >= 0.8) {
                    rowBg = 'bg-emerald-50/80 border-emerald-200 text-emerald-850 hover:bg-emerald-100/50 shadow-sm';
                    statusColor = 'text-emerald-600 font-bold';
                  } else {
                    rowBg = 'bg-cyan-50/80 border-cyan-200 text-cyan-850 hover:bg-cyan-100/50 shadow-sm';
                    statusColor = 'text-cyan-600 font-bold';
                  }
                }

                if (isSelected) {
                  rowBg += ' ring-2 ring-cyan-500 border-transparent z-10 shadow-[0_0_10px_rgba(6,182,212,0.2)]';
                }

                return (
                  <button
                    key={dayData.date}
                    type="button"
                    onClick={() => setSelectedDate(dayData.date)}
                    className={`w-full flex flex-col sm:flex-row sm:items-center sm:justify-between p-3.5 rounded-lg border text-left transition cursor-pointer gap-2 ${rowBg}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                      <span className="text-sm font-bold text-slate-800" style={{ fontFamily: 'Poppins' }}>
                        {dateObj.toLocaleDateString('default', { day: 'numeric', month: 'short', weekday: 'short' })}
                      </span>
                      {dayData.hasLogs && (
                        <div className="flex gap-2 text-[10px] text-slate-500 font-semibold">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/40 px-1.5 rounded">P: {formatNumber(dayData.protein, 0)}g</span>
                          <span className="bg-amber-50 text-amber-700 border border-amber-200/40 px-1.5 rounded">C: {formatNumber(dayData.carbs, 0)}g</span>
                          <span className="bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200/40 px-1.5 rounded">F: {formatNumber(dayData.fat, 0)}g</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className={`text-xs ${statusColor}`} style={{ fontFamily: 'Poppins' }}>
                        {statusText}
                      </span>
                      {dayData.hasLogs && (
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className={`h-full rounded-full ${
                              dayData.calories > dailyCalorieGoal
                                ? 'bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.3)]'
                                : dayData.calories >= dailyCalorieGoal * 0.8
                                ? 'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.3)]'
                                : 'bg-cyan-500 shadow-[0_0_4px_rgba(6,182,212,0.3)]'
                            }`}
                            style={{ width: `${Math.min((dayData.calories / dailyCalorieGoal) * 100, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
