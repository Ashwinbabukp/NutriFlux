'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type Nutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type Entry = {
  id: string;
  name: string;
  amount: number;
  unit: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string; // YYYY-MM-DD
};

export const nutritionDatabase: Record<string, Nutrition> = {
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
  sambharam: { calories: 30, protein: 1.5, carbs: 2.5, fat: 1.5 },
  'tender coconut water': { calories: 19, protein: 0.7, carbs: 3.7, fat: 0.2 },
  karikku: { calories: 19, protein: 0.7, carbs: 3.7, fat: 0.2 },
  'kulukki sarbath': { calories: 65, protein: 0.4, carbs: 16.5, fat: 0.1 },
  sulaimani: { calories: 20, protein: 0.1, carbs: 5.0, fat: 0.0 },
  'chukku kappi': { calories: 25, protein: 0.2, carbs: 6.0, fat: 0.0 },
  'nannari sarbath': { calories: 85, protein: 0.1, carbs: 21.0, fat: 0.0 },
  'jeeraka vellam': { calories: 2, protein: 0.0, carbs: 0.5, fat: 0.0 },
  pathimugam: { calories: 1, protein: 0.0, carbs: 0.2, fat: 0.0 },
  'black coffee': { calories: 2, protein: 0.1, carbs: 0.0, fat: 0.0 },
  'coffee with milk': { calories: 40, protein: 2.0, carbs: 4.0, fat: 1.8 },
  'black tea': { calories: 1, protein: 0.0, carbs: 0.2, fat: 0.0 },
  'tea with milk': { calories: 45, protein: 1.8, carbs: 4.5, fat: 2.0 },
  chai: { calories: 45, protein: 1.8, carbs: 4.5, fat: 2.0 },
  'green tea': { calories: 1, protein: 0.0, carbs: 0.0, fat: 0.0 },
  'lime juice': { calories: 35, protein: 0.3, carbs: 9.0, fat: 0.1 },
  'orange juice': { calories: 45, protein: 0.7, carbs: 10.4, fat: 0.2 },
  toddy: { calories: 55, protein: 0.3, carbs: 6.0, fat: 0.1 },
};

export const foodServings: Record<string, { size: number; unit: string }> = {
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
  sambharam: { size: 200, unit: 'glass (200ml)' },
  'tender coconut water': { size: 250, unit: 'coconut (250ml)' },
  karikku: { size: 250, unit: 'coconut (250ml)' },
  'kulukki sarbath': { size: 250, unit: 'glass (250ml)' },
  sulaimani: { size: 150, unit: 'glass (150ml)' },
  'chukku kappi': { size: 150, unit: 'cup (150ml)' },
  'nannari sarbath': { size: 250, unit: 'glass (250ml)' },
  'jeeraka vellam': { size: 250, unit: 'glass (250ml)' },
  pathimugam: { size: 250, unit: 'glass (250ml)' },
  'black coffee': { size: 150, unit: 'cup (150ml)' },
  'coffee with milk': { size: 150, unit: 'cup (150ml)' },
  'black tea': { size: 150, unit: 'cup (150ml)' },
  'tea with milk': { size: 150, unit: 'cup (150ml)' },
  chai: { size: 150, unit: 'cup (150ml)' },
  'green tea': { size: 150, unit: 'cup (150ml)' },
  'lime juice': { size: 250, unit: 'glass (250ml)' },
  'orange juice': { size: 250, unit: 'glass (250ml)' },
  toddy: { size: 300, unit: 'bottle/glass (300ml)' },
};

export const quickFoods = [
  { food: 'chicken breast', label: 'Chicken Breast (100g)', calories: 165 },
  { food: 'white rice', label: 'White Rice (100g)', calories: 206 },
  { food: 'banana', label: 'Banana (100g)', calories: 105 },
  { food: 'egg', label: 'Egg (100g)', calories: 155 },
];

export const keralaCuisineCategories = [
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
  },
  {
    category: 'Drinks & Beverages ☕🥤',
    items: [
      { food: 'sambharam', label: 'Sambharam (Spiced Buttermilk)', calories: 60, desc: 'Cooling buttermilk spiced with ginger, green chillies & curry leaves' },
      { food: 'tender coconut water', label: 'Tender Coconut (Karikku)', calories: 48, desc: 'Fresh local electrolyte-rich tender coconut water' },
      { food: 'sulaimani', label: 'Sulaimani Tea', calories: 30, desc: 'Tangy and sweet spiced lemon black tea' },
      { food: 'kulukki sarbath', label: 'Kulukki Sarbath', calories: 160, desc: 'Shaken sweet lemon juice with basil seeds' },
      { food: 'chukku kappi', label: 'Chukku Kappi', calories: 38, desc: 'Dry ginger coffee sweetened with health-friendly palm jaggery' },
      { food: 'toddy', label: 'Toddy', calories: 165, desc: 'Mildly fermented traditional palm juice' },
    ]
  }
];

export const getNutritionEstimate = (foodName: string): Nutrition => {
  const nameClean = foodName.toLowerCase().trim();
  if (nutritionDatabase[nameClean]) {
    return nutritionDatabase[nameClean];
  }
  
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

export const getServingInfo = (foodName: string): { size: number; unit: string } => {
  const nameClean = foodName.toLowerCase().trim();
  if (foodServings[nameClean]) {
    return foodServings[nameClean];
  }
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

export const formatNumber = (num: number, decimals = 1): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

export const getTodayDateString = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const formatDate = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const getDaysInMonth = (dateString: string): string[] => {
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

export const getFirstDayOfWeekIndex = (dateString: string): number => {
  if (!dateString) return 0;
  const [yearStr, monthStr] = dateString.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const date = new Date(year, month - 1, 1);
  return date.getDay();
};

export const getMonthYearLabel = (dateString: string): string => {
  if (!dateString) return '';
  const [yearStr, monthStr] = dateString.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

interface AppContextType {
  currentUser: string | null;
  entries: Entry[];
  dailyCalorieGoal: number;
  selectedDate: string;
  registeredUsers: string[];
  
  authMode: 'signin' | 'signup';
  setAuthMode: React.Dispatch<React.SetStateAction<'signin' | 'signup'>>;
  authState: 'email' | 'otp';
  setAuthState: React.Dispatch<React.SetStateAction<'email' | 'otp'>>;
  authEmail: string;
  setAuthEmail: (email: string) => void;
  authOtpInput: string;
  setAuthOtpInput: (otp: string) => void;
  generatedOtp: string;
  authError: string;
  setAuthError: (err: string) => void;
  mockOtpMessage: string;
  setMockOtpMessage: (msg: string) => void;
  mounted: boolean;

  handleSendOtp: () => void;
  handleVerifyOtp: () => void;
  handleLogout: () => void;
  
  handleAddEntry: (name: string, amount: number, unitMode: 'g' | 'serving') => { success: boolean; message: string };
  handleRemoveEntry: (id: string) => void;
  setDailyCalorieGoal: (goal: number) => void;
  
  handlePrevDay: () => void;
  handleNextDay: () => void;
  handleGoToToday: () => void;
  setSelectedDate: (date: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [dailyCalorieGoal, _setDailyCalorieGoal] = useState(2000);

  const setDailyCalorieGoal = (goal: number) => {
    _setDailyCalorieGoal(goal);
    if (currentUser) {
      localStorage.setItem(`nutriflux_goal_${currentUser}`, String(goal));
    }
  };

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
      _setDailyCalorieGoal(g > 0 ? g : 2000);
    } else {
      _setDailyCalorieGoal(2000);
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
    _setDailyCalorieGoal(2000);
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

  // Add & Remove Entries
  const handleAddEntry = (foodName: string, foodAmount: number, unitMode: 'g' | 'serving'): { success: boolean; message: string } => {
    if (!foodName.trim()) {
      return { success: false, message: 'Please enter a food name' };
    }
    if (foodAmount <= 0) {
      return { success: false, message: `Please enter a valid ${unitMode === 'g' ? 'weight in grams' : 'number of servings'}` };
    }

    const baseEstimate = getNutritionEstimate(foodName);
    const servingInfo = getServingInfo(foodName);
    
    const calculatedGrams = unitMode === 'g' ? foodAmount : foodAmount * servingInfo.size;
    const calories = (baseEstimate.calories * calculatedGrams) / 100;
    const protein = (baseEstimate.protein * calculatedGrams) / 100;
    const carbs = (baseEstimate.carbs * calculatedGrams) / 100;
    const fat = (baseEstimate.fat * calculatedGrams) / 100;

    const newEntry: Entry = {
      id: Date.now().toString() + Math.random().toString(),
      name: foodName.trim(),
      amount: foodAmount,
      unit: unitMode === 'g' ? 'g' : servingInfo.unit,
      grams: calculatedGrams,
      calories: calories,
      protein: protein,
      carbs: carbs,
      fat: fat,
      date: selectedDate || getTodayDateString(),
    };

    setEntries((prev) => {
      const updated = [newEntry, ...prev];
      if (currentUser) {
        localStorage.setItem(`nutriflux_entries_${currentUser}`, JSON.stringify(updated));
      }
      return updated;
    });
    return { success: true, message: `Successfully added "${newEntry.name}"!` };
  };

  const handleRemoveEntry = (id: string) => {
    setEntries((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      if (currentUser) {
        localStorage.setItem(`nutriflux_entries_${currentUser}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        entries,
        dailyCalorieGoal,
        selectedDate,
        registeredUsers,
        authMode,
        setAuthMode,
        authState,
        setAuthState,
        authEmail,
        setAuthEmail,
        authOtpInput,
        setAuthOtpInput,
        generatedOtp,
        authError,
        setAuthError,
        mockOtpMessage,
        setMockOtpMessage,
        mounted,
        handleSendOtp,
        handleVerifyOtp,
        handleLogout,
        handleAddEntry,
        handleRemoveEntry,
        setDailyCalorieGoal,
        handlePrevDay,
        handleNextDay,
        handleGoToToday,
        setSelectedDate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
}
