import React, { useState, useEffect, createContext, useContext, useMemo, useRef } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate, 
  useLocation 
} from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { CustomSelect } from './components/CustomSelect';
import { Printer as CapPrinter } from '@capgo/capacitor-printer';
import { 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  signInWithPopup,
  browserPopupRedirectResolver
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  getDocFromServer
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth, db, app, OperationType, handleFirestoreError } from './firebase';
import { 
  Category,
  Service, 
  CartItem, 
  Sale, 
  Expense, 
  ExpenseCategory,
  UserProfile, 
  ShopSettings,
  Customer,
  Appointment
} from './types';
import { 
  Menu, 
  ShoppingCart, 
  BarChart2, 
  Calendar,
  Calendar as CalendarIcon,
  LayoutGrid,
  TrendingDown, 
  Settings, 
  LogOut, 
  Search, 
  X, 
  Plus, 
  Trash2, 
  Printer,
  ChevronRight,
  ChevronLeft,
  FileText,
  Phone,
  History as HistoryIcon,
  User as UserIcon,
  Users as UsersIcon,
  Store,
  Briefcase,
  DollarSign,
  Sun,
  Moon,
  Check,
  Star,
  Edit2,
  Pencil,
  ArrowUp,
  ArrowDown,
  Coins,
  Home,
  Car,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Mail,
  Receipt,
  AlertTriangle,
  CreditCard,
  Scissors,
  Sparkles,
  Smile,
  Heart,
  Zap,
  Flower2,
  Brush,
  SprayCan,
  Waves,
  Clock,
  HelpCircle,
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  CheckCircle2,
  Activity,
  CalendarHeart,
  MessageCircle,
  Download,
  ArrowLeft,
  Palette
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { exportToCSVAndShare } from './exportUtils';

import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

import ErrorBoundary from './components/ErrorBoundary';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const normalizePhone = (phone: string) => {
  // Strip all non-digits
  let cleaned = phone.replace(/\D/g, '');
  
  // Handle Myanmar specific normalization (common for this app's context)
  // If it starts with 959..., convert to 09...
  if (cleaned.startsWith('959')) {
    cleaned = '09' + cleaned.slice(3);
  } 
  // If it starts with 9... and is 9-10 digits, it's likely missing the leading 0
  else if (cleaned.startsWith('9') && (cleaned.length === 9 || cleaned.length === 10)) {
    cleaned = '0' + cleaned;
  }
  
  return cleaned;
};

function getLocalISODate(dateInput?: string | number | Date) {
  const date = dateInput ? new Date(dateInput) : new Date();
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
}

function formatDisplayDate(dateInput: string | number | Date) {
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return String(dateInput);
    
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';

    return format(date, 'dd MMM yyyy');
  } catch (e) {
    return String(dateInput);
  }
}

function formatTime(dateInput: string | number | Date) {
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    return format(date, 'hh:mm a');
  } catch (e) {
    return '';
  }
}

function formatFullDate(dateInput: string | number | Date) {
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return String(dateInput);
    return format(date, 'EEEE, MMMM d, yyyy');
  } catch (e) {
    return String(dateInput);
  }
}

function formatDateToMDY(dateStr: string) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${m}/${d}/${y}`;
}

const CustomDatePicker: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  iconColor?: string;
  className?: string;
  disabled?: boolean;
}> = ({ label, value, onChange, iconColor = "text-primary", className, disabled }) => {
  const dayOfWeek = new Date(value).toLocaleDateString('en-US', { weekday: 'long' });
  
  return (
    <div className={cn(
      "relative group flex items-center gap-3 px-4 py-3 hover:bg-black/5  transition-colors cursor-pointer h-full",
      disabled && "opacity-50 cursor-not-allowed pointer-events-none",
      className
    )}>
      {/* Technical Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
      
      <CalendarIcon size={18} className={iconColor} />
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <label className="text-[9px] text-muted-foreground font-black uppercase tracking-widest leading-none">
            {label}
          </label>
          <span className="text-[8px] text-primary/50 font-mono font-bold uppercase tracking-tighter">
            {dayOfWeek}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-black text-foreground tracking-tight truncate">
            {formatDateToMDY(value)}
          </span>
          <ChevronDown size={12} className="text-muted-foreground ml-2 opacity-30 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
      />
    </div>
  );
};

// Removed redundant OperationType and FirestoreErrorInfo definitions (moved to firebase.ts)

const generateReceiptText = (sale: Omit<Sale, 'id'>, settings: ShopSettings | null) => {
  const pad = (str: string, len: number) => str.length >= len ? str.substring(0, len) : str + ' '.repeat(len - str.length);
  const padL = (str: string, len: number) => str.length >= len ? str.substring(0, len) : ' '.repeat(len - str.length) + str;
  const center = (str: string, len: number) => {
    if(str.length >= len) return str.substring(0, len);
    const left = Math.floor((len - str.length) / 2);
    return ' '.repeat(left) + str + ' '.repeat(len - str.length - left);
  };

  let text = "";
  
  if (settings?.receiptHeader) {
    const headerLines = settings.receiptHeader.match(/.{1,32}/g) || [settings.receiptHeader];
    headerLines.forEach(l => text += center(l.trim(), 32) + "\n");
  }

  if (!settings?.hideShopNameOnReceipt) {
    text += center(settings?.name || "NAIL PRO BEAUTY STUDIO", 32) + "\n";
  }
  const address = settings?.addr || "";
  const addrLines = address.match(/.{1,32}/g) || [address];
  addrLines.forEach(l => text += center(l.trim(), 32) + "\n");
  text += center("Ph: " + (settings?.ph || ""), 32) + "\n";
  text += "-".repeat(32) + "\n";
  
  if (!settings?.hideDateTimeOnReceipt) {
    text += `Date   : ${new Date(sale.dateTime).toLocaleString()}\n`;
  }
  if (!settings?.hideStaffNameOnReceipt) {
    text += `Staff  : ${sale.staff}\n`;
  }
  
  text += "-".repeat(32) + "\n";
  text += "Item           Qty Price  Total\n";
  text += "-".repeat(32) + "\n";

  sale.items.forEach(item => {
    const sub = item.price * item.qty;
    const netSub = sub - (sub * (item.disP / 100));
    let fullItemName = item.name + (item.disP > 0 ? `(-${item.disP}%)` : "");
    let nameChunks = fullItemName.match(/.{1,14}/g) || [fullItemName];
    text += pad(nameChunks[0], 14) + " " + padL(item.qty.toString(), 3) + " " + padL(item.price.toString(), 6) + " " + padL(netSub.toString(), 6) + "\n";
    if (nameChunks.length > 1) {
      for (let i = 1; i < nameChunks.length; i++) { text += pad(nameChunks[i], 14) + "\n"; }
    }
  });

  text += "-".repeat(32) + "\n";
  text += pad("NET TOTAL", 18) + padL(sale.total.toLocaleString() + " Ks", 14) + "\n";

  if (!settings?.hideLoyaltyPointsOnReceipt && (sale.pointsEarned || sale.pointsRedeemed)) {
    text += "-".repeat(32) + "\n";
    if (sale.pointsEarned) text += pad("Points Earned", 18) + padL("+" + sale.pointsEarned, 14) + "\n";
    if (sale.pointsRedeemed) text += pad("Points Redeemed", 18) + padL("-" + sale.pointsRedeemed, 14) + "\n";
  }

  text += "-".repeat(32) + "\n";
  
  const footerText = settings?.receiptFooter || "Thank You! Please Come Again";
  const footerLines = footerText.match(/.{1,32}/g) || [footerText];
  footerLines.forEach(l => text += center(l.trim(), 32) + "\n");
  
  text += "\n\n\n";
  return text;
};

const generateConsolidatedReceiptText = (sales: Sale[], settings: ShopSettings | null, from: string, to: string) => {
  const pad = (str: string, len: number) => str.length >= len ? str.substring(0, len) : str + ' '.repeat(len - str.length);
  const padL = (str: string, len: number) => str.length >= len ? str.substring(0, len) : ' '.repeat(len - str.length) + str;
  const center = (str: string, len: number) => {
    if(str.length >= len) return str.substring(0, len);
    const left = Math.floor((len - str.length) / 2);
    return ' '.repeat(left) + str + ' '.repeat(len - str.length - left);
  };

  let text = "";
  
  if (settings?.receiptHeader) {
    const headerLines = settings.receiptHeader.match(/.{1,32}/g) || [settings.receiptHeader];
    headerLines.forEach(l => text += center(l.trim(), 32) + "\n");
  }

  if (!settings?.hideShopNameOnReceipt) {
    text += center(settings?.name || "NAIL PRO BEAUTY STUDIO", 32) + "\n";
  }
  text += center("CONSOLIDATED SALES REPORT", 32) + "\n";
  text += center(`From: ${from}`, 32) + "\n";
  text += center(`To  : ${to}`, 32) + "\n";
  text += "-".repeat(32) + "\n";

  let grandTotal = 0;
  sales.forEach((sale, idx) => {
    if (!settings?.hideStaffNameOnReceipt) {
      text += `Sale #${idx + 1} | ${sale.staff}\n`;
    } else {
      text += `Sale #${idx + 1}\n`;
    }
    if (!settings?.hideDateTimeOnReceipt) {
      text += `Time: ${new Date(sale.dateTime).toLocaleTimeString()}\n`;
    }
    text += "-".repeat(32) + "\n";
    text += "Item           Qty Price  Total\n";
    
    sale.items.forEach(item => {
      const sub = item.price * item.qty;
      const netSub = sub - (sub * (item.disP / 100));
      let fullItemName = item.name + (item.disP > 0 ? `(-${item.disP}%)` : "");
      let nameChunks = fullItemName.match(/.{1,14}/g) || [fullItemName];
      text += pad(nameChunks[0], 14) + " " + padL(item.qty.toString(), 3) + " " + padL(item.price.toString(), 6) + " " + padL(netSub.toString(), 6) + "\n";
      if (nameChunks.length > 1) {
        for (let i = 1; i < nameChunks.length; i++) { text += pad(nameChunks[i], 14) + "\n"; }
      }
    });
    
    text += padL(`Sale Total: ${sale.total.toLocaleString()} Ks`, 32) + "\n";
    text += "-".repeat(32) + "\n\n";
    grandTotal += sale.total;
  });

  text += "=".repeat(32) + "\n";
  text += pad("GRAND TOTAL", 18) + padL(grandTotal.toLocaleString() + " Ks", 14) + "\n";
  text += "=".repeat(32) + "\n";
  text += center("Generated on: " + new Date().toLocaleString(), 32) + "\n";

  if (settings?.receiptFooter) {
    const footerLines = settings.receiptFooter.match(/.{1,32}/g) || [settings.receiptFooter];
    footerLines.forEach(l => text += center(l.trim(), 32) + "\n");
  }

  text += "\n\n\n";
  return text;
};

// Removed redundant handleFirestoreError definition (moved to firebase.ts)

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isOwner: boolean;
  isCashier: boolean;
  isStaff: boolean;
  isStaffMember: boolean;
  isCustomer: boolean;
  login: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithPhone: (phone: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string) => Promise<void>;
  signUpWithPhone: (phone: string, pass: string, dob: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resetPasswordWithIdentity: (phone: string, name: string, dob: string, newPass: string) => Promise<void>;
  changePassword: (currentPass: string, newPass: string) => Promise<void>;
  forceChangePassword: (newPass: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  setError: (msg: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }

      if (u) {
        const email = u.email!.toLowerCase();
        const docRef = doc(db, 'users', email);
        
        (async () => {
          try {
            const now = new Date().toISOString();
            
            if (email === 'aungsoe366@gmail.com') {
              const docSnap = await getDoc(docRef);
              if (!docSnap.exists() || docSnap.data()?.role !== 'super_admin') {
                await setDoc(docRef, { 
                  role: 'super_admin', 
                  email: email,
                  name: u.displayName || 'Admin',
                  status: 'active',
                  uid: u.uid,
                  createdAt: now,
                  updatedAt: now
                }, { merge: true });
              }
            }

            const docSnap = await getDoc(docRef);
            let currentRole = 'customer';
            
            if (docSnap.exists()) {
              const data = docSnap.data() as UserProfile;
              currentRole = data.role;
              if (!data.uid || !data.createdAt) {
                await setDoc(docRef, { 
                  uid: u.uid,
                  createdAt: data.createdAt || now,
                  updatedAt: now
                }, { merge: true });
              }
            }

            if (currentRole === 'customer' && email !== 'aungsoe366@gmail.com') {
              let initialName = u.displayName || 'Customer';
              let initialPoints = 0;
              try {
                const custQuery = query(collection(db, 'customers'), where('email', '==', email));
                const custSnap = await getDocs(custQuery);
                
                if (!custSnap.empty) {
                  const custData = custSnap.docs[0].data() as Customer;
                  initialName = custData.name || initialName;
                  initialPoints = custData.points || 0;
                } else {
                  if (docSnap.exists()) {
                    const existingData = docSnap.data() as UserProfile;
                    if (existingData.points) {
                      initialPoints = existingData.points;
                    }
                  }
                  await addDoc(collection(db, 'customers'), {
                    name: initialName,
                    email: email,
                    phone: '',
                    address: '',
                    notes: 'Registered via Google Sign-In',
                    points: initialPoints,
                    totalVisits: 0,
                    totalSpent: 0
                  });
                }
              } catch (err) {
                console.error("Failed to check or create customer record", err);
              }

              if (!docSnap.exists()) {
                const profileData: UserProfile = {
                  name: initialName,
                  email: email,
                  role: 'customer',
                  commission: 0,
                  uid: u.uid,
                  points: initialPoints,
                  status: 'active',
                  createdAt: now,
                  updatedAt: now
                };
                await setDoc(docRef, profileData);
              }
            } else if (!docSnap.exists()) {
              const profileData: UserProfile = {
                name: u.displayName || 'User',
                email: email,
                role: (email === 'aungsoe366@gmail.com') ? 'super_admin' : 'customer',
                commission: 0,
                uid: u.uid,
                points: 0,
                status: 'active',
                createdAt: now,
                updatedAt: now
              };
              await setDoc(docRef, profileData);
            }

            unsubProfile = onSnapshot(docRef, (docSnap) => {
              if (!docSnap.exists() || docSnap.data()?.status === 'deleted') {
                signOut(auth);
                setUser(null);
                setProfile(null);
                return;
              }
              const profileData = docSnap.data() as UserProfile;
              setProfile(profileData);
              setLoading(false);
              setIsAuthReady(true);
            }, (err) => {
              console.error("Profile snapshot error:", err);
              if (err.message.includes('permission-denied')) {
                 signOut(auth);
              }
              setLoading(false);
              setIsAuthReady(true);
            });

            setUser(u);
          } catch (err) {
            console.error("Profile initialization error:", err);
            setLoading(false);
            setIsAuthReady(true);
          }
        })();
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
        setIsAuthReady(true);
      }
    });

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  const isLoggingIn = useRef(false);
  const googleProvider = useMemo(() => new GoogleAuthProvider(), []);

  const login = async () => {
    if (isLoggingIn.current) return;
    isLoggingIn.current = true;
    setError(null);
    try {
      // Ensure auth is ready before attempting login
      if (!auth) throw new Error("Firebase Auth not initialized");
      
      if (Capacitor.isNativePlatform()) {
        try {
          GoogleAuth.initialize();
          const googleUser = await GoogleAuth.signIn();
          if (googleUser && googleUser.authentication && googleUser.authentication.idToken) {
            const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
            await signInWithCredential(auth, credential);
          } else {
            throw new Error('Google Auth did not return an ID token');
          }
        } catch (nativeErr) {
          console.error("Capacitor Google Auth error:", nativeErr);
          throw nativeErr;
        }
      } else {
        await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        console.log("User closed the login popup.");
      } else if (err.code === 'auth/cancelled-popup-request') {
        console.log("Popup request was cancelled by a newer request.");
      } else if (err.code === 'auth/network-request-failed') {
        console.error("Login Error:", err);
        setError("Login failed. If you are in preview, please open the app in a new tab using the icon in the top right, or check your internet connection.");
      } else {
        console.error("Login Error:", err);
        setError("Google login failed: " + (err.message || "Unknown error"));
      }
    } finally {
      isLoggingIn.current = false;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    try {
      const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      // Check if user document exists in Firestore
      const docRef = doc(db, 'users', cleanEmail);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await signOut(auth);
        const msg = "This account no longer exists.";
        setError(msg);
        throw new Error(msg);
      }
      
      if (docSnap.data()?.status === 'deleted') {
        await signOut(auth);
        const msg = "Your account has been deleted by Admin.";
        setError(msg);
        throw new Error(msg);
      }
    } catch (err: any) {
      const errCode = err.code || "";
      const errMessage = err.message || "";
      
      // Only log unexpected errors
      if (!['auth/invalid-credential', 'auth/user-not-found', 'auth/wrong-password'].includes(errCode)) {
        console.error("Email Login Error:", err);
      }
      
      let msg = "";

      if (errCode === 'auth/operation-not-allowed' || errMessage.includes('operation-not-allowed')) {
        msg = "Email/Password login is not enabled in your Firebase Console. Please go to: https://console.firebase.google.com/project/gen-lang-client-0270863630/authentication/providers and enable 'Email/Password'.";
      } else if (errCode === 'auth/invalid-email' || errMessage.includes('invalid-email')) {
        msg = "The email address is not valid.";
      } else if (errCode === 'auth/network-request-failed' || errMessage.includes('network-request-failed')) {
        msg = "Network error. This can happen if your internet is unstable or if the Firebase Auth service is unreachable. Please check your connection and try again. If the problem persists, ensure that your domain is authorized in the Firebase Console.";
      } else if (errCode === 'auth/user-not-found' || errCode === 'auth/wrong-password' || errCode === 'auth/invalid-credential' || 
                 errMessage.includes('user-not-found') || errMessage.includes('wrong-password') || errMessage.includes('invalid-credential')) {
        msg = "Invalid email or password. Please check your credentials or use 'Sign Up' if you are new.";
      } else {
        msg = "Login failed: " + (err.message || "Unknown error");
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  const loginWithPhone = async (phone: string, pass: string) => {
    setError(null);
    const cleanPhone = normalizePhone(phone);
    if (!cleanPhone) {
      const msg = "Please enter a valid phone number.";
      setError(msg);
      throw new Error(msg);
    }
    
    let dummyEmail = `${cleanPhone}@nailpro.com`;
    
    try {
      const q = query(collection(db, 'users'), where('phone', '==', cleanPhone));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        dummyEmail = querySnapshot.docs[0].data().email;
      }
    } catch (err) {
      console.warn("Could not lookup user by phone, falling back to default email format", err);
    }
    
    try {
      const res = await signInWithEmailAndPassword(auth, dummyEmail, pass);
      // Check if user document exists in Firestore
      const docRef = doc(db, 'users', dummyEmail);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await signOut(auth);
        const msg = "This account no longer exists.";
        setError(msg);
        throw new Error(msg);
      }
      
      if (docSnap.data()?.status === 'deleted') {
        await signOut(auth);
        const msg = "Your account has been deleted by Admin.";
        setError(msg);
        throw new Error(msg);
      }
    } catch (err: any) {
      const errCode = err.code || "";
      const errMessage = err.message || "";
      
      // Only log unexpected errors
      if (!['auth/invalid-credential', 'auth/user-not-found', 'auth/wrong-password'].includes(errCode)) {
        console.error("Phone Login Error Details:", {
          code: err.code,
          message: err.message,
          phone: cleanPhone,
          email: dummyEmail
        });
      }
      
      let msg = "";
      
      // auth/invalid-credential is the modern generic error for wrong user or wrong password
      if (errCode === 'auth/user-not-found' || errCode === 'auth/wrong-password' || errCode === 'auth/invalid-credential' ||
          errMessage.includes('user-not-found') || errMessage.includes('wrong-password') || errMessage.includes('invalid-credential')) {
        msg = "Invalid phone number or password. Please check your credentials or use 'Sign Up' if you are new.";
      } else if (errCode === 'auth/too-many-requests' || errMessage.includes('too-many-requests')) {
        msg = "Too many failed login attempts. Please try again later or reset your password.";
      } else if (errCode === 'auth/network-request-failed' || errMessage.includes('network-request-failed')) {
        msg = "Network error. This can happen if your internet is unstable or if the Firebase Auth service is unreachable. Please check your connection and try again. If the problem persists, ensure that your domain is authorized in the Firebase Console.";
      } else {
        msg = "Login failed: " + (err.message || "Unknown error");
      }
      
      setError(msg);
      throw new Error(msg);
    }
  };

  const signUp = async (email: string, pass: string, name: string) => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    let newlyCreatedUser: any = null;
    
    try {
      // 1. Check for existing user document to preserve role
      const docRef = doc(db, 'users', cleanEmail);
      console.log('Checking existing user doc for:', cleanEmail);
      const existingDoc = await getDoc(docRef);
      console.log('Existing doc check complete');
      let roleToSet: 'super_admin' | 'owner' | 'cashier' | 'staff' | 'customer' = 'customer';
      let existingCommission = 0;
      let existingPhone = '';
      let existingDob = '';
      let existingPoints = 0;
      
      if (existingDoc.exists()) {
        const existingData = existingDoc.data() as UserProfile;
        if (existingData.role && existingData.role !== 'customer') {
          roleToSet = existingData.role;
        }
        if (existingData.commission) {
          existingCommission = existingData.commission;
        }
        if (existingData.phone) {
          existingPhone = existingData.phone;
        }
        if (existingData.dob) {
          existingDob = existingData.dob;
        }
        if (existingData.points) {
          existingPoints = existingData.points;
        }
      }

      // 2. Create Auth User
      const authResult = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      newlyCreatedUser = authResult.user;
      
      // 3. Update Auth Profile
      await updateProfile(newlyCreatedUser, { displayName: name });
      
      // 4. Create/Update Firestore Document
      const profileData: UserProfile = {
        name: name,
        email: cleanEmail,
        phone: existingPhone,
        role: roleToSet,
        commission: existingCommission,
        uid: newlyCreatedUser.uid,
        points: existingPoints,
        mustChangePassword: false,
        dob: existingDob,
        status: 'active'
      };
      
      console.log('Creating/Updating user profile in Firestore...', profileData);
      try {
        await setDoc(docRef, profileData, { merge: true });
        console.log('User profile created/updated successfully');
      } catch (firestoreErr: any) {
        // CRITICAL: If Firestore write fails, delete the Auth user
        if (newlyCreatedUser) {
          await newlyCreatedUser.delete();
          console.log("Cleaned up Auth user after Firestore failure.");
        }
        throw firestoreErr;
      }

      // 4. Create or Update Customer Record (Only if role is customer)
      if (roleToSet === 'customer') {
        console.log('Checking/Creating customer record for:', cleanEmail);
        try {
          const custQuery = query(collection(db, 'customers'), where('email', '==', cleanEmail));
          const custSnap = await getDocs(custQuery);
          console.log('Customer query complete, found:', custSnap.size);
          if (custSnap.empty) {
            // Create new customer record if it doesn't exist
            await addDoc(collection(db, 'customers'), {
              name: name,
              email: cleanEmail,
              phone: '',
              address: '',
              notes: 'Registered via Email Sign-Up',
              points: existingPoints,
              createdAt: new Date().toISOString()
            });
            console.log('New customer record created');
          } else {
            // Update existing customer record
            await setDoc(custSnap.docs[0].ref, { name: name }, { merge: true });
            console.log('Existing customer record updated');
          }
        } catch (custErr) {
          console.warn("Failed to query customer record, attempting to create one anyway:", custErr);
          try {
            await addDoc(collection(db, 'customers'), {
              name: name,
              email: cleanEmail,
              phone: '',
              address: '',
              notes: 'Registered via Email Sign-Up',
              points: existingPoints,
              createdAt: new Date().toISOString()
            });
            console.log('Customer record created via fallback after query failed');
          } catch (fallbackErr) {
            console.error("Fallback customer creation failed:", fallbackErr);
          }
        }
      }
      
    } catch (err: any) {
      const errCode = err.code || "";
      const errMessage = err.message || "";
      
      // Only log unexpected errors
      if (!['auth/email-already-in-use', 'auth/weak-password'].includes(errCode)) {
        console.error("Sign Up Error:", err);
      }

      let msg = "";

      if (errCode === 'auth/operation-not-allowed' || errMessage.includes('operation-not-allowed')) {
        msg = "Email/Password registration is not enabled in your Firebase Console. Please go to: https://console.firebase.google.com/project/gen-lang-client-0270863630/authentication/providers and enable 'Email/Password'.";
      } else if (errCode === 'auth/email-already-in-use' || errMessage.includes('email-already-in-use')) {
        msg = "This email is already registered. Please try logging in instead.";
      } else if (errCode === 'auth/weak-password' || errMessage.includes('weak-password')) {
        msg = "Password is too weak. Please use at least 6 characters.";
      } else if (err.message?.includes('insufficient permissions')) {
        msg = "Registration failed: Missing or insufficient permissions. Please check your Firestore security rules.";
      } else {
        msg = "Registration failed: " + (err.message || "Unknown error");
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  const signUpWithPhone = async (phone: string, pass: string, dob: string, name: string) => {
    setError(null);
    const cleanPhone = normalizePhone(phone);
    if (cleanPhone.length < 8) throw new Error("Please enter a valid phone number.");
    
    let dummyEmail = `${name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'user'}@nailpro.com`;
    const last4 = cleanPhone.slice(-4);

    let newlyCreatedUser: any = null;
    
    try {
      // 1. Check for existing user document by phone to preserve role/reactivate
      const q = query(collection(db, 'users'), where('phone', '==', cleanPhone));
      const querySnapshot = await getDocs(q);
      
      let existingUserDoc: any = null;
      let existingEmail = "";

      if (!querySnapshot.empty) {
        existingUserDoc = querySnapshot.docs[0].data();
        existingEmail = existingUserDoc.email;
        dummyEmail = existingEmail; // If user already has an email mapped, reuse it
      }

      if (existingUserDoc && existingUserDoc.status === 'deleted') {
        const functions = getFunctions(app, 'asia-southeast1');
        const reactivateUser = httpsCallable(functions, 'reactivateUser');
        const result = await reactivateUser({ phone: cleanPhone, password: pass, name, dob });
        
        if (result.data) {
          // Re-login to get the user object
          await signInWithEmailAndPassword(auth, existingEmail, pass);
          return;
        }
      }

      // 1.5 Check for existing user document to preserve role
      let roleToSet: 'super_admin' | 'owner' | 'cashier' | 'staff' | 'customer' = 'customer';
      let existingCommission = 0;
      let existingDob = dob;
      let existingPoints = 0;
      
      if (existingUserDoc) {
        if (existingUserDoc.role && existingUserDoc.role !== 'customer') {
          roleToSet = existingUserDoc.role;
        }
        if (existingUserDoc.commission) {
          existingCommission = existingUserDoc.commission;
        }
        if (existingUserDoc.dob) {
          existingDob = existingUserDoc.dob;
        }
        if (existingUserDoc.points) {
          existingPoints = existingUserDoc.points;
        }
      }

      // 2. Create Auth User
      let authResult;
      try {
        authResult = await createUserWithEmailAndPassword(auth, dummyEmail, pass);
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          // Append phone's last 4 if username hits collision
          dummyEmail = `${name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'user'}${last4}@nailpro.com`;
          authResult = await createUserWithEmailAndPassword(auth, dummyEmail, pass);
        } else {
          throw err;
        }
      }
      newlyCreatedUser = authResult.user;
      
      // We will define the docRef using the dummyEmail so it's consistent
      const userDocRef = doc(db, 'users', dummyEmail);
      
      // 3. Update Auth Profile
      await updateProfile(newlyCreatedUser, { displayName: name });
      
      // 4. Create/Update Firestore Document
      const profileData: UserProfile = {
        name: name,
        email: dummyEmail,
        phone: cleanPhone,
        role: roleToSet,
        commission: existingCommission,
        uid: newlyCreatedUser.uid,
        points: existingPoints,
        mustChangePassword: false,
        dob: existingDob,
        last4Digits: last4,
        status: 'active'
      };
      
      console.log('Creating/Updating user profile in Firestore (phone)...', profileData);
      try {
        await setDoc(userDocRef, profileData, { merge: true });
        console.log('User profile created/updated successfully (phone)');
      } catch (firestoreErr: any) {
        // CRITICAL: If Firestore write fails, delete the Auth user
        if (newlyCreatedUser) {
          try {
            await newlyCreatedUser.delete();
            console.log("Cleaned up Auth user after Firestore failure.");
          } catch (deleteErr) {
            console.error("Failed to cleanup Auth user:", deleteErr);
          }
        }
        throw firestoreErr;
      }

      // 5. Create or Update Customer Record (Only if role is customer)
      if (roleToSet === 'customer') {
        console.log('Checking/Creating customer record for phone:', cleanPhone);
        try {
          const custQuery = query(collection(db, 'customers'), where('email', '==', dummyEmail));
          const custSnap = await getDocs(custQuery);
          console.log('Customer query complete (phone), found:', custSnap.size);
          if (custSnap.empty) {
            // Create new customer record if it doesn't exist
            await addDoc(collection(db, 'customers'), {
              name: name,
              phone: cleanPhone,
              email: dummyEmail,
              address: '',
              notes: 'Registered via Phone Sign-Up',
              points: existingPoints,
              createdAt: new Date().toISOString()
            });
            console.log('New customer record created (phone)');
          } else {
            // Update existing customer record
            await setDoc(custSnap.docs[0].ref, { name: name, email: dummyEmail }, { merge: true });
            console.log('Existing customer record updated (phone)');
          }
        } catch (custErr) {
          console.warn("Failed to query customer record, attempting to create one anyway:", custErr);
          try {
            await addDoc(collection(db, 'customers'), {
              name: name,
              phone: cleanPhone,
              email: dummyEmail,
              address: '',
              notes: 'Registered via Phone Sign-Up',
              points: existingPoints,
              createdAt: new Date().toISOString()
            });
            console.log('Customer record created via fallback after query failed (phone)');
          } catch (fallbackErr) {
            console.error("Fallback customer creation failed (phone):", fallbackErr);
          }
        }
      }

      setProfile(profileData);
      setUser(newlyCreatedUser);
      
    } catch (err: any) {
      console.error("signUpWithPhone Error Details:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      console.error("signUpWithPhone Raw Error:", err);
      const errCode = err.code || "";
      const errMessage = err.message || "";

      if (errCode === 'auth/email-already-in-use' || errMessage.includes('email-already-in-use')) {
        const msg = "This phone number is already registered. Please try logging in instead.";
        setError(msg);
        throw new Error(msg);
      } else if (errCode === 'auth/weak-password' || errMessage.includes('weak-password')) {
        const msg = "Password is too weak. Please use at least 6 characters.";
        setError(msg);
        throw new Error(msg);
      } else if (errCode === 'auth/invalid-email' || errMessage.includes('invalid-email')) {
        const msg = "Invalid phone number format. Please check and try again.";
        setError(msg);
        throw new Error(msg);
      } else if (errMessage.includes('insufficient permissions')) {
        const msg = "Database permission denied. Your Firebase security rules are blocking access. Please check the firestore.rules configuration for 'users' and 'customers' collections.";
        setError(msg);
        throw new Error(msg);
      } else {
        const msg = "Registration failed: " + (errMessage || "Unknown error");
        setError(msg);
        throw new Error(msg);
      }
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
    } catch (err: any) {
      console.error("Reset Password Error:", err);
      let msg = "";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        msg = "No account found with this email.";
      } else {
        msg = "Failed to send reset email: " + err.message;
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  const resetPasswordWithIdentity = async (phone: string, name: string, dob: string, newPass: string) => {
    setError(null);
    const cleanPhone = normalizePhone(phone);

    try {
      const functions = getFunctions(app, 'asia-southeast1');
      const verifyAndReset = httpsCallable(functions, 'verifyIdentityAndResetPassword');
      const result = await verifyAndReset({ 
        name, 
        phone: cleanPhone, 
        dob, 
        newPassword: newPass 
      });

      if (result.data) {
        // Success!
        return;
      } else {
        throw new Error("Failed to update password. Please try again.");
      }
    } catch (err: any) {
      console.error("Identity Reset Error:", err);
      const msg = err.message || "Verification failed. Please check your information.";
      setError(msg);
      throw new Error(msg);
    }
  };

  const changePassword = async (currentPass: string, newPass: string) => {
    if (!user || !user.email) throw new Error("No user logged in.");
    setError(null);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPass);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPass);
    } catch (err: any) {
      console.error("Change Password Error:", err);
      let msg = "";
      const errCode = err.code || "";
      const errMessage = err.message || "";
      if (errCode === 'auth/wrong-password' || errCode === 'auth/invalid-credential' || errMessage.includes('invalid-credential') || errMessage.includes('wrong-password')) {
        msg = "Current password is incorrect.";
      } else if (errCode === 'auth/weak-password' || errMessage.includes('weak-password')) {
        msg = "New password is too weak. Please use at least 6 characters.";
      } else if (errCode === 'auth/requires-recent-login' || errMessage.includes('requires-recent-login')) {
        msg = "Please log out and log back in to change your password.";
      } else {
        msg = "Failed to change password: " + errMessage;
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  const forceChangePassword = async (newPass: string) => {
    if (!user || !user.email) throw new Error("No user logged in.");
    setError(null);
    try {
      await updatePassword(user, newPass);
      const docRef = doc(db, 'users', user.email.toLowerCase());
      await updateDoc(docRef, { mustChangePassword: false });
      setProfile(prev => prev ? { ...prev, mustChangePassword: false } : null);
    } catch (err: any) {
      console.error("Force Change Password Error:", err);
      let msg = "";
      if (err.code === 'auth/weak-password') {
        msg = "New password is too weak. Please use at least 6 characters.";
      } else if (err.code === 'auth/requires-recent-login') {
        msg = "Please log out and log back in to change your password.";
      } else {
        msg = "Failed to change password: " + err.message;
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    sessionStorage.removeItem('initial_redirect_done');
    await signOut(auth);
  };

  const isSuperAdmin = profile?.role === 'super_admin' || 
    (user?.email?.toLowerCase() === 'aungsoe366@gmail.com');
  const isOwner = profile?.role === 'owner' || isSuperAdmin;
  const isCashier = profile?.role === 'cashier';
  const isStaffMember = profile?.role === 'staff';
  const isCustomer = profile?.role === 'customer';
  const isAdmin = isSuperAdmin || isOwner;
  const isStaff = isSuperAdmin || isOwner || isCashier || isStaffMember;

  return (
    <AuthContext.Provider value={{ 
      user, profile, loading, isAdmin, isSuperAdmin, isOwner, isCashier, isStaff, isStaffMember, isCustomer,
      login, loginWithEmail, loginWithPhone, signUp, signUpWithPhone, resetPassword, resetPasswordWithIdentity, changePassword, forceChangePassword, logout, error, setError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// --- Components ---

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} />, path: '/', roles: ['super_admin', 'owner', 'cashier', 'staff'] },
    { id: 'pos', label: 'Point of Sale', icon: <ShoppingCart size={18} />, path: '/pos', roles: ['super_admin', 'owner', 'cashier', 'staff'] },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={18} />, path: '/appointments', roles: ['super_admin', 'owner', 'cashier', 'staff', 'customer'] },
    { id: 'history', label: 'Daily Sales', icon: <BarChart2 size={18} />, path: '/history', roles: ['super_admin', 'owner', 'cashier', 'staff'] },
    { id: 'staff-commissions', label: 'Commissions', icon: <UserIcon size={18} />, path: '/staff-commissions', roles: ['super_admin', 'owner', 'cashier', 'staff'] },
    { id: 'monthly', label: 'Monthly Summary', icon: <LayoutGrid size={18} />, path: '/monthly', roles: ['super_admin', 'owner', 'cashier'] },
    { id: 'sales-report', label: 'Sales Report', icon: <FileText size={18} />, path: '/sales-report', roles: ['super_admin', 'owner', 'cashier'] },
    { id: 'expenses', label: 'Expenses', icon: <TrendingDown size={18} />, path: '/expenses', roles: ['super_admin', 'owner', 'cashier'] },
    { id: 'manage', label: 'Management', icon: <Settings size={18} />, path: '/manage', roles: ['super_admin', 'owner'] },
    { id: 'change-password', label: 'Change Password', icon: <Lock size={18} />, path: '/change-password', roles: ['super_admin', 'owner', 'cashier', 'staff', 'customer'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(profile?.role || ''));

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-black/60  z-[10000] transition-opacity duration-500",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onClose}
      />
      <div className={cn(
        "fixed top-0 left-0 w-[300px] h-full bg-card z-[10001] transition-transform duration-500 ease-out flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.2)]",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 border-b border-border/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="relative z-10">
            <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-2 block">{profile?.role}</span>
            <h2 className="text-2xl font-black text-foreground tracking-tighter leading-tight">{profile?.name}</h2>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest opacity-60">{profile?.email}</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
          {filteredItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => { navigate(item.path); onClose(); }}
                className={cn(
                  "w-full flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 scale-[1.02]" 
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className={cn(
                  "mr-4 transition-all duration-300 relative z-10",
                  isActive ? "text-primary-foreground scale-110" : "text-primary group-hover:scale-120"
                )}>
                  {item.icon}
                </span>
                <span className="text-sm font-bold tracking-tight relative z-10">{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto relative z-10" />}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border/50 bg-muted/5">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl text-red-500 font-black text-xs tracking-[0.2em] border border-red-500/20 hover:bg-red-500 hover:text-foreground transition-all duration-300 shadow-lg hover:shadow-red-500/20 active:scale-95"
          >
            <LogOut size={18} />
            LOGOUT
          </button>
        </div>
      </div>
    </>
  );
};

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-[1000] flex justify-between items-center px-6 py-4 bg-card/80  border-b border-border/50 transition-all duration-500">
      <div className="flex items-center gap-6">
        <button 
          onClick={onMenuClick} 
          className="text-primary hover:scale-110 active:scale-90 transition-all p-2 bg-primary/5 rounded-xl border border-primary/10"
        >
          <Menu size={20} />
        </button>
        <div 
          onClick={() => navigate('/')} 
          className="flex flex-col cursor-pointer group"
        >
          <span className="text-xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors leading-none">NAIL PRO</span>
          <span className="text-[8px] font-black text-primary tracking-[0.4em] mt-0.5 opacity-80 uppercase">Luxury Salon</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
      </div>
    </header>
  );
};

// --- Pages ---

const CATEGORY_ICONS = [
  { name: 'Scissors', icon: Scissors },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Smile', icon: Smile },
  { name: 'Heart', icon: Heart },
  { name: 'Star', icon: Star },
  { name: 'Zap', icon: Zap },
  { name: 'Flower2', icon: Flower2 },
  { name: 'Brush', icon: Brush },
  { name: 'SprayCan', icon: SprayCan },
  { name: 'Waves', icon: Waves },
  { name: 'LayoutGrid', icon: LayoutGrid },
];

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll window to top
    window.scrollTo(0, 0);
    // Attempt to reset any custom scrollable containers if needed
    const scrollContainers = document.querySelectorAll('.overflow-y-auto');
    scrollContainers.forEach(container => {
      container.scrollTop = 0;
    });
  }, [pathname]);

  return null;
};

const PullToRefresh: React.FC<{ children: React.ReactNode; onRefresh: () => Promise<void> }> = ({ children, onRefresh }) => {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const MAX_PULL = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;
    const y = e.touches[0].clientY;
    const dy = y - startY;
    if (dy > 0 && window.scrollY === 0) {
      setCurrentY(Math.min(dy, MAX_PULL));
      if (e.cancelable) e.preventDefault();
    } else {
      setIsPulling(false);
      setCurrentY(0);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;
    setIsPulling(false);
    if (currentY >= MAX_PULL * 0.8) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setCurrentY(0);
  };

  return (
    <div 
      className="relative w-full h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="absolute left-0 w-full flex justify-center items-center overflow-visible transition-all duration-300 z-50 pointer-events-none"
        style={{ 
          top: `${isRefreshing ? 20 : Math.max(-40, currentY - 40)}px`,
          opacity: isRefreshing ? 1 : currentY / MAX_PULL 
        }}
      >
        <div className={`w-8 h-8 bg-card border border-border shadow-lg text-primary flex items-center justify-center rounded-full ${isRefreshing ? 'animate-spin' : ''}`} 
             style={{ transform: `rotate(${currentY * 3}deg)` }}
        >
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
      <div 
        ref={contentRef}
        className="w-full h-full"
      >
        {children}
      </div>
    </div>
  );
};

export const CustomerDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto animate-in fade-in zoom-in duration-500">
      <div className="bg-[#4A2E31] text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-2">
          <h2 className="text-3xl font-serif">Welcome back, {profile?.name || 'Beautiful'}!</h2>
          <p className="text-white/80">Ready for your next salon experience?</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col items-center text-center space-y-4">
           <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
             <Calendar size={32} />
           </div>
           <div className="space-y-1">
             <h3 className="font-bold text-lg">Book an Appointment</h3>
             <p className="text-sm text-muted-foreground">Schedule your next visit easily with our online booking system.</p>
           </div>
           <button 
             onClick={() => navigate('/appointments')}
             className="mt-4 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg w-full md:w-auto"
           >
             Book Now
           </button>
         </div>

         <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col items-center text-center space-y-4">
           <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
             <Star size={32} />
           </div>
           <div className="space-y-1">
             <h3 className="font-bold text-lg">Loyalty Points</h3>
             <p className="text-sm text-muted-foreground">You currently have <strong className="text-green-500 text-xl">{profile?.points || 0}</strong> points.</p>
           </div>
         </div>
      </div>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const { profile, isAdmin, isCustomer } = useAuth();
  const navigate = useNavigate();
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [last7DaysSales, setLast7DaysSales] = useState<{ date: string; amount: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const today = getLocalISODate();

  useEffect(() => {
    if (isCustomer) return;

    const qSales = query(collection(db, 'sales'), where('date', '==', today));
    const qAppts = query(collection(db, 'appointments'), where('date', '==', today));

    const unsubSales = onSnapshot(qSales, (snapshot) => {
      setSales(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'sales'));

    let unsubExp = () => {};
    if (isAdmin) {
      const qExp = query(collection(db, 'expenses'), where('date', '==', today));
      unsubExp = onSnapshot(qExp, (snapshot) => {
        setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense)));
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'expenses'));
    }

    const unsubAppts = onSnapshot(qAppts, (snapshot) => {
      let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      data.sort((a,b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return b.time.localeCompare(a.time);
      });
      setAppointments(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'appointments'));

    // Fetch last 7 days for chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = getLocalISODate(sevenDaysAgo);

    const qChart = query(
      collection(db, 'sales'), 
      where('date', '>=', sevenDaysAgoStr),
      orderBy('date', 'asc')
    );

    const unsubChart = onSnapshot(qChart, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as Sale);
      const chartData: { [key: string]: number } = {};
      
      // Initialize last 7 days with 0
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dStr = getLocalISODate(d);
        chartData[dStr] = 0;
      }

      data.forEach(s => {
        if (chartData[s.date] !== undefined) {
          chartData[s.date] += s.total;
        }
      });

      setLast7DaysSales(Object.entries(chartData).map(([date, amount]) => ({
        date: format(parse(date, 'yyyy-MM-dd', new Date()), 'MMM dd'),
        amount
      })));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'sales'));

    return () => {
      unsubSales();
      unsubExp();
      unsubAppts();
      unsubChart();
    };
  }, [profile, today]);

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalSales - totalExpenses;
  const pendingAppts = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;

  const stats = [
    { label: "Today's Sales", value: `${totalSales.toLocaleString()} Ks`, icon: <DollarSign size={24} />, color: "text-green-500", bg: "bg-green-500/10" },
    ...(isAdmin ? [
      { label: "Today's Expenses", value: `${totalExpenses.toLocaleString()} Ks`, icon: <TrendingDown size={24} />, color: "text-red-500", bg: "bg-red-500/10" },
      { label: "Net Profit", value: `${netProfit.toLocaleString()} Ks`, icon: <TrendingUp size={24} />, color: "text-blue-500", bg: "bg-blue-500/10" },
    ] : []),
    { label: "Appointments", value: pendingAppts.toString(), icon: <Calendar size={24} />, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-1">
          <h3 className="text-3xl font-black tracking-tighter text-foreground uppercase">Dashboard</h3>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Business Overview for {formatFullDate(new Date())}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/pos')}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-black text-xs tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={16} />
            NEW SALE
          </button>
          <button 
            onClick={() => navigate('/appointments')}
            className="flex items-center gap-2 bg-card border border-border px-6 py-3 rounded-2xl font-black text-xs tracking-widest hover:border-primary transition-all"
          >
            <Calendar size={16} />
            APPOINTMENTS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-card p-6 rounded-[2rem] border border-border shadow-sm space-y-4 relative overflow-hidden group"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500", s.bg, s.color)}>
              {s.icon}
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{s.label}</p>
              <h4 className="text-2xl font-black text-foreground tracking-tighter">{s.value}</h4>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-3xl group-hover:bg-primary/10 transition-colors" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-card rounded-[2.5rem] border border-border p-8 shadow-sm space-y-6 flex flex-col">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-4 bg-primary rounded-full"></div>
              Revenue Trend (Last 7 Days)
            </h4>
          </div>
          <div className="flex-1 h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7DaysSales}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--color-muted)' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--color-muted)' }}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-card)', 
                    borderColor: 'var(--color-border)', 
                    borderRadius: '1rem',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                  itemStyle={{ color: 'var(--color-primary)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="var(--color-primary)" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats / Info */}
        <div className="bg-primary rounded-[2.5rem] p-8 text-primary-foreground space-y-8 relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="relative z-10 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] opacity-60">Today's Performance</h4>
            <h2 className="text-4xl font-black tracking-tighter leading-none">
              {netProfit > 0 ? "+" : ""}{netProfit.toLocaleString()} <span className="text-lg opacity-60">Ks</span>
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Net Profit after expenses</p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="bg-white/10  p-4 rounded-2xl border border-border flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Sales Count</span>
              <span className="text-lg font-black">{sales.length}</span>
            </div>
            <div className="bg-white/10  p-4 rounded-2xl border border-border flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Avg. Ticket</span>
              <span className="text-lg font-black">{sales.length > 0 ? Math.floor(totalSales / sales.length).toLocaleString() : 0} Ks</span>
            </div>
            <div className="bg-white/10  p-4 rounded-2xl border border-border flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Expense Ratio</span>
              <span className="text-lg font-black">{totalSales > 0 ? Math.floor((totalExpenses / totalSales) * 100) : 0}%</span>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 w-64 h-64 bg-input rounded-full -mr-32 -mb-32 blur-3xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales */}
        <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 border-b border-border flex justify-between items-center bg-muted/5">
            <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-4 bg-primary rounded-full"></div>
              Recent Sales
            </h4>
            <button onClick={() => navigate('/history')} className="text-[10px] font-black text-primary hover:underline tracking-widest">VIEW ALL</button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px] scrollbar-hide">
            {sales.length === 0 ? (
              <div className="p-20 text-center space-y-4 opacity-40">
                <ShoppingCart size={40} className="mx-auto text-muted-foreground" />
                <p className="text-xs font-bold uppercase tracking-widest">No sales today yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {sales.slice(0, 10).map((s) => (
                  <div key={s.id} className="p-5 flex justify-between items-center hover:bg-muted/5 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-xs">
                        {s.customerName ? s.customerName[0].toUpperCase() : 'G'}
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{s.customerName || 'Guest Customer'}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                          {formatDisplayDate(s.dateTime)} • {formatTime(s.dateTime)} • {s.method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-foreground">{s.total.toLocaleString()} Ks</p>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{s.items.length} items</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 border-b border-border flex justify-between items-center bg-muted/5">
            <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-4 bg-purple-500 rounded-full"></div>
              Today's Appointments
            </h4>
            <button onClick={() => navigate('/appointments')} className="text-[10px] font-black text-primary hover:underline tracking-widest">VIEW CALENDAR</button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px] scrollbar-hide">
            {appointments.length === 0 ? (
              <div className="p-20 text-center space-y-4 opacity-40">
                <Calendar size={40} className="mx-auto text-muted-foreground" />
                <p className="text-xs font-bold uppercase tracking-widest">No appointments today</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {appointments.sort((a, b) => a.time.localeCompare(b.time)).map((a) => (
                  <div key={a.id} className="p-5 flex justify-between items-center hover:bg-muted/5 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs",
                        a.status === 'confirmed' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                      )}>
                        {a.time}
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{a.customerName}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{a.serviceName} • {a.staffName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border",
                        a.status === 'confirmed' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      )}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const POSPage: React.FC = () => {
  const { profile, isAdmin, isStaff, isStaffMember, isCustomer } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [staff, setStaff] = useState<UserProfile[]>([]);
  const [selectedStaffEmail, setSelectedStaffEmail] = useState('');
  const [payments, setPayments] = useState<{ method: 'Cash' | 'KBZPay' | 'WavePay' | 'AYA Pay' | 'CB PAY' | 'OK$'; amount: number }[]>([
    { method: 'Cash', amount: 0 }
  ]);
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [showLoyaltyPrompt, setShowLoyaltyPrompt] = useState(false);
  const [isLoyaltyDiscountActive, setIsLoyaltyDiscountActive] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [pendingSaleParams, setPendingSaleParams] = useState<{sale: Omit<Sale, 'id'>, overridePayments?: typeof payments} | null>(null);
  const [loadingPOS, setLoadingPOS] = useState(true);

  const LOYALTY_THRESHOLD = 500;
  const LOYALTY_DISCOUNT = 10; // 10%

  useEffect(() => {
    if (!isStaff) return;
    const q = query(collection(db, 'services'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      setLoadingPOS(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'services');
      setLoadingPOS(false);
    });
    return unsubscribe;
  }, [profile]);

  useEffect(() => {
    if (!isStaff) return;
    const q = query(collection(db, 'categories'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'categories'));
    return unsubscribe;
  }, [profile]);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const uniqueStaff = new Map<string, UserProfile>();
      snapshot.docs.forEach(doc => {
        const data = doc.data() as UserProfile;
        // Client-side filtering: Hide super_admin and customers from the staff list
        const superAdminEmails = ['aungsoe366@gmail.com'];
        const isExcluded = data.role === 'super_admin' || 
                          data.role === 'customer' || 
                          (data.email && superAdminEmails.includes(data.email.toLowerCase().trim()));
        if (data.email && !isExcluded) {
          const email = data.email.toLowerCase().trim();
          // Prefer documents that have a UID (already logged in)
          if (!uniqueStaff.has(email) || data.uid) {
            uniqueStaff.set(email, { ...data, id: doc.id });
          }
        }
      });
      const staffList = Array.from(uniqueStaff.values());
      setStaff(staffList);
      if (profile && !selectedStaffEmail) setSelectedStaffEmail(profile.email);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));
    return unsubscribe;
  }, [profile]);

  useEffect(() => {
    if (!isStaff) return;
    const q = query(collection(db, 'customers'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'customers'));
    return unsubscribe;
  }, [profile]);

  useEffect(() => {
    if (!isStaff) return;
    // Fetch pending, confirmed, and completed appointments for today or recent
    // We filter out completed ones that were already processed for points in memory
    const q = query(
      collection(db, 'appointments'), 
      where('status', 'in', ['pending', 'confirmed', 'completed']),
      orderBy('date', 'desc'),
      orderBy('time', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allAppts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      // Filter: only show completed ones if they haven't been processed for points yet
      const filteredAppts = allAppts.filter(a => a.status !== 'completed' || !a.pointsProcessed);
      setAppointments(filteredAppts);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'appointments'));
    return unsubscribe;
  }, [profile]);

  useEffect(() => {
    if (isCustomer) return;
    const docRef = doc(db, 'settings', 'salon');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) setShopSettings(docSnap.data() as ShopSettings);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/salon'));
    return unsubscribe;
  }, [profile]);

  const categoryList = ['All', ...categories.map(c => c.name)];

  const filteredServices = services.filter(s => {
    const matchesCategory = selectedCategory === 'All' || (s.category === selectedCategory);
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const suggestions = search.length > 0 
    ? services.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5)
    : [];

  // Remove automatic loyalty prompt useEffect
  
  const applyLoyaltyDiscount = () => {
    setIsLoyaltyDiscountActive(true);
    setCart(prev => prev.map(item => ({ ...item, disP: Math.max(item.disP, LOYALTY_DISCOUNT) })));
    setShowLoyaltyPrompt(false);
  };

  const addToCart = (service: Service) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === service.id);
      const initialDiscount = isLoyaltyDiscountActive ? LOYALTY_DISCOUNT : 0;
      if (existing) {
        return prev.map(item => item.id === service.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...service, qty: 1, disP: initialDiscount }];
    });
  };

  const updateCartItem = (index: number, updates: Partial<CartItem>) => {
    setCart(prev => prev.map((item, i) => i === index ? { ...item, ...updates } : item));
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (profile?.email && !selectedStaffEmail) {
      setSelectedStaffEmail(profile.email);
    }
  }, [profile, selectedStaffEmail]);

  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalDiscount = cart.reduce((sum, item) => sum + (item.price * item.qty * (item.disP / 100)), 0);
  const pointsDiscount = pointsToRedeem * 10; // 1 point = 10 Ks
  const netTotal = Math.max(0, subTotal - totalDiscount - pointsDiscount);
  const pointsEarned = Math.floor(netTotal / 1000); // 1 point per 1000 Ks

  // Update the first payment amount when netTotal changes, if there's only one payment
  useEffect(() => {
    if (payments.length === 1) {
      setPayments([{ ...payments[0], amount: netTotal }]);
    }
  }, [netTotal]);

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = netTotal - totalPaid;

  const todayStr = getLocalISODate();
  const todaysAppointments = appointments.filter(a => a.date === todayStr);

  const addPaymentMethod = () => {
    setPayments([...payments, { method: 'Cash', amount: Math.max(0, remainingAmount) }]);
  };

  const removePaymentMethod = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const updatePayment = (index: number, updates: Partial<{ method: any; amount: number }>) => {
    setPayments(payments.map((p, i) => i === index ? { ...p, ...updates } : p));
  };

  const customerSuggestions = customerSearch.length > 0 
    ? customers.filter(c => 
        c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
        c.phone.includes(customerSearch)
      ).slice(0, 5)
    : [];

  const appointmentSuggestions = appointmentSearch.length > 0
    ? appointments.filter(a => 
        a.customerName.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
        a.customerPhone.includes(appointmentSearch) ||
        a.serviceName.toLowerCase().includes(appointmentSearch.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSelectAppointment = (appt: Appointment) => {
    // 1. Set customer
    if (appt.customerId && appt.customerId !== 'manual') {
      setSelectedCustomerId(appt.customerId);
    } else {
      // Try to find customer by phone or name if phone is not empty
      let customer = undefined;
      if (appt.customerPhone && appt.customerPhone.trim() !== '') {
        customer = customers.find(c => c.phone === appt.customerPhone);
      }
      if (customer) {
        setSelectedCustomerId(customer.id);
      } else {
        setSelectedCustomerId('');
      }
    }

    // 2. Add service to cart
    const service = services.find(s => s.id === appt.serviceId || s.name === appt.serviceName);
    if (service) {
      addToCart(service);
    }

    // 3. Set staff
    if (appt.staffEmail) {
      setSelectedStaffEmail(appt.staffEmail);
    }

    // 4. Set appointment ID and points
    setSelectedAppointmentId(appt.id);
    setPointsToRedeem(appt.pointsToRedeem || 0);
    setAppointmentSearch('');
  };

  const handleCheckout = (overridePayments?: typeof payments) => {
    if (cart.length === 0) return;
    const selectedStaff = staff.find(s => s.email === selectedStaffEmail);
    if (!selectedStaff) return;

    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

    const now = new Date();
    const localDateStr = getLocalISODate(now);
    
    const finalPayments = overridePayments || payments;
    const finalTotalPaid = finalPayments.reduce((sum, p) => sum + p.amount, 0);

    if (finalTotalPaid !== netTotal) {
      alert(`Payment mismatch! Total paid: ${finalTotalPaid.toLocaleString()} Ks, Net Total: ${netTotal.toLocaleString()} Ks`);
      return;
    }

    const commissionableSubtotal = cart
      .filter(item => item.allowCommission !== false)
      .reduce((sum, item) => sum + (item.price * item.qty * (1 - item.disP / 100)), 0);
    
    // Proportionally reduce commissionable total by any points redeemed
    const effectivePointsDiscount = subTotal > 0 ? pointsDiscount * (commissionableSubtotal / subTotal) : 0;
    const commissionableTotal = Math.max(0, commissionableSubtotal - effectivePointsDiscount);
    
    const commissionAmt = Math.round(commissionableTotal * (selectedStaff.commission / 100));

    const sale: Omit<Sale, 'id'> = {
      date: localDateStr,
      dateTime: now.toISOString(),
      staff: selectedStaff.name,
      staffEmail: selectedStaff.email,
      customerName: selectedCustomer?.name || '',
      customerPhone: selectedCustomer?.phone || '',
      total: netTotal,
      payments: finalPayments,
      method: finalPayments.map(p => p.method).join(', '),
      commission: commissionAmt,
      pointsEarned,
      pointsRedeemed: pointsToRedeem,
      items: cart.map(item => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
        disP: item.disP
      }))
    };

    setPendingSaleParams({ sale, overridePayments });
    setShowPrintPreview(true);
  };

  const confirmCheckout = async (print: boolean) => {
    if (!pendingSaleParams) return;
    const { sale } = pendingSaleParams;

    try {
      await addDoc(collection(db, 'sales'), sale);
      
      const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
      if (selectedCustomer) {
        const newPoints = (selectedCustomer.points || 0) + (sale.pointsEarned || 0) - (sale.pointsRedeemed || 0);
        await updateDoc(doc(db, 'customers', selectedCustomer.id), {
          points: newPoints
        });
        
        if (selectedCustomer.email) {
          const userDocRef = doc(db, 'users', selectedCustomer.email.toLowerCase());
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
             await updateDoc(userDocRef, { points: newPoints });
          }
        }
      }

      if (selectedAppointmentId) {
        await updateDoc(doc(db, 'appointments', selectedAppointmentId), {
          status: 'completed',
          pointsProcessed: true
        });
      }

      if (print) {
        const printText = generateReceiptText(sale, shopSettings);
        if (Capacitor.isNativePlatform()) {
          const htmlStr = "<html><body style='margin:0;padding:10px;'><pre style='font-family:monospace;font-size:12px;'>" + printText.replace(/</g, '&lt;').replace(/>/g, '&gt;') + "</pre></body></html>";
          CapPrinter.printHtml({ name: 'Receipt', html: htmlStr }).catch(e => {
            console.error('Printer error:', e);
            alert('Failed to print: ' + String(e));
          });
        } else {
          const rawbtUrl = "intent:base64," + btoa(unescape(encodeURIComponent(printText))) + "#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end;";
          window.location.href = rawbtUrl;
        }
      }

      setCart([]);
      setSelectedCustomerId('');
      setSelectedAppointmentId('');
      setAppointmentSearch('');
      setPointsToRedeem(0);
      setIsLoyaltyDiscountActive(false);
      setPayments([{ method: 'Cash', amount: 0 }]);
      setShowPrintPreview(false);
      setPendingSaleParams(null);
      alert("Sale saved successfully!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'sales');
    }
  };

  const handleQuickCheckout = (method: 'Cash' | 'KBZPay' | 'WavePay') => {
    handleCheckout([{ method, amount: netTotal }]);
  };

  const paymentMethods = [
    { id: 'Cash', label: 'Cash' },
    { id: 'KBZPay', label: 'KBZPay' },
    { id: 'WavePay', label: 'WavePay' },
    { id: 'AYA Pay', label: 'AYA Pay' },
    { id: 'CB PAY', label: 'CB PAY' },
    { id: 'OK$', label: 'OK$' },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-73px)] overflow-y-auto lg:overflow-hidden bg-background">
      {/* Left Side: Services Selection */}
      <div className="flex-none lg:flex-1 flex flex-col min-w-0 border-r border-border/50">
        <div className="p-4 space-y-4 bg-card  border-b border-border/50">
          <div className="relative z-50">
            <div className="relative">
              <FloatingInput 
                label="Search Service..." 
                value={search}
                onChange={setSearch}
                onFocusClear
                className="mt-0"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-600 transition-colors z-10"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-card border border-primary/30 rounded-2xl mt-2 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[1001]">
                {suggestions.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      addToCart(s);
                      setSearch('');
                    }}
                    className="w-full text-left p-4 border-b border-border/50 last:border-0 hover:bg-primary/5 flex justify-between items-center transition-colors group"
                  >
                    <div>
                      <span className="text-foreground font-bold block group-hover:text-primary transition-colors">{s.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">{s.category || 'General'}</span>
                    </div>
                    <span className="text-primary font-black">{s.price.toLocaleString()} Ks</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
            {categoryList.map(cat => {
              const categoryData = categories.find(c => c.name === cat);
              const IconComp = categoryData 
                ? (CATEGORY_ICONS.find(i => i.name === categoryData.icon)?.icon || LayoutGrid)
                : (cat === 'All' ? LayoutGrid : LayoutGrid);
              
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border whitespace-nowrap flex items-center gap-2.5",
                    selectedCategory === cat 
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105" 
                      : "bg-card/50 text-muted-foreground border-border/50 hover:border-primary/30 hover:text-primary"
                  )}
                >
                  <IconComp size={14} />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-none lg:flex-1 overflow-y-visible lg:overflow-y-auto p-4 scrollbar-hide">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {loadingPOS ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card border border-border/50 rounded-2xl p-4 text-left shadow-sm min-h-[100px] flex flex-col justify-between animate-pulse">
                   <div>
                     <div className="h-2 bg-primary/10 rounded w-1/3 mb-2"></div>
                     <div className="h-4 bg-primary/20 rounded w-3/4 mb-1"></div>
                     <div className="h-4 bg-primary/20 rounded w-1/2"></div>
                   </div>
                   <div className="mt-4 flex justify-between items-end">
                     <div className="h-3 bg-primary/10 rounded w-1/2"></div>
                     <div className="w-6 h-6 rounded-lg bg-primary/10"></div>
                   </div>
                </div>
              ))
            ) : filteredServices.length > 0 ? (
              filteredServices.map(s => (
                <button
                  key={s.id}
                  onClick={() => addToCart(s)}
                  className={cn(
                    "border rounded-2xl p-4 text-left shadow-sm group relative overflow-hidden flex flex-col justify-between min-h-[100px]",
                    "bg-card border-border/50",
                    "hover:shadow-xl hover:border-primary/30",
                    "active:scale-95 active:bg-amber-500/5 transition-transform duration-75 ease-out"
                  )}
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-primary/10 transition-colors" />
                  <div className="relative z-10">
                    <span className="text-[8px] text-primary font-black uppercase tracking-[0.2em] block mb-1 opacity-60">{s.category}</span>
                    <b className="block text-foreground text-sm font-black tracking-tight leading-tight line-clamp-2 group-hover:text-primary transition-colors">{s.name}</b>
                  </div>
                  <div className="mt-4 relative z-10">
                    <span className="text-xs text-muted-foreground font-bold">{s.price.toLocaleString()} Ks</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-muted/10 rounded-full flex items-center justify-center mx-auto">
                  <Search size={24} className="text-muted-foreground/40" />
                </div>
                <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">No services found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: Cart & Checkout */}
      <div className="w-full lg:w-[400px] xl:w-[450px] bg-card/50  flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.05)] border-t lg:border-t-0 border-border/50">
        <div className="p-6 border-b border-border/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <ShoppingCart size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground tracking-tight">Current Order</h2>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{cart.length} items selected</p>
            </div>
          </div>
          {cart.length > 0 && (
            <button 
              onClick={() => {
                setCart([]);
                setIsLoyaltyDiscountActive(false);
                setPointsToRedeem(0);
                setSelectedCustomerId('');
                setSelectedAppointmentId('');
                setCustomerSearch('');
                setAppointmentSearch('');
              }}
              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Clear Cart"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        <div className="flex-none lg:flex-1 overflow-y-visible lg:overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map((item, i) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-foreground tracking-tight truncate group-hover:text-primary transition-colors">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{item.price.toLocaleString()} Ks</p>
                        {item.disP > 0 && (
                          <div className="flex gap-1">
                            <span className="text-[8px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest border border-red-500/20">
                              -{item.disP}%
                            </span>
                            {isLoyaltyDiscountActive && item.disP >= LOYALTY_DISCOUNT && (
                              <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest border border-border">
                                Loyalty
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center bg-muted/5 rounded-xl p-1 border border-border/50">
                      <button 
                        onClick={() => updateCartItem(i, { qty: Math.max(1, item.qty - 1) })}
                        className="w-7 h-7 flex items-center justify-center hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-all"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <span className="w-8 text-center font-black text-sm">{item.qty}</span>
                      <button 
                        onClick={() => updateCartItem(i, { qty: item.qty + 1 })}
                        className="w-7 h-7 flex items-center justify-center hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-all"
                      >
                        <ArrowUp size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border/30 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Discount %</span>
                      <input 
                        type="number" 
                        value={item.disP || 0}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= 0 && val <= 100) {
                            updateCartItem(i, { disP: val });
                          }
                        }}
                        className="w-12 bg-input border border-border/50 rounded-lg px-2 py-1 text-[10px] font-black text-center focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <span className="font-black text-primary">
                      {(item.price * item.qty * (1 - item.disP / 100)).toLocaleString()} Ks
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <div className="w-20 h-20 bg-muted/10 rounded-full flex items-center justify-center">
                <ShoppingCart size={32} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em]">Your cart is empty</p>
                <p className="text-[10px] font-bold mt-1">Add services to start an order</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-card border-t border-border/50 space-y-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          {/* Staff & Customer Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Assigned Staff</label>
              <CustomSelect
                value={selectedStaffEmail}
                onChange={(val) => setSelectedStaffEmail(val)}
                disabled={isStaffMember}
                placeholder="Any Staff (Auto-assign)"
                options={[
                  { value: '', label: 'Any Staff (Auto-assign)' },
                  ...staff.filter(s => {
                    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                    return !s.workingDays || s.workingDays.includes(todayName);
                  }).map(s => ({ value: s.email, label: s.name }))
                ]}
                buttonClassName="px-3 py-2.5 text-xs font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Payments</label>
                <button 
                  onClick={addPaymentMethod}
                  className="text-[9px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-1 hover:opacity-70"
                >
                  <Plus size={10} /> Add Method
                </button>
              </div>
              <div className="space-y-2">
                {payments.map((p, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <CustomSelect
                        value={p.method}
                        onChange={(val) => updatePayment(idx, { method: val as any })}
                        options={paymentMethods.map(m => ({ value: m.id, label: m.label }))}
                        buttonClassName="px-3 py-2 text-[10px] font-bold"
                      />
                    </div>
                    <div className="relative w-24">
                      <input 
                        type="number"
                        value={p.amount}
                        onChange={(e) => updatePayment(idx, { amount: Number(e.target.value) })}
                        className="w-full bg-input border border-border/50 rounded-xl px-2 py-2 text-[10px] font-black text-foreground focus:border-primary outline-none transition-all"
                        placeholder="Amount"
                      />
                    </div>
                    {payments.length > 1 && (
                      <button 
                        onClick={() => removePaymentMethod(idx)}
                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {remainingAmount !== 0 && (
                <p className={cn(
                  "text-[9px] font-black uppercase tracking-widest text-center mt-1",
                  remainingAmount > 0 ? "text-red-500" : "text-primary"
                )}>
                  {remainingAmount > 0 ? `Short: ${remainingAmount.toLocaleString()} Ks` : `Over: ${Math.abs(remainingAmount).toLocaleString()} Ks`}
                </p>
              )}
            </div>
          </div>

          {/* Appointment Selection */}
          <div className="space-y-3">
            {todaysAppointments.length > 0 && !selectedAppointmentId && (
              <div className="space-y-2">
                <label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Clock size={10} /> Today's Appointments
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {todaysAppointments.map(a => (
                    <button
                      key={a.id}
                      onClick={() => handleSelectAppointment(a)}
                      className="flex-none w-32 bg-primary/5 border border-primary/10 rounded-xl p-2 text-left hover:bg-primary/10 transition-all group"
                    >
                      <p className="text-[10px] font-black text-foreground truncate group-hover:text-primary transition-colors">{a.customerName}</p>
                      <p className="text-[8px] text-muted-foreground font-bold truncate">{a.serviceName}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[8px] font-black text-primary">{a.time}</span>
                        <ChevronRight size={10} className="text-primary/30 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="relative">
              <FloatingInput 
                label="Search Appointment..." 
                value={appointmentSearch}
                onChange={setAppointmentSearch}
                onFocusClear
                className="mt-0"
              />
              {appointmentSearch && (
                <button 
                  onClick={() => setAppointmentSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-600 transition-colors z-10"
                >
                  <X size={18} />
                </button>
              )}
              
              {appointmentSuggestions.length > 0 && (
                <div className="absolute bottom-full left-0 w-full bg-card border border-primary/30 rounded-2xl mb-2 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 z-[1001]">
                  {appointmentSuggestions.map(a => (
                    <button
                      key={a.id}
                      onClick={() => handleSelectAppointment(a)}
                      className="w-full text-left p-4 border-b border-border/50 last:border-0 hover:bg-primary/5 flex justify-between items-center transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-foreground font-bold truncate group-hover:text-primary transition-colors">{a.customerName}</span>
                          <span className="text-[8px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">{a.time}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-muted-foreground truncate">{a.serviceName}</span>
                          <span className="text-[10px] text-muted-foreground font-bold">{a.date}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedAppointmentId && (
              <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 flex justify-between items-center animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-500">
                    <Calendar size={14} />
                  </div>
                  <div>
                    <p className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em]">Linked Appointment</p>
                    <p className="text-xs font-bold text-blue-500">
                      {appointments.find(a => a.id === selectedAppointmentId)?.customerName}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAppointmentId('')}
                  className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Customer Selection */}
          <div className="space-y-3">
            <div className="relative">
              <FloatingInput 
                label="Customer (Name or Phone)" 
                value={customerSearch}
                onChange={setCustomerSearch}
                onFocusClear
                className="mt-0"
              />
              {customerSearch && (
                <button 
                  onClick={() => setCustomerSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-600 transition-colors z-10"
                >
                  <X size={18} />
                </button>
              )}
              
              {customerSuggestions.length > 0 && (
                <div className="absolute bottom-full left-0 w-full bg-card border border-primary/30 rounded-2xl mb-2 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 z-[1001]">
                  {customerSuggestions.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCustomerId(c.id);
                        setCustomerSearch('');
                      }}
                      className="w-full text-left p-4 border-b border-border/50 last:border-0 hover:bg-primary/5 flex justify-between items-center transition-colors group"
                    >
                      <div>
                        <span className="text-foreground font-bold block group-hover:text-primary transition-colors">{c.name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">{c.phone}</span>
                      </div>
                      {selectedCustomerId === c.id && <Check size={16} className="text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedCustomerId && (
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 space-y-3 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                      <Star size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-primary truncate max-w-[150px]">
                        {customers.find(c => c.id === selectedCustomerId)?.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <p className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em]">Loyalty Points:</p>
                        <p className="text-[10px] font-black text-primary">{(customers.find(c => c.id === selectedCustomerId)?.points || 0).toLocaleString()} PTS</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {customers.find(c => c.id === selectedCustomerId)?.points! >= LOYALTY_THRESHOLD && !isLoyaltyDiscountActive && (
                      <button 
                        onClick={applyLoyaltyDiscount}
                        className="px-3 py-1.5 bg-primary text-primary-foreground text-[9px] font-black rounded-lg shadow-lg shadow-primary/20 hover:scale-105 transition-all uppercase tracking-widest"
                      >
                        Apply 10%
                      </button>
                    )}
                    <button 
                      onClick={() => { setSelectedCustomerId(''); setPointsToRedeem(0); setIsLoyaltyDiscountActive(false); }}
                      className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="number"
                      placeholder="Redeem points..."
                      value={pointsToRedeem || ''}
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value));
                        const max = customers.find(c => c.id === selectedCustomerId)?.points || 0;
                        setPointsToRedeem(Math.min(val, max));
                      }}
                      className="w-full bg-input border border-border/50 rounded-xl pl-4 pr-12 py-2.5 text-xs font-black text-foreground focus:border-primary outline-none transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-muted-foreground uppercase tracking-widest">PTS</span>
                  </div>
                  <div className="bg-red-500 text-foreground px-3 py-2.5 rounded-xl text-[10px] font-black shadow-lg shadow-red-500/20">
                    -{ (pointsToRedeem * 10).toLocaleString() } Ks
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Totals Section */}
          <div className="space-y-3 bg-muted/5 p-5 rounded-3xl border border-border/50">
            <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              <span>Sub Total</span>
              <span className="text-foreground">{subTotal.toLocaleString()} Ks</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between items-center text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">
                <span>Total Discount</span>
                <span>-{totalDiscount.toLocaleString()} Ks</span>
              </div>
            )}
            {pointsToRedeem > 0 && (
              <div className="flex justify-between items-center text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">
                <span>Points Redeemed</span>
                <span>-{pointsDiscount.toLocaleString()} Ks</span>
              </div>
            )}
            <div className="flex justify-between items-center text-[10px] font-black text-primary uppercase tracking-[0.2em]">
              <span>Points to Earn</span>
              <span>+{pointsEarned} PTS</span>
            </div>
            <div className="pt-4 border-t border-border/50 space-y-4">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] leading-none mb-1">Net Total</span>
                  <span className="text-3xl font-black text-primary tracking-tighter leading-none">{netTotal.toLocaleString()} <span className="text-sm">Ks</span></span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest block">Paid / Remaining</span>
                  <span className={cn(
                    "text-xs font-black",
                    remainingAmount === 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {totalPaid.toLocaleString()} / {remainingAmount.toLocaleString()} Ks
                  </span>
                </div>
              </div>

              {remainingAmount === 0 && cart.length > 0 && (
                <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] text-center">Quick Pay & Checkout</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => handleQuickCheckout('Cash')}
                      className="bg-green-500/10 hover:bg-green-500 text-green-600 hover:text-foreground py-2 rounded-xl text-[10px] font-black transition-all border border-green-500/20"
                    >
                      CASH
                    </button>
                    <button 
                      onClick={() => handleQuickCheckout('KBZPay')}
                      className="bg-blue-500/10 hover:bg-blue-500 text-blue-600 hover:text-foreground py-2 rounded-xl text-[10px] font-black transition-all border border-blue-500/20"
                    >
                      KBZPAY
                    </button>
                    <button 
                      onClick={() => handleQuickCheckout('WavePay')}
                      className="bg-yellow-500/10 hover:bg-yellow-500 text-yellow-600 hover:text-foreground py-2 rounded-xl text-[10px] font-black transition-all border border-yellow-500/20"
                    >
                      WAVEPAY
                    </button>
                  </div>
                </div>
              )}

              <button 
                onClick={() => handleCheckout()}
                disabled={cart.length === 0 || remainingAmount !== 0}
                className="w-full bg-primary text-primary-foreground py-5 rounded-[1.5rem] font-black text-base tracking-[0.2em] shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-4 group"
              >
                <Printer size={20} className="group-hover:rotate-12 transition-transform" />
                CHECKOUT NOW
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loyalty Discount Prompt Modal */}
      {showLoyaltyPrompt && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 pt-[90px] sm:p-6 sm:pt-[90px] bg-black/60  animate-in fade-in duration-300">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border border-primary/30 rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6 text-center max-h-[calc(100dvh-110px)] overflow-y-auto"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="text-primary w-10 h-10 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">Loyalty Reward!</h3>
              <p className="text-sm text-muted-foreground">
                This customer has <span className="text-primary font-bold">{(customers.find(c => c.id === selectedCustomerId)?.points || 0)}</span> points. 
                Would you like to apply an automatic <span className="text-green-500 font-bold">{LOYALTY_DISCOUNT}% discount</span> to this sale?
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={applyLoyaltyDiscount}
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                APPLY DISCOUNT
              </button>
              <button 
                onClick={() => setShowLoyaltyPrompt(false)}
                className="w-full bg-muted/10 text-muted-foreground font-bold py-3 rounded-2xl hover:bg-muted/20 transition-all"
              >
                NO, THANKS
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {pendingSaleParams && (
        <PrintPreviewModal
          isOpen={showPrintPreview}
          onClose={() => {
            setShowPrintPreview(false);
            setPendingSaleParams(null);
          }}
          text={generateReceiptText(pendingSaleParams.sale, shopSettings)}
          onPrint={() => confirmCheckout(true)}
          onSkipPrint={() => confirmCheckout(false)}
          title="Checkout & Print Preview"
        />
      )}
    </div>
  );
};

export const MonthlySummaryPage: React.FC = () => {
  const { profile, isAdmin, isCashier } = useAuth();
  if (!isAdmin && !isCashier) return <Navigate to="/" />;
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [years, setYears] = useState<string[]>([new Date().getFullYear().toString()]);

  useEffect(() => {
    if (!isAdmin && !isCashier) return;
    const qSales = query(collection(db, 'sales'), orderBy('date', 'desc'));
    const unsubSales = onSnapshot(qSales, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
      setSales(data);
      const allYears = [...new Set(data.map(s => s.date.substring(0, 4)))];
      setYears(prev => [...new Set([...prev, ...allYears])].sort().reverse());
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'sales'));

    const qExp = query(collection(db, 'expenses'), orderBy('date', 'desc'));
    const unsubExp = onSnapshot(qExp, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
      setExpenses(data);
      const allYears = [...new Set(data.map(e => e.date.substring(0, 4)))];
      setYears(prev => [...new Set([...prev, ...allYears])].sort().reverse());
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'expenses'));

    return () => { unsubSales(); unsubExp(); };
  }, [profile]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const monthlyData = months.map((mName, i) => {
    const monthStr = (i + 1).toString().padStart(2, '0');
    const prefix = `${year}-${monthStr}`;
    const mSales = sales.filter(s => s.date.startsWith(prefix));
    const mExp = expenses.filter(e => e.date.startsWith(prefix));
    
    const income = mSales.reduce((sum, s) => sum + s.total, 0);
    const comms = mSales.reduce((sum, s) => sum + s.commission, 0);
    const shopExp = mExp.reduce((sum, e) => sum + e.amount, 0);
    const totalExp = shopExp + comms;
    const profit = income - totalExp;

    return { mName, income, totalExp, profit };
  }).filter(d => d.income > 0 || d.totalExp > 0);

  const gIncome = monthlyData.reduce((sum, d) => sum + d.income, 0);
  const gExp = monthlyData.reduce((sum, d) => sum + d.totalExp, 0);
  const gProfit = gIncome - gExp;

  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    if (monthlyData.length === 0) return;
    setIsExporting(true);
    
    try {
      const headers = ['Month', 'Gross Revenue (Ks)', 'Expenses (Ks)', 'Net Profit (Ks)'];
      
      const csvData = monthlyData.map(d => [
        d.mName,
        d.income,
        d.totalExp,
        d.profit
      ]);
      
      await exportToCSVAndShare(
        `Monthly_Summary_${year}.csv`,
        headers,
        csvData
      );
    } catch (error) {
      console.error('Error exporting monthly summary:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-1">
          <h3 className="text-3xl font-light tracking-tight text-foreground">Monthly <span className="italic font-serif">Summary</span></h3>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Financial Performance Overview</p>
        </div>
        <div className="flex items-center gap-4 bg-card/50 p-2 rounded-2xl border border-border shadow-sm">
          <div className="flex flex-col px-3">
            <label className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-0.5">Fiscal Year</label>
            <CustomSelect
              value={year}
              onChange={setYear}
              options={years.map(y => ({ value: y, label: y }))}
            />
          </div>
          {monthlyData.length > 0 && ['super_admin', 'owner', 'cashier'].includes(profile?.role || '') && (
            <button 
              onClick={handleExportCSV}
              disabled={isExporting}
              className="px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 z-20 mr-2"
              title="Export to CSV"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span className="text-[10px] uppercase tracking-widest">Generating...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span className="text-[10px] uppercase tracking-widest">Export Excel</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={48} className="text-green-500" />
          </div>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Total Revenue</p>
          <h2 className="text-3xl font-mono tracking-tighter text-foreground">{gIncome.toLocaleString()} <span className="text-sm font-sans font-normal text-muted-foreground uppercase">Ks</span></h2>
          <div className="h-1 w-12 bg-green-500/30 rounded-full" />
        </div>
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingDown size={48} className="text-red-500" />
          </div>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Total Expenses</p>
          <h2 className="text-3xl font-mono tracking-tighter text-foreground">{gExp.toLocaleString()} <span className="text-sm font-sans font-normal text-muted-foreground uppercase">Ks</span></h2>
          <div className="h-1 w-12 bg-red-500/30 rounded-full" />
        </div>
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign size={48} className={cn(gProfit >= 0 ? "text-primary" : "text-red-500")} />
          </div>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Net Profit</p>
          <h2 className={cn("text-3xl font-mono tracking-tighter", gProfit >= 0 ? "text-primary" : "text-red-500")}>
            {gProfit.toLocaleString()} <span className="text-sm font-sans font-normal opacity-50 uppercase">Ks</span>
          </h2>
          <div className={cn("h-1 w-12 rounded-full", gProfit >= 0 ? "bg-primary/30" : "bg-red-500/30")} />
        </div>
      </div>

      <div className="bg-card rounded-[2rem] border border-border shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Month</th>
                <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Income</th>
                <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Expense</th>
                <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Profit</th>
                <th className="px-8 py-5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {monthlyData.map((d, i) => (
                <tr key={i} className="hover:bg-primary/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <span className="text-lg font-serif italic text-foreground group-hover:text-primary transition-colors">{d.mName}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="font-mono text-base text-foreground">{d.income.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="font-mono text-base text-red-500/80">{d.totalExp.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={cn("font-mono text-lg font-bold", d.profit >= 0 ? "text-primary" : "text-red-500")}>
                      {d.profit.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      d.profit >= 0 ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                    )}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", d.profit >= 0 ? "bg-green-500" : "bg-red-500")} />
                      {d.profit >= 0 ? "Profitable" : "Loss"}
                    </div>
                  </td>
                </tr>
              ))}
              {monthlyData.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <FileText size={48} />
                      <p className="text-sm font-medium italic">No financial records found for {year}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const ExpenseListPage: React.FC = () => {
  const { profile, isAdmin, isCashier } = useAuth();
  if (!isAdmin && !isCashier) return <Navigate to="/" />;
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const today = getLocalISODate();
  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);
  const [expFilterCat, setExpFilterCat] = useState('');

  const [showExpCatForm, setShowExpCatForm] = useState(false);
  const [showExpForm, setShowExpForm] = useState(false);
  const [expCatName, setExpCatName] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expAmt, setExpAmt] = useState('');
  const [expCategory, setExpCategory] = useState('');
  const [editingExpenseCategory, setEditingExpenseCategory] = useState<ExpenseCategory | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const [showConfirm, setShowConfirm] = useState<{coll: string, id: string} | null>(null);

  useEffect(() => {
    if (!isAdmin && !isCashier) return;
    const q = query(collection(db, 'expenses'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'expenses'));
    
    const unsubCat = onSnapshot(query(collection(db, 'expense_categories'), orderBy('name')), (snapshot) => {
      setExpenseCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExpenseCategory)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'expense_categories'));
    
    return () => { unsubscribe(); unsubCat(); };
  }, [profile]);

  const filteredExpenses = expenses.filter(e => 
    (!dateFrom || e.date >= dateFrom) && 
    (!dateTo || e.date <= dateTo) &&
    (!expFilterCat || e.category === expFilterCat)
  );

  const totalExp = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const groupedExpenses = useMemo(() => {
    const groups: Record<string, Expense[]> = {};
    filteredExpenses.forEach(e => {
      const date = new Date(e.date).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(e);
    });
    return Object.entries(groups).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  }, [filteredExpenses]);

  const handleExportCSV = async () => {
    if (filteredExpenses.length === 0) return;
    setIsExporting(true);
    
    try {
      const headers = ['Date', 'Description', 'Category', 'Amount (Ks)'];
      
      const csvData = filteredExpenses.map(e => [
        e.date,
        e.desc,
        e.category || 'General',
        e.amount
      ]);
      
      await exportToCSVAndShare(
        `Expense_Report_${dateFrom}_to_${dateTo}.csv`,
        headers,
        csvData
      );
    } catch (error) {
      console.error('Error exporting expenses:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddExpense = async () => {
    if (!expDesc || !expAmt) return;
    const now = new Date();
    const localDateStr = getLocalISODate(now);
    try {
      await addDoc(collection(db, 'expenses'), { 
        date: localDateStr, 
        desc: expDesc, 
        amount: Number(expAmt),
        category: expCategory || 'General'
      });
      setExpDesc(''); setExpAmt(''); setExpCategory('');
      setShowExpForm(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'expenses');
    }
  };

  const handleAddExpenseCategory = async () => {
    if (!expCatName) return;
    try {
      await addDoc(collection(db, 'expense_categories'), { name: expCatName.trim() });
      setExpCatName('');
      setShowExpCatForm(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'expense_categories');
    }
  };

  const handleUpdateExpenseCategory = async () => {
    if (!editingExpenseCategory || !expCatName) return;
    try {
      await updateDoc(doc(db, 'expense_categories', editingExpenseCategory.id), { name: expCatName.trim() });
      setEditingExpenseCategory(null);
      setExpCatName('');
      setShowExpCatForm(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `expense_categories/${editingExpenseCategory.id}`);
    }
  };

  const handleDelete = async (coll: string, id: string) => {
    try {
      await deleteDoc(doc(db, coll, id));
      setShowConfirm(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${coll}/${id}`);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <Modal 
        isOpen={showExpForm} 
        onClose={() => { setShowExpForm(false); setExpDesc(''); setExpAmt(''); setExpCategory(''); }} 
        title="Add Daily Expense"
      >
        <div className="space-y-4">
          <FloatingInput 
            label="Reason"
            value={expDesc}
            onChange={setExpDesc}
            onFocusClear
          />
          <div className="grid grid-cols-2 gap-4">
            <FloatingInput 
              label="Amount (Ks)"
              type="number"
              value={expAmt}
              onChange={setExpAmt}
              onFocusClear
            />
            <div className="space-y-1.5">
              <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest ml-1">Category</label>
              <CustomSelect
                value={expCategory}
                onChange={setExpCategory}
                options={[
                  { value: '', label: 'General' },
                  ...expenseCategories.map(c => ({ value: c.name, label: c.name }))
                ]}
                buttonClassName="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:border-red-500"
              />
            </div>
          </div>
          <button onClick={handleAddExpense} className="w-full bg-red-500 text-foreground font-bold py-4 rounded-2xl mt-2 hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20 uppercase tracking-widest">Add Expense</button>
        </div>
      </Modal>

      <Modal 
        isOpen={showExpCatForm} 
        onClose={() => { setShowExpCatForm(false); setEditingExpenseCategory(null); setExpCatName(''); }} 
        title={editingExpenseCategory ? "Edit Expense Category" : "Manage Expense Categories"}
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <FloatingInput 
              label={editingExpenseCategory ? "Edit Category Name" : "New Category Name"}
              value={expCatName}
              onChange={setExpCatName}
              onFocusClear
            />
            {editingExpenseCategory ? (
              <button onClick={handleUpdateExpenseCategory} className="w-full bg-red-500 text-foreground py-4 mt-2 uppercase tracking-widest font-black rounded-xl">Update Category</button>
            ) : (
              <button onClick={handleAddExpenseCategory} className="w-full bg-red-500 text-foreground py-4 mt-2 uppercase tracking-widest font-black rounded-xl">Add Category</button>
            )}
          </div>

          <div className="space-y-3 pt-6 border-t border-border">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Existing Categories</h4>
            <div className="flex flex-wrap gap-2">
              {expenseCategories.map(c => (
                <div key={c.id} className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-full group hover:border-red-500/50 transition-all">
                  <span className="text-xs font-bold text-foreground">{c.name}</span>
                  <button onClick={() => { setEditingExpenseCategory(c); setExpCatName(c.name); setShowExpCatForm(true); }} className="text-muted-foreground hover:text-red-500 hover:scale-110 transition-all"><Settings size={12} /></button>
                  {isAdmin && (
                    <button onClick={() => setShowConfirm({ coll: 'expense_categories', id: c.id })} className="text-red-500 hover:text-red-600 hover:scale-110 transition-all"><Trash2 size={12} /></button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-1">
          <h3 className="text-3xl font-light tracking-tight text-foreground">Shop <span className="italic font-serif">Expenses</span></h3>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mb-4">Operating Cost Management</p>
          <div className="flex items-center gap-3 mt-4">
            <button 
              onClick={() => setShowExpForm(true)}
              className="bg-red-500 text-foreground px-4 py-2 text-[10px] font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors"
            >
              <Plus size={14} /> ADD EXPENSE
            </button>
            <button 
              onClick={() => setShowExpCatForm(true)}
              className="bg-card border border-border text-foreground px-4 py-2 text-[10px] font-bold rounded-xl flex items-center gap-2 hover:border-red-500/30 transition-colors"
            >
              <Settings size={14} /> MANAGE CATEGORIES
            </button>
          </div>
        </div>
        
        <div className="bg-card rounded-[2rem] border border-border shadow-2xl z-50 relative min-w-[320px]">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <CustomDatePicker 
              label="FROM" 
              value={dateFrom} 
              onChange={setDateFrom} 
              iconColor="text-red-500"
              className="border-b md:border-b-0 md:border-r border-border/50"
            />
            <CustomDatePicker 
              label="TO" 
              value={dateTo} 
              onChange={setDateTo} 
              iconColor="text-red-500"
              className="border-b md:border-b-0 md:border-r border-border/50"
            />
            <div className="flex flex-col p-4">
               <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-2">
                 <Settings size={12} className="text-red-500" /> CATEGORY
               </label>
               <CustomSelect
                 value={expFilterCat}
                 onChange={setExpFilterCat}
                 placeholder="All Categories"
                 options={[
                   { value: '', label: 'All Categories' },
                   { value: 'General', label: 'General' },
                   ...expenseCategories.map(c => ({ value: c.name, label: c.name }))
                 ]}
               />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card p-10 rounded-[2.5rem] border border-border shadow-2xl text-center space-y-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-red-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 space-y-2">
          <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-[0.3em]">Total Operating Expenditure</span>
          <div className="flex items-center justify-center gap-4">
            <TrendingDown size={32} className="text-red-500/50" />
            <h1 className="text-6xl font-mono tracking-tighter text-red-500 drop-shadow-sm">
              {totalExp.toLocaleString()} <span className="text-2xl font-sans font-normal opacity-50">Ks</span>
            </h1>
          </div>
          <div className="h-1 bg-red-500/20 w-24 mx-auto rounded-full" />
        </div>
        {filteredExpenses.length > 0 && ['super_admin', 'owner', 'cashier'].includes(profile?.role || '') && (
          <div className="relative z-10 flex justify-center mt-4">
            <button 
              onClick={handleExportCSV}
              disabled={isExporting}
              className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              title="Export to CSV"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-xs uppercase tracking-widest font-bold">Generating...</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span className="text-xs uppercase tracking-widest font-bold">Export Excel</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Transaction Ledger</h4>
          <span className="text-[10px] font-mono text-muted-foreground">{filteredExpenses.length} Entries</span>
        </div>

        <div className="space-y-12">
          {groupedExpenses.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-[2rem] border border-dashed border-border">
              <div className="flex flex-col items-center gap-3 opacity-30">
                <Receipt size={48} />
                <p className="text-sm font-medium italic text-muted-foreground">No expense records found for this period.</p>
              </div>
            </div>
          ) : (
            groupedExpenses.map(([date, expenses]) => (
              <div key={date} className="space-y-4">
                <div className="sticky top-20 z-20 flex items-center gap-4 py-3 bg-background/90  border-b border-border/30">
                  <div className="flex items-center gap-3 px-5 py-2 bg-red-500/10 border border-red-500/20 rounded-2xl shadow-sm shadow-red-500/5">
                    <CalendarIcon size={14} className="text-red-500" />
                    <span className="text-xs font-black uppercase tracking-[0.15em] text-red-500">
                      {formatDisplayDate(date)}
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
                  <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-lg border border-border/50">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                      {expenses.length} {expenses.length === 1 ? 'Entry' : 'Entries'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {expenses.map(e => (
                    <div 
                      key={e.id} 
                      className="group bg-card border border-border rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-red-500/30 transition-all"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                          <Receipt size={24} />
                        </div>
                        <div className="space-y-1">
                          <span className="text-lg font-medium text-foreground block group-hover:text-red-500 transition-colors leading-tight">{e.desc}</span>
                          <div className="flex items-center gap-3">
                            <span className="bg-red-500/10 text-red-500 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{e.category || 'General'}</span>
                            <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-xl font-mono font-bold text-red-500">{e.amount.toLocaleString()} <span className="text-xs font-sans font-normal opacity-50">Ks</span></span>
                        </div>
                        {isAdmin && (
                          <button 
                            onClick={() => setShowConfirm({ coll: 'expenses', id: e.id })}
                            className="p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal 
        isOpen={!!showConfirm} 
        onClose={() => setShowConfirm(null)} 
        title="Are you sure?"
        maxWidth="max-w-xs"
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto">
            <Trash2 size={32} />
          </div>
          <p className="text-muted-foreground text-sm font-bold">This action cannot be undone.</p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setShowConfirm(null)}
              className="bg-muted/20 text-foreground font-black py-3 rounded-xl border border-border hover:bg-muted/30 transition-all uppercase tracking-widest text-xs"
            >
              CANCEL
            </button>
            <button 
              onClick={() => showConfirm && handleDelete(showConfirm.coll, showConfirm.id)}
              className="bg-red-500 text-foreground font-black py-3 rounded-xl shadow-lg shadow-red-500/20 uppercase tracking-widest text-xs"
            >
              DELETE
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export const HistoryPage: React.FC = () => {
  const { profile, isAdmin, isCashier, isStaffMember: isStaff } = useAuth();

  if (!isAdmin && !isCashier && !isStaff) return <Navigate to="/" />;

  const [sales, setSales] = useState<Sale[]>([]);
  const [expandedSaleId, setExpandedSaleId] = useState<string | null>(null);
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null);
  const today = getLocalISODate();
  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);
  const [staffFilter, setStaffFilter] = useState(isStaff ? profile.name : '');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [staffList, setStaffList] = useState<string[]>([]);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!profile) return;
    
    let q = query(collection(db, 'sales'), orderBy('dateTime', 'desc'));
    
    // If staff, we only fetch their own sales for security (though rules also enforce this)
    if (isStaff) {
      q = query(collection(db, 'sales'), where('staffEmail', '==', profile.email), orderBy('dateTime', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
      setSales(data);
      setStaffList([...new Set(data.map(s => s.staff))]);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'sales'));
    return unsubscribe;
  }, [profile, isStaff]);

  useEffect(() => {
    const docRef = doc(db, 'settings', 'salon');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) setShopSettings(docSnap.data() as ShopSettings);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/salon'));
    return unsubscribe;
  }, []);

  const filteredSales = sales
    .filter(s => 
      (!dateFrom || s.date >= dateFrom) && 
      (!dateTo || s.date <= dateTo) && 
      (!staffFilter || s.staff === staffFilter) &&
      (!paymentFilter || (paymentFilter === 'Split' ? (s.payments?.length > 1 || (s.method && s.method.includes(','))) : s.method === paymentFilter))
    )
    .sort((a, b) => (b.dateTime || '').localeCompare(a.dateTime || ''));

  const totalIncome = filteredSales.reduce((sum, s) => sum + s.total, 0);
  const totalComm = filteredSales.reduce((sum, s) => sum + s.commission, 0);

  const totalCash = filteredSales.reduce((sum, s) => {
    if (s.payments && s.payments.length > 0) {
      return sum + s.payments.filter(p => p.method === 'Cash').reduce((pSum, p) => pSum + p.amount, 0);
    }
    return sum + ((s.method === 'Cash' || !s.method) ? s.total : 0);
  }, 0);

  const totalDigital = filteredSales.reduce((sum, s) => {
    if (s.payments && s.payments.length > 0) {
      return sum + s.payments.filter(p => p.method !== 'Cash').reduce((pSum, p) => pSum + p.amount, 0);
    }
    return sum + (s.method && s.method !== 'Cash' ? s.total : 0);
  }, 0);

  const handleExportCSV = async () => {
    if (filteredSales.length === 0) return;
    setIsExporting(true);
    
    try {
      const headers = ['Date', 'Time', 'Receipt No', 'Total (Ks)', 'Commission (Ks)', 'Method', 'Staff'];
      
      const csvData = filteredSales.map(s => {
        let timeStr = '';
        try {
          if (s.dateTime) {
             timeStr = new Date(s.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
        } catch (e) {}

        return [
          s.date,
          timeStr,
          s.id.slice(0, 8).toUpperCase(),
          s.total,
          s.commission,
          s.payments && s.payments.length > 1 ? s.payments.map(p => `${p.method}: ${p.amount}`).join(' | ') : (s.method || 'Cash'),
          s.staff
        ];
      });
      
      await exportToCSVAndShare(
        `Sales_Report_${dateFrom}_to_${dateTo}.csv`,
        headers,
        csvData
      );
    } catch (error) {
      console.error('Error exporting sales:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintAll = () => {
    if (filteredSales.length === 0) return;
    setShowPrintPreview(true);
  };

  const confirmPrintAll = () => {
    if (filteredSales.length === 0) return;
    const printText = generateConsolidatedReceiptText(filteredSales, shopSettings, dateFrom, dateTo);
    
    if (Capacitor.isNativePlatform()) {
      const htmlStr = "<html><body style='margin:0;padding:10px;'><pre style='font-family:monospace;font-size:12px;'>" + printText.replace(/</g, '&lt;').replace(/>/g, '&gt;') + "</pre></body></html>";
      CapPrinter.printHtml({ name: 'Consolidated_Report', html: htmlStr }).catch(e => {
        console.error('Printer error:', e);
        alert('Failed to print: ' + String(e));
      });
    } else {
      const rawbtUrl = "intent:base64," + btoa(unescape(encodeURIComponent(printText))) + "#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end;";
      window.location.href = rawbtUrl;
    }
  };

  const groupedSales = useMemo(() => {
    const groups: Record<string, Sale[]> = {};
    filteredSales.forEach(s => {
      const date = new Date(s.dateTime).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(s);
    });
    return Object.entries(groups).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  }, [filteredSales]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-1">
          <h3 className="text-3xl font-light tracking-tight text-foreground">Daily <span className="italic font-serif">Sales List</span></h3>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Transaction Ledger & Revenue Tracking</p>
        </div>
        
        <div className="bg-card rounded-[2rem] border border-border shadow-2xl w-full z-50 relative">
          <div className="flex flex-col md:flex-row md:items-center">
            <CustomDatePicker 
              label="FROM" 
              value={dateFrom} 
              onChange={setDateFrom} 
              className="border-b md:border-b-0 md:border-r border-border/50 flex-1"
            />
            <CustomDatePicker 
              label="TO" 
              value={dateTo} 
              onChange={setDateTo} 
              className="border-b md:border-b-0 md:border-r border-border/50 flex-1"
            />
            <div className="flex flex-col p-4 border-b md:border-b-0 md:border-r border-border/50 flex-1">
               <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-2">
                 <UserIcon size={12} className="text-primary" /> STAFF
               </label>
               <CustomSelect
                 value={staffFilter} 
                 onChange={setStaffFilter}
                 placeholder="All Staff"
                 options={[
                   { value: '', label: 'All Staff' },
                   ...staffList.map(name => ({ value: name, label: name }))
                 ]}
               />
            </div>
            <div className="flex flex-col p-4 flex-1">
               <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-2">
                 <CreditCard size={12} className="text-primary" /> PAYMENT
               </label>
               <CustomSelect
                 value={paymentFilter} 
                 onChange={setPaymentFilter}
                 placeholder="All Payments"
                 options={[
                   { value: '', label: 'All Payments' },
                   { value: 'Cash', label: 'Cash' },
                   { value: 'KBZPay', label: 'KBZPay' },
                   { value: 'WavePay', label: 'WavePay' },
                   { value: 'AYA Pay', label: 'AYA Pay' },
                   { value: 'CB PAY', label: 'CB PAY' },
                   { value: 'OK$', label: 'OK$' },
                   { value: 'Split', label: 'Split / Mixed' }
                 ]}
               />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-2xl text-center space-y-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 space-y-1">
            <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-[0.3em]">Gross Revenue</span>
            <h1 className="text-5xl font-mono tracking-tighter text-primary drop-shadow-sm">
              {totalIncome.toLocaleString()} <span className="text-xl font-sans font-normal opacity-50">Ks</span>
            </h1>
          </div>
          <div className="relative z-10 flex items-center justify-center gap-6 pt-2 border-t border-border/50 max-w-xs mx-auto">
            <div className="text-center">
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block mb-0.5">Total Cash</span>
              <span className="text-sm font-mono font-bold text-green-600">{totalCash.toLocaleString()} Ks</span>
            </div>
            <div className="w-px h-6 bg-border/50"></div>
            <div className="text-center">
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block mb-0.5">Total KPay/Digital</span>
              <span className="text-sm font-mono font-bold text-blue-600">{totalDigital.toLocaleString()} Ks</span>
            </div>
          </div>
          {filteredSales.length > 0 && (
            <div className="relative z-10 mt-6 pt-2 flex flex-wrap items-center justify-center gap-3">
              {['super_admin', 'owner', 'cashier'].includes(profile?.role || '') && (
                <button 
                  onClick={handleExportCSV}
                  disabled={isExporting}
                  className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  title="Export to CSV"
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      <span className="text-xs uppercase tracking-widest font-bold">Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      <span className="text-xs uppercase tracking-widest font-bold">Export Excel</span>
                    </>
                  )}
                </button>
              )}
              <button 
                onClick={handlePrintAll}
                className="px-6 py-2.5 bg-primary/10 text-primary font-semibold rounded-full border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                title="Print Consolidated Report"
              >
                <Printer size={18} />
                <span className="text-xs uppercase tracking-widest font-bold">Print Report</span>
              </button>
            </div>
          )}
        </div>

        {staffFilter ? (
          <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-2xl text-center space-y-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-green-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 space-y-1">
              <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-[0.3em]">Staff Commission</span>
              <h1 className="text-5xl font-mono tracking-tighter text-green-500 drop-shadow-sm">
                {totalComm.toLocaleString()} <span className="text-xl font-sans font-normal opacity-50">Ks</span>
              </h1>
              <div className="h-1 bg-green-500/20 w-16 mx-auto rounded-full" />
            </div>
          </div>
        ) : (
          <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-2xl flex items-center justify-center text-center">
            <div className="space-y-2 opacity-30">
              <UsersIcon size={32} className="mx-auto" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Select staff to view commission</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Transaction History</h4>
          <span className="text-[10px] font-mono text-muted-foreground">{filteredSales.length} Records</span>
        </div>

        <div className="space-y-12">
          {groupedSales.length === 0 ? (
            <div className="text-center py-24 bg-card rounded-[2.5rem] border border-dashed border-border">
              <div className="flex flex-col items-center gap-4 opacity-20">
                <HistoryIcon size={64} />
                <p className="text-base font-medium italic">No transaction history found for this period.</p>
              </div>
            </div>
          ) : (
            groupedSales.map(([date, sales]) => (
              <div key={date} className="space-y-4">
                <div className="sticky top-20 z-20 flex items-center gap-4 py-3 bg-background/90  border-b border-border/30">
                  <div className="flex items-center gap-3 px-5 py-2 bg-primary/10 border border-border rounded-2xl shadow-sm shadow-primary/5">
                    <CalendarIcon size={14} className="text-primary" />
                    <span className="text-xs font-black uppercase tracking-[0.15em] text-primary">
                      {formatDisplayDate(date)}
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
                  <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-lg border border-border/50">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                      {sales.length} {sales.length === 1 ? 'Sale' : 'Sales'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {sales.map(s => (
              <div 
                key={s.id} 
                onClick={() => setExpandedSaleId(expandedSaleId === s.id ? null : s.id)}
                className={cn(
                  "group bg-card border border-border rounded-[2rem] overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-2xl hover:border-primary/30",
                  expandedSaleId === s.id ? "ring-2 ring-primary/20 shadow-2xl border-primary/30" : "shadow-sm"
                )}
              >
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                      s.method === 'Cash' ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
                    )}>
                      {s.method === 'Cash' ? <DollarSign size={28} /> : <CreditCard size={28} />}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-serif italic text-foreground group-hover:text-primary transition-colors">{s.staff}</span>
                        <span className="px-2 py-0.5 rounded-full bg-muted text-[9px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] md:max-w-none">
                          {s.payments && s.payments.length > 1 
                            ? s.payments.map(p => `${p.method}: ${p.amount.toLocaleString()}`).join(' | ') 
                            : (s.method || 'Cash')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                        <span>{formatDisplayDate(s.dateTime)}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{new Date(s.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-border/50">
                    <div className="text-right space-y-0.5">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">Total Amount</span>
                      <span className="text-2xl font-mono font-bold text-primary">{s.total.toLocaleString()} <span className="text-xs font-sans font-normal opacity-50">Ks</span></span>
                    </div>
                    <div className="text-right space-y-0.5">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block">Commission</span>
                      <span className="text-lg font-mono font-bold text-green-500">{s.commission.toLocaleString()} <span className="text-xs font-sans font-normal opacity-50">Ks</span></span>
                    </div>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground transition-transform duration-300",
                      expandedSaleId === s.id ? "rotate-180 bg-primary/10 text-primary" : "group-hover:bg-primary/5"
                    )}>
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>

                {expandedSaleId === s.id && (
                  <div className="px-6 pb-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="pt-6 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Purchased Items
                        </h5>
                        <div className="space-y-2">
                          {s.items.map((item, idx) => (
                            <div key={idx} className="bg-muted/30 p-4 rounded-2xl border border-border/50 flex items-center justify-between group/item hover:bg-muted/50 transition-colors">
                              <div className="space-y-0.5">
                                <span className="text-sm font-bold text-foreground group-hover/item:text-primary transition-colors">{item.name}</span>
                                <p className="text-[10px] text-muted-foreground font-mono">
                                  {item.qty} × {item.price.toLocaleString()} Ks
                                </p>
                              </div>
                              <div className="text-right space-y-0.5">
                                <span className="text-sm font-mono font-bold text-foreground">{(item.qty * item.price).toLocaleString()} Ks</span>
                                {item.disP > 0 && (
                                  <span className="block text-[9px] font-bold text-red-500 uppercase tracking-tighter">
                                    Disc: -{item.disP}% (-{((item.qty * item.price) * item.disP / 100).toLocaleString()} Ks)
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Transaction Metadata
                        </h5>
                        <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 space-y-4">
                          <div className="bg-background/50 p-4 rounded-xl border border-border/50 grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Customer</span>
                              <span className="text-sm font-medium text-foreground">{s.customerName || 'Walk-in Customer'}</span>
                            </div>
                            <div className="text-right space-y-1">
                              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Payment Method</span>
                              <span className="text-sm font-medium text-foreground">
                                {s.payments && s.payments.length > 1 
                                  ? s.payments.map(p => `${p.method}: ${p.amount.toLocaleString()}`).join(' | ') 
                                  : (s.method || 'Cash')}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Transaction ID</span>
                              <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[120px] block">{s.id}</span>
                            </div>
                            <div className="text-right space-y-1">
                              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">Points Redeemed</span>
                              <span className="text-sm font-mono font-bold text-primary">-{s.pointsRedeemed || 0}</span>
                            </div>
                          </div>
                          <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Net Total</span>
                            <span className="text-2xl font-mono font-bold text-primary">{s.total.toLocaleString()} Ks</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <PrintPreviewModal
        isOpen={showPrintPreview}
        onClose={() => setShowPrintPreview(false)}
        text={generateConsolidatedReceiptText(filteredSales, shopSettings, dateFrom, dateTo)}
        onPrint={confirmPrintAll}
        title="Consolidated Report Preview"
        printLabel="Print Report"
      />
    </div>
  );
};

export const StaffCommissionsPage: React.FC = () => {
  const { profile, isAdmin, isCashier, isStaffMember: isStaff } = useAuth();

  if (!isAdmin && !isCashier && !isStaff) return <Navigate to="/" />;

  const [sales, setSales] = useState<Sale[]>([]);
  const now = new Date();
  const today = getLocalISODate();
  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);
  const [staffFilter, setStaffFilter] = useState(isStaff ? profile.name : '');
  const [staffList, setStaffList] = useState<string[]>([]);

  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!profile) return;
    
    // Fetch staff names for filter
    if (isAdmin || isCashier) {
      const unsubStaff = onSnapshot(collection(db, 'users'), (snapshot) => {
        const superAdminEmails = ['aungsoe366@gmail.com'];
        const names = snapshot.docs
          .map(doc => doc.data() as UserProfile)
          .filter(u => {
            const isExcluded = u.role === 'super_admin' || 
                              (u.email && superAdminEmails.includes(u.email.toLowerCase().trim()));
            return !isExcluded && ['owner', 'cashier', 'staff'].includes(u.role || '');
          })
          .map(u => u.name);
        setStaffList([...new Set(names)].sort());
      });
      
      const q = query(collection(db, 'sales'), orderBy('dateTime', 'desc'));
      const unsubSales = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
        setSales(data);
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'sales'));

      return () => {
        unsubStaff();
        unsubSales();
      };
    } else if (isStaff) {
      setStaffList([profile.name]);
      const q = query(collection(db, 'sales'), where('staffEmail', '==', profile.email), orderBy('dateTime', 'desc'));
      const unsubSales = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
        setSales(data);
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'sales'));
      return unsubSales;
    }
  }, [profile, isAdmin, isCashier, isStaff]);

  const filteredSales = sales.filter(s => 
    (!dateFrom || s.date >= dateFrom) && 
    (!dateTo || s.date <= dateTo)
  );

  const staffAggregates = staffList.map(name => {
    const staffSales = filteredSales.filter(s => s.staff === name);
    const totalSales = staffSales.reduce((sum, s) => sum + s.total, 0);
    const totalComm = staffSales.reduce((sum, s) => sum + s.commission, 0);
    const count = staffSales.length;
    return { name, totalSales, totalComm, count };
  }).filter(a => !staffFilter || a.name === staffFilter).sort((a, b) => b.totalComm - a.totalComm);

  const grandTotalComm = staffAggregates.reduce((sum, a) => sum + a.totalComm, 0);

  const handleExportCSV = async () => {
    if (staffAggregates.length === 0) return;
    setIsExporting(true);
    
    try {
      const headers = ['Staff Name', 'Total Sales (Ks)', 'Total Commission (Ks)', 'Services Performed'];
      
      const csvData = staffAggregates.map(a => [
        a.name,
        a.totalSales,
        a.totalComm,
        a.count
      ]);
      
      await exportToCSVAndShare(
        `Staff_Commissions_${dateFrom}_to_${dateTo}.csv`,
        headers,
        csvData
      );
    } catch (error) {
      console.error('Error exporting staff commissions:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-primary text-2xl font-bold tracking-tight">Staff Commissions</h3>
      
      <div className="bg-card rounded-[2rem] border border-border shadow-2xl w-full mb-6 z-50 relative">
        <div className="flex flex-col md:flex-row md:items-center">
          <CustomDatePicker 
            label="FROM" 
            value={dateFrom} 
            onChange={setDateFrom} 
            className="border-b md:border-b-0 md:border-r border-border/50 flex-1"
          />
          <CustomDatePicker 
            label="TO" 
            value={dateTo} 
            onChange={setDateTo} 
            className="border-b md:border-b-0 md:border-r border-border/50 flex-1"
          />
          {!isStaff && (
            <div className="flex flex-col p-4 flex-1">
               <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-2">
                 <UserIcon size={12} className="text-primary" /> STAFF
               </label>
               <CustomSelect
                 value={staffFilter} 
                 onChange={setStaffFilter}
                 placeholder="All Staff"
                 options={[
                   { value: '', label: 'All Staff' },
                   ...staffList.map(name => ({ value: name, label: name }))
                 ]}
               />
            </div>
          )}
        </div>
      </div>

      <div className="bg-card p-8 rounded-[2.5rem] border border-green-500/20 text-center shadow-xl group relative overflow-hidden space-y-4">
        <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 space-y-1">
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em] block mb-1">Total Commissions (Period)</span>
          <b className="text-green-500 text-5xl font-mono tracking-tighter drop-shadow-sm block">{grandTotalComm.toLocaleString()} <span className="text-xl font-sans font-normal opacity-50">Ks</span></b>
        </div>
        {staffAggregates.length > 0 && ['super_admin', 'owner', 'cashier'].includes(profile?.role || '') && (
          <div className="relative z-10 flex justify-center mt-4 pt-2">
            <button 
              onClick={handleExportCSV}
              disabled={isExporting}
              className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              title="Export to CSV"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-xs uppercase tracking-widest font-bold">Generating...</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span className="text-xs uppercase tracking-widest font-bold">Export Excel</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="text-primary font-bold px-1 flex items-center gap-2 uppercase tracking-widest text-xs">
          <div className="w-1.5 h-4 bg-primary rounded-full"></div>
          Staff Summary
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {staffAggregates.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-card/50 rounded-3xl border border-dashed border-border transition-colors duration-300">
              <p className="text-muted-foreground text-sm font-medium italic">No data found for this period.</p>
            </div>
          ) : (
            staffAggregates.map(a => (
              <div key={a.name} className="bg-card border-l-4 border-green-500 rounded-xl p-5 flex justify-between items-center shadow-lg hover:translate-x-1 transition-all group">
                <div className="flex-1">
                  <span className="font-bold text-foreground block text-lg group-hover:text-primary transition-colors">{a.name}</span>
                  <span className="text-muted-foreground text-[11px] font-medium uppercase tracking-wider">{a.count} Sales | Total: {a.totalSales.toLocaleString()} Ks</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block mb-0.5">Commission</span>
                  <span className="font-bold text-green-500 text-xl">{a.totalComm.toLocaleString()} Ks</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-primary font-bold px-1 flex items-center gap-2 uppercase tracking-widest text-xs">
          <div className="w-1.5 h-4 bg-primary rounded-full"></div>
          Sales Details
        </h4>
        <div className="space-y-2">
          {filteredSales.filter(s => !staffFilter || s.staff === staffFilter).length === 0 ? (
            <div className="text-center py-12 bg-card/50 rounded-3xl border border-dashed border-border">
              <p className="text-muted-foreground text-sm font-medium italic">No detailed sales found.</p>
            </div>
          ) : (
            filteredSales.filter(s => !staffFilter || s.staff === staffFilter).map(s => (
              <div key={s.id} className="bg-card p-4 rounded-2xl border border-border flex justify-between items-center shadow-sm hover:border-primary/30 transition-all group">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-bold text-sm group-hover:text-primary transition-colors">{s.staff}</span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{new Date(s.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                    {s.payments && s.payments.length > 1 
                      ? s.payments.map(p => `${p.method}: ${p.amount.toLocaleString()}`).join(' | ') 
                      : (s.method || 'Cash')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-foreground font-bold text-sm">{s.total.toLocaleString()} Ks</div>
                  <div className="text-green-500 text-[10px] font-bold uppercase tracking-tighter">Comm: {s.commission.toLocaleString()} Ks</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export const SalesReportPage: React.FC = () => {
  const { profile, isAdmin, isCashier } = useAuth();
  if (!isAdmin && !isCashier) return <Navigate to="/" />;
  const [sales, setSales] = useState<Sale[]>([]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [years, setYears] = useState<string[]>([new Date().getFullYear().toString()]);

  useEffect(() => {
    if (!isAdmin && !isCashier) return;
    const q = query(collection(db, 'sales'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
      setSales(data);
      const allYears = [...new Set(data.map(s => s.date.substring(0, 4)))];
      setYears(prev => [...new Set([...prev, ...allYears])].sort().reverse());
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'sales'));
    return unsubscribe;
  }, [profile]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const reportData = months.map((mName, i) => {
    const monthStr = (i + 1).toString().padStart(2, '0');
    const prefix = `${year}-${monthStr}`;
    const mSales = sales.filter(s => s.date.startsWith(prefix));
    
    const totalSales = mSales.reduce((sum, s) => sum + s.total, 0);
    const totalComm = mSales.reduce((sum, s) => sum + s.commission, 0);
    const count = mSales.length;

    return { mName, totalSales, totalComm, count };
  });

  const grandTotal = reportData.reduce((sum, d) => sum + d.totalSales, 0);
  const grandComm = reportData.reduce((sum, d) => sum + d.totalComm, 0);
  const totalCount = reportData.reduce((sum, d) => sum + d.count, 0);

  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    if (reportData.length === 0) return;
    setIsExporting(true);
    
    try {
      const headers = ['Month', 'Transactions Count', 'Sales (Ks)', 'Commission (Ks)'];
      
      const csvData = reportData.map(d => [
        d.mName,
        d.count,
        d.totalSales,
        d.totalComm
      ]);
      
      await exportToCSVAndShare(
        `Sales_Report_${year}.csv`,
        headers,
        csvData
      );
    } catch (error) {
      console.error('Error exporting sales report:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4 space-y-6 relative">
      <h3 className="text-primary text-2xl font-bold tracking-tight">Sales Report</h3>
      
      <div className="bg-card rounded-[2rem] border border-border shadow-2xl w-full mb-6 z-50 relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex flex-col p-6 space-y-4">
           <div className="flex flex-col max-w-[200px]">
             <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-2">
               <Settings size={12} className="text-primary" /> YEAR
             </label>
             <CustomSelect
               value={year}
               onChange={setYear}
               options={years.map(y => ({ value: y, label: y }))}
             />
           </div>
           
           {reportData.length > 0 && ['super_admin', 'owner', 'cashier'].includes(profile?.role || '') && (
            <div className="relative z-10 flex pt-2">
              <button 
                onClick={handleExportCSV}
                disabled={isExporting}
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                title="Export to CSV"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span className="text-xs uppercase tracking-widest font-bold">Generating...</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span className="text-xs uppercase tracking-widest font-bold">Export Excel</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        <table className="w-full text-sm">
          <thead className="bg-primary/10 text-primary">
            <tr>
              <th className="px-4 py-4 text-left font-bold uppercase tracking-wider text-[10px]">Month</th>
              <th className="px-4 py-4 text-left font-bold uppercase tracking-wider text-[10px]">Count</th>
              <th className="px-4 py-4 text-left font-bold uppercase tracking-wider text-[10px]">Sales</th>
              <th className="px-4 py-4 text-left font-bold uppercase tracking-wider text-[10px]">Comm.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reportData.map((d, i) => (
              <tr key={i} className={cn("hover:bg-primary/5 transition-colors", d.count > 0 ? "" : "opacity-30")}>
                <td className="px-4 py-4 font-bold text-foreground">{d.mName}</td>
                <td className="px-4 py-4 text-foreground">{d.count}</td>
                <td className="px-4 py-4 text-foreground">{d.totalSales.toLocaleString()}</td>
                <td className="px-4 py-4 text-green-500 font-bold">{d.totalComm.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-muted/10 text-foreground border-t-2 border-primary">
            <tr className="font-bold">
              <td className="px-4 py-4 uppercase tracking-tighter">Total</td>
              <td className="px-4 py-4">{totalCount}</td>
              <td className="px-4 py-4">{grandTotal.toLocaleString()}</td>
              <td className="px-4 py-4 text-green-500">{grandComm.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

const FloatingInput: React.FC<{
  label: string;
  type?: string;
  value: string | number;
  onChange: (val: string) => void;
  onFocusClear?: boolean;
  placeholder?: string;
  required?: boolean;
  className?: string;
}> = ({ label, type = "text", value, onChange, onFocusClear, placeholder, required, className }) => {
  const [isFocused, setIsFocused] = useState(false);
  const id = React.useId();

  return (
    <div className={cn("relative mt-2", className)}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        onFocus={() => {
          setIsFocused(true);
          if (onFocusClear) onChange("");
        }}
        onBlur={() => setIsFocused(false)}
        placeholder=" "
        className="peer w-full bg-input border border-border rounded-xl p-3 text-foreground placeholder-transparent focus:outline-none focus:border-primary transition-all"
      />
      <label
        htmlFor={id}
        className={cn(
          "absolute left-3 transition-all pointer-events-none",
          (isFocused || value !== "") 
            ? "-top-2.5 left-2 text-[10px] bg-card px-1 text-primary font-bold" 
            : "top-3 text-sm text-muted-foreground"
        )}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );
};

export const AppointmentsPage: React.FC = () => {
  const { profile, isAdmin, isStaff, isCustomer } = useAuth();
  const navigate = useNavigate();
  const today = getLocalISODate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<UserProfile[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [filterDate, setFilterDate] = useState(getLocalISODate());
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [confirmDeleteAppt, setConfirmDeleteAppt] = useState<Appointment | null>(null);
  const [showSvcSuggestions, setShowSvcSuggestions] = useState(false);
  const [showCustSuggestions, setShowCustSuggestions] = useState(false);
  const [viewingCustomerHistory, setViewingCustomerHistory] = useState<Customer | null>(null);
  const [showOverlapPopup, setShowOverlapPopup] = useState(false);
  const [apptSearch, setApptSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<any>(Views.MONTH);
  const [activeTab, setActiveTab] = useState<'appointments' | 'points'>('appointments');
  const [showAllDates, setShowAllDates] = useState(isCustomer);
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('all');
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [isSubmittingAppt, setIsSubmittingAppt] = useState(false);

  // Form states
  const [selectedCustId, setSelectedCustId] = useState('');
  const [manualCustName, setManualCustName] = useState('');
  const [manualCustPhone, setManualCustPhone] = useState('');
  const [selectedSvcId, setSelectedSvcId] = useState('');
  const [manualSvcName, setManualSvcName] = useState('');
  const [selectedStaffEmail, setSelectedStaffEmail] = useState('');
  const [apptDate, setApptDate] = useState(getLocalISODate());
  const [apptTime, setApptTime] = useState('10:00');
  const [apptNotes, setApptNotes] = useState('');
  const [apptStatus, setApptStatus] = useState<'pending' | 'confirmed' | 'completed' | 'cancelled'>('pending');
  const [isHomeService, setIsHomeService] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [willEarnPoints, setWillEarnPoints] = useState(0);
  const [apptEndTime, setApptEndTime] = useState('');
  const [apptDuration, setApptDuration] = useState(30);
  const [formStep, setFormStep] = useState<1 | 2>(1);

  // Validate that selected staff works on the chosen date
  useEffect(() => {
    if (!selectedStaffEmail) return;
    const s = staff.find(member => member.email === selectedStaffEmail);
    if (!s) return;
    
    const [year, month, day] = (apptDate || getLocalISODate()).split('-');
    const apptDateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const apptDayName = apptDateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const isWorking = !s.workingDays || s.workingDays.includes(apptDayName);
    
    if (!isWorking) {
      setSelectedStaffEmail(''); // Clear the selection if they don't work that day
    }
  }, [apptDate, staff, selectedStaffEmail]);

  useEffect(() => {
    if (isCustomer && !editingAppointment && isAdding) {
      if (customers.length > 0) {
        setSelectedCustId(customers[0].id);
        setManualCustName(customers[0].name);
        setManualCustPhone(customers[0].phone || '');
      } else {
        setManualCustName(profile.name);
        setManualCustPhone(profile.phone || '');
        setSelectedCustId('manual');
      }
    }
  }, [profile, isAdding, editingAppointment, customers, isCustomer]);

  useEffect(() => {
    if (!profile) return;

    const apptsQuery = isCustomer
      ? query(collection(db, 'appointments'), where('creatorEmail', '==', profile.email))
      : query(collection(db, 'appointments'));

    const unsubAppts = onSnapshot(apptsQuery, (snapshot) => {
      let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      data.sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return b.time.localeCompare(a.time);
      });
      setAppointments(data);
      setLoadingAppts(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'appointments');
      setLoadingAppts(false);
    });

    const unsubCusts = (!isCustomer)
      ? onSnapshot(query(collection(db, 'customers'), orderBy('name')), (snapshot) => {
          setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer)));
        }, (error) => handleFirestoreError(error, OperationType.LIST, 'customers'))
      : onSnapshot(query(collection(db, 'customers'), where('email', '==', profile.email)), (snapshot) => {
          setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer)));
        }, (error) => handleFirestoreError(error, OperationType.LIST, 'customers'));

    const unsubSvcs = onSnapshot(query(collection(db, 'services'), orderBy('name')), (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'services'));

    const unsubStaff = onSnapshot(query(collection(db, 'users')), (snapshot) => {
      const uniqueStaff = new Map<string, UserProfile>();
      snapshot.docs.forEach(doc => {
        const data = doc.data() as UserProfile;
        // Client-side filtering: Hide super_admin and customers from the staff list
        const superAdminEmails = ['aungsoe366@gmail.com'];
        const isExcluded = data.role === 'super_admin' || 
                          data.role === 'customer' || 
                          (data.email && superAdminEmails.includes(data.email.toLowerCase().trim()));
        if (data.email && !isExcluded) {
          const email = data.email.toLowerCase().trim();
          if (!uniqueStaff.has(email) || data.uid) {
            uniqueStaff.set(email, { ...data, id: doc.id });
          }
        }
      });
      setStaff(Array.from(uniqueStaff.values()));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));

    let unsubSales: () => void = () => {};
    if (profile.role !== 'customer') {
      unsubSales = onSnapshot(query(collection(db, 'sales'), orderBy('dateTime', 'desc')), (snapshot) => {
        setSales(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale)));
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'sales'));
    }

    return () => {
      unsubAppts();
      unsubCusts();
      unsubSvcs();
      unsubStaff();
      unsubSales();
    };
  }, [profile]);

  useEffect(() => {
    if (selectedSvcId && selectedSvcId !== 'manual') {
      const s = services.find(s => s.id === selectedSvcId);
      if (s) {
        setWillEarnPoints(Math.floor(s.price / 1000));
        if (s.duration) {
          setApptDuration(s.duration);
        }
      }
    } else {
      setWillEarnPoints(0);
    }
  }, [selectedSvcId, services]);

  useEffect(() => {
    if (apptTime && apptDuration) {
      const [hours, minutes] = apptTime.split(':').map(Number);
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes + apptDuration);
      const endHours = date.getHours().toString().padStart(2, '0');
      const endMinutes = date.getMinutes().toString().padStart(2, '0');
      setApptEndTime(`${endHours}:${endMinutes}`);
    }
  }, [apptTime, apptDuration]);

  const checkOverlap = (date: string, time: string, duration: number, staffEmail: string, excludeId?: string) => {
    return appointments.some(a => {
      if (a.date !== date || a.status === 'cancelled' || a.id === excludeId || a.staffEmail !== staffEmail) return false;
      
      const apptStart = new Date(`${date}T${a.time}`);
      const apptEnd = new Date(apptStart.getTime() + (a.duration * 60000));
      
      const newStart = new Date(`${date}T${time}`);
      const newEnd = new Date(newStart.getTime() + (duration * 60000));
      
      return newStart < apptEnd && newEnd > apptStart;
    });
  };

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkOverlap(apptDate, apptTime, apptDuration, selectedStaffEmail)) {
      setShowOverlapPopup(true);
      return;
    }
    setIsSubmittingAppt(true);
    try {
      let cName = manualCustName;
      let cPhone = manualCustPhone;
      if (selectedCustId && selectedCustId !== 'manual') {
        const c = customers.find(c => c.id === selectedCustId);
        if (c) {
          cName = c.name;
          cPhone = c.phone;
        }
      }

      let sName = manualSvcName;
      if (selectedSvcId && selectedSvcId !== 'manual') {
        const s = services.find(s => s.id === selectedSvcId);
        if (s) sName = s.name;
      }

      let stfName = '';
      if (selectedStaffEmail) {
        const st = staff.find(s => s.email === selectedStaffEmail);
        if (st) stfName = st.name;
      }

      const newAppt: any = {
        customerName: cName,
        customerPhone: cPhone,
        serviceName: sName,
        date: apptDate,
        time: apptTime,
        endTime: apptEndTime,
        duration: apptDuration,
        status: apptStatus,
        isHomeService,
        notes: apptNotes,
        pointsToRedeem,
        willEarnPoints,
        createdAt: new Date().toISOString()
      };

      if (selectedCustId && selectedCustId !== 'manual') {
        newAppt.customerId = selectedCustId;
        const c = customers.find(c => c.id === selectedCustId);
        if (c && c.email) newAppt.customerEmail = c.email;
      } else {
        delete newAppt.customerId;
      }
      
      if (selectedSvcId && selectedSvcId !== 'manual') {
        newAppt.serviceId = selectedSvcId;
      } else {
        delete newAppt.serviceId;
      }

      if (stfName) newAppt.staffName = stfName;
      if (selectedStaffEmail) newAppt.staffEmail = selectedStaffEmail;
      
      // Track who created the appointment
      if (profile) {
        newAppt.creatorName = profile.name;
        newAppt.creatorEmail = profile.email;
      }

      const docRef = await addDoc(collection(db, 'appointments'), newAppt);
      
      if (apptStatus === 'completed') {
        await processAppointmentPoints({ id: docRef.id, ...newAppt }, true);
      }

      setStatusMsg({ type: 'success', text: 'Appointment added successfully' });
      resetForm();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'appointments');
      setStatusMsg({ type: 'error', text: 'Failed to add appointment' });
    } finally {
      setIsSubmittingAppt(false);
    }
  };

  const handleUpdateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;
    if (checkOverlap(apptDate, apptTime, apptDuration, selectedStaffEmail, editingAppointment.id)) {
      setShowOverlapPopup(true);
      return;
    }
    setIsSubmittingAppt(true);
    try {
      let cName = manualCustName;
      let cPhone = manualCustPhone;
      if (selectedCustId && selectedCustId !== 'manual') {
        const c = customers.find(c => c.id === selectedCustId);
        if (c) {
          cName = c.name;
          cPhone = c.phone;
        }
      }

      let sName = manualSvcName;
      if (selectedSvcId && selectedSvcId !== 'manual') {
        const s = services.find(s => s.id === selectedSvcId);
        if (s) sName = s.name;
      }

      let stfName = '';
      if (selectedStaffEmail) {
        const st = staff.find(s => s.email === selectedStaffEmail);
        if (st) stfName = st.name;
      }

      const updatedAppt: any = {
        customerName: cName,
        customerPhone: cPhone,
        serviceName: sName,
        date: apptDate,
        time: apptTime,
        endTime: apptEndTime,
        duration: apptDuration,
        status: apptStatus,
        isHomeService,
        notes: apptNotes,
        pointsToRedeem,
        willEarnPoints
      };

      if (selectedCustId && selectedCustId !== 'manual') {
        updatedAppt.customerId = selectedCustId;
      } else {
        updatedAppt.customerId = null; // Use null to remove it if needed
      }

      if (selectedSvcId && selectedSvcId !== 'manual') {
        updatedAppt.serviceId = selectedSvcId;
      } else {
        updatedAppt.serviceId = null;
      }

      if (stfName) updatedAppt.staffName = stfName;
      if (selectedStaffEmail) updatedAppt.staffEmail = selectedStaffEmail;

      await updateDoc(doc(db, 'appointments', editingAppointment.id), updatedAppt);
      
      if (apptStatus === 'completed' && editingAppointment.status !== 'completed') {
        await processAppointmentPoints({ ...editingAppointment, ...updatedAppt }, true);
      } else if (editingAppointment.status === 'completed' && apptStatus !== 'completed') {
        await processAppointmentPoints({ ...editingAppointment, ...updatedAppt }, false);
      }

      setStatusMsg({ type: 'success', text: 'Appointment updated successfully' });
      resetForm();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'appointments');
      setStatusMsg({ type: 'error', text: 'Failed to update appointment' });
    } finally {
      setIsSubmittingAppt(false);
    }
  };

  const handleDeleteAppointment = async () => {
    if (!confirmDeleteAppt) return;
    try {
      // If appointment was completed, reverse points before deleting
      if (confirmDeleteAppt.status === 'completed' && confirmDeleteAppt.pointsProcessed) {
        await processAppointmentPoints(confirmDeleteAppt, false);
      }
      
      await deleteDoc(doc(db, 'appointments', confirmDeleteAppt.id));
      setStatusMsg({ type: 'success', text: 'Appointment deleted' });
      setConfirmDeleteAppt(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `appointments/${confirmDeleteAppt.id}`);
      setStatusMsg({ type: 'error', text: 'Failed to delete appointment' });
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingAppointment(null);
    setSelectedCustId('');
    setManualCustName('');
    setManualCustPhone('');
    setSelectedSvcId('');
    setManualSvcName('');
    setSelectedStaffEmail('');
    setApptDate(getLocalISODate());
    setApptTime('10:00');
    setApptNotes('');
    setApptStatus('pending');
    setIsHomeService(false);
    setPointsToRedeem(0);
    setWillEarnPoints(0);
    setApptEndTime('');
    setApptDuration(30);
    setFormStep(1);
    setShowSvcSuggestions(false);
    setShowCustSuggestions(false);
    setCustomerSearch('');
  };

  const startEdit = (appt: Appointment) => {
    setEditingAppointment(appt);
    setSelectedCustId(appt.customerId || 'manual');
    setManualCustName(appt.customerName);
    setManualCustPhone(appt.customerPhone);
    setSelectedSvcId(appt.serviceId || 'manual');
    setManualSvcName(appt.serviceName);
    setSelectedStaffEmail(appt.staffEmail || '');
    setApptDate(appt.date);
    setApptTime(appt.time);
    setApptNotes(appt.notes || '');
    setApptStatus(appt.status);
    setIsHomeService(appt.isHomeService || false);
    setPointsToRedeem(appt.pointsToRedeem || 0);
    setWillEarnPoints(appt.willEarnPoints || 0);
    setApptDuration(appt.duration || 30);
    setApptEndTime(appt.endTime || '');
    setFormStep(1);
    setIsAdding(true);
  };

  const processAppointmentPoints = async (appt: Appointment, isCompleting: boolean) => {
    if (!appt.customerId || appt.customerId === 'manual') return;
    if (appt.pointsProcessed === isCompleting) return; // Already processed or already reversed

    try {
      const customerRef = doc(db, 'customers', appt.customerId);
      const customerSnap = await getDoc(customerRef);
      if (customerSnap.exists()) {
        const currentPoints = customerSnap.data().points || 0;
        const earn = appt.willEarnPoints || 0;
        const redeem = appt.pointsToRedeem || 0;
        
        let newPoints = currentPoints;
        if (isCompleting) {
          newPoints = currentPoints + earn - redeem;
        } else {
          // Reversing completion
          newPoints = currentPoints - earn + redeem;
        }
        
        const finalPoints = Math.max(0, newPoints);
        await updateDoc(customerRef, { points: finalPoints });
        await updateDoc(doc(db, 'appointments', appt.id), { pointsProcessed: isCompleting });
        
        // Update user profile points if email is present
        if (customerSnap.data().email) {
          const userDocRef = doc(db, 'users', customerSnap.data().email.toLowerCase());
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
             await updateDoc(userDocRef, { points: finalPoints });
          }
        }
      }
    } catch (error) {
      console.error("Error processing points:", error);
    }
  };

  const handleQuickStatusUpdate = async (apptId: string, newStatus: Appointment['status']) => {
    try {
      const appt = appointments.find(a => a.id === apptId);
      if (!appt) return;

      await updateDoc(doc(db, 'appointments', apptId), { status: newStatus });
      
      if (newStatus === 'completed') {
        await processAppointmentPoints(appt, true);
      } else if (appt.status === 'completed') {
        await processAppointmentPoints(appt, false);
      }

      setStatusMsg({ type: 'success', text: `Status updated to ${newStatus}` });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'appointments');
      setStatusMsg({ type: 'error', text: 'Failed to update status' });
    }
  };

  const filteredAppts = appointments
    .filter(a => {
      const matchesDate = showAllDates || a.date === filterDate;
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchesSearch = !apptSearch || 
        a.customerName.toLowerCase().includes(apptSearch.toLowerCase()) || 
        a.customerPhone.includes(apptSearch) ||
        a.serviceName.toLowerCase().includes(apptSearch.toLowerCase());
      const matchesUser = profile?.role !== 'customer' || a.creatorEmail === profile?.email;
      const matchesStaff = selectedStaffFilter === 'all' || a.staffEmail === selectedStaffFilter;
      return matchesDate && matchesStatus && matchesSearch && matchesUser && matchesStaff;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = `${a.date}T${a.time}`;
        const dateB = `${b.date}T${b.time}`;
        return sortOrder === 'asc' ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
      } else {
        // Sort by status priority or alphabetically
        const statusPriority: Record<string, number> = {
          'confirmed': 1,
          'pending': 2,
          'completed': 3,
          'cancelled': 4
        };
        const prioA = statusPriority[a.status] || 99;
        const prioB = statusPriority[b.status] || 99;
        return sortOrder === 'asc' ? prioA - prioB : prioB - prioA;
      }
    });

  const calendarEvents = appointments
    .filter(a => profile?.role !== 'customer' || a.creatorEmail === profile?.email)
    .map(appt => {
      try {
        if (!appt.date || !appt.time) return null;
        const dateParts = appt.date.split('-');
        const timeParts = appt.time.split(':');
        
        if (dateParts.length !== 3 || timeParts.length < 2) return null;
        
        const [year, month, day] = dateParts.map(Number);
        const [hour, minute] = timeParts.map(Number);
        
        if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute)) return null;
        
        const start = new Date(year, month - 1, day, hour, minute);
        if (isNaN(start.getTime())) return null;
        
        let end: Date;
        if (appt.endTime) {
          const endTimeParts = appt.endTime.split(':');
          if (endTimeParts.length >= 2) {
            const [endHour, endMinute] = endTimeParts.map(Number);
            if (!isNaN(endHour) && !isNaN(endMinute)) {
              end = new Date(year, month - 1, day, endHour, endMinute);
            } else {
              end = new Date(start.getTime() + (appt.duration || 60) * 60000);
            }
          } else {
            end = new Date(start.getTime() + (appt.duration || 60) * 60000);
          }
        } else {
          end = new Date(start.getTime() + (appt.duration || 60) * 60000);
        }
        
        if (isNaN(end.getTime())) {
          end = new Date(start.getTime() + 60 * 60 * 1000);
        }

        return {
          id: appt.id,
          title: `${appt.customerName} - ${appt.serviceName}`,
          start,
          end,
          resource: appt,
          allDay: false
        };
      } catch (e) {
        console.error("Error parsing appointment for calendar:", e, appt);
        return null;
      }
    })
    .filter((e): e is any => e !== null);

  console.log("Calendar View Mode:", viewMode);
  console.log("Calendar Events Count:", calendarEvents.length);
  if (calendarEvents.length > 0) {
    console.log("First Event:", calendarEvents[0]);
  }

  const handleSelectEvent = (event: any) => {
    const appt = event.resource;
    if (isAdmin || (appt.status !== 'completed' && appt.status !== 'cancelled')) {
      startEdit(appt);
    }
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    resetForm();
    setApptDate(format(start, 'yyyy-MM-dd'));
    setApptTime(format(start, 'HH:mm'));
    setIsAdding(true);
  };

  const eventPropGetter = (event: any) => {
    const appt = event.resource;
    let backgroundColor = '#d4af37'; // default primary
    if (appt.status === 'pending') backgroundColor = '#eab308'; // yellow-600
    if (appt.status === 'confirmed') backgroundColor = '#2563eb'; // blue-600
    if (appt.status === 'completed') backgroundColor = '#16a34a'; // green-600
    if (appt.status === 'cancelled') backgroundColor = '#dc2626'; // red-600
    
    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const CustomCalendarToolbar = (toolbar: any) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };
    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };
    const goToToday = () => {
      toolbar.onNavigate('TODAY');
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-muted/5 p-4 rounded-3xl border border-border shadow-inner">
        <div className="flex items-center gap-2">
          <button
            onClick={goToBack}
            className="p-2.5 hover:bg-muted rounded-xl transition-all text-muted-foreground hover:text-foreground active:scale-90 border border-border bg-card shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToToday}
            className="px-6 py-2.5 bg-primary/10 text-primary rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-primary/20 transition-all border border-primary/10 active:scale-95 shadow-sm"
          >
            Today
          </button>
          <button
            onClick={goToNext}
            className="p-2.5 hover:bg-muted rounded-xl transition-all text-muted-foreground hover:text-foreground active:scale-90 border border-border bg-card shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="text-xl font-black tracking-tighter text-foreground uppercase">
          {toolbar.label}
        </div>

        <div className="flex bg-muted p-1 rounded-xl border border-white/5 shadow-xl ">
          {['month', 'week', 'day'].map((view) => (
            <button
              key={view}
              onClick={() => toolbar.onView(view)}
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                toolbar.view === view 
                  ? "bg-gray-700/80 text-foreground shadow-lg" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {view}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground leading-none">
            {isCustomer ? 'My Appointments' : 'Customer Appointments'}
          </h1>
          {isCustomer && profile.points !== undefined && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30 shadow-sm">
                {profile.points.toLocaleString()} Points Available
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-muted p-1 rounded-xl border border-border shadow-xl ">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                viewMode === 'list' 
                  ? "bg-card text-foreground shadow-lg" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                viewMode === 'calendar' 
                  ? "bg-card text-foreground shadow-lg" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <CalendarIcon size={16} />
              Calendar
            </button>
          </div>

          <button
            onClick={() => { resetForm(); setIsAdding(true); }}
            className="bg-primary text-foreground px-6 py-3 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20 font-bold group"
          >
            <div className="bg-black/10 p-1 rounded-full group-hover:bg-black/20 transition-colors">
              <Plus size={20} />
            </div>
            <div className="text-left leading-none">
              <div className="text-[9px] uppercase tracking-widest font-bold opacity-70 mb-0.5">Book</div>
              <div className="text-sm tracking-tight">Appointment</div>
            </div>
          </button>
        </div>
      </div>

      {statusMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-4 rounded-2xl flex items-center justify-between border shadow-lg",
            statusMsg.type === 'success' ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"
          )}
        >
          <div className="flex items-center gap-3">
            {statusMsg.type === 'success' ? <Check size={20} /> : <X size={20} />}
            <span className="font-bold">{statusMsg.text}</span>
          </div>
          <button onClick={() => setStatusMsg(null)} className="p-1 hover:bg-black/5 rounded-full"><X size={18} /></button>
        </motion.div>
      )}

      {activeTab === 'appointments' ? (
        <div className="space-y-4">
          {/* Filter Card */}
          <div className="bg-card rounded-[2rem] border border-border shadow-2xl w-full mb-6 z-50 relative">
            <div className="p-4 border-b border-border/50 relative group">
              <input
                type="text"
                placeholder="Search customer or service..."
                value={apptSearch}
                onChange={(e) => setApptSearch(e.target.value)}
                className="w-full p-2 pl-10 border-none outline-none bg-transparent text-foreground font-bold text-sm transition-all placeholder:text-muted-foreground/50"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
            </div>
            <div className="flex flex-col md:flex-row md:items-center">
              <CustomDatePicker 
                label="FILTER DATE" 
                value={filterDate} 
                onChange={(val) => {
                  setFilterDate(val);
                  setShowAllDates(false);
                }}
                disabled={showAllDates}
                className={cn("border-b md:border-b-0 md:border-r border-border/50 flex-1", showAllDates && "opacity-50")}
              />
              {profile?.role !== 'customer' && (
                <div className="flex flex-col p-4 border-b md:border-b-0 md:border-r border-border/50 flex-1">
                   <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-2">
                     <UserIcon size={12} className="text-primary" /> STAFF
                   </label>
                   <CustomSelect
                     value={selectedStaffFilter} 
                     onChange={setSelectedStaffFilter}
                     placeholder="All Staff"
                     options={[
                       { value: 'all', label: 'All Staff' },
                       ...staff.map(s => ({ value: s.email, label: s.name }))
                     ]}
                   />
                </div>
              )}
              <div className="flex flex-col p-4 border-b md:border-b-0 md:border-r border-border/50 flex-1">
                 <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-2">
                   <Activity size={12} className="text-primary" /> STATUS
                 </label>
                 <CustomSelect
                   value={statusFilter} 
                   onChange={setStatusFilter}
                   placeholder="All Status"
                   options={[
                     { value: 'all', label: 'All Status' },
                     { value: 'pending', label: 'Pending' },
                     { value: 'confirmed', label: 'Confirmed' },
                     { value: 'completed', label: 'Completed' },
                     { value: 'cancelled', label: 'Cancelled' }
                   ]}
                 />
              </div>
              <div className="flex flex-col p-4 flex-1">
                 <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-2">
                   <Settings size={12} className="text-primary" /> OPTIONS
                 </label>
                 <div className="flex items-center gap-2">
                   <button
                     onClick={() => setShowAllDates(!showAllDates)}
                     className={cn("px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", showAllDates ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}
                   >
                     {showAllDates ? 'All Dates' : 'Show All'}
                   </button>
                   <button
                     onClick={() => setSortBy(sortBy === 'date' ? 'status' : 'date')}
                     className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all bg-muted text-muted-foreground hover:bg-muted/80"
                   >
                     Sort: {sortBy}
                   </button>
                 </div>
              </div>
            </div>
          </div>

          <div className="p-0">
            {loadingAppts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-sm transition-all group relative overflow-hidden animate-pulse h-[160px]">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-10 bg-primary/20 rounded-xl"></div>
                      <div className="w-20 h-6 bg-primary/10 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="w-1/2 h-5 bg-primary/20 rounded-md"></div>
                      <div className="w-3/4 h-4 bg-primary/10 rounded-md"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : viewMode === 'calendar' ? (
            <div className="h-[600px] bg-background rounded-2xl p-4 border border-border shadow-inner">
              <style>{`
                .rbc-calendar { font-family: inherit; }
                .rbc-event { background-color: var(--color-primary); color: #000; border-radius: 12px; font-size: 11px; font-weight: 700; border: none; padding: 4px 8px; }
                .rbc-today { background-color: rgba(212, 175, 55, 0.08); }
                .rbc-header { padding: 16px; font-weight: 800; text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; color: var(--muted); border-bottom: 2px solid var(--border) !important; }
                .dark .rbc-calendar { color: #f8f9fa; }
                .dark .rbc-off-range-bg { background: #1a1a1a; }
                .dark .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #2d2d2d; }
                .dark .rbc-month-row + .rbc-month-row { border-top: 1px solid #2d2d2d; }
                .dark .rbc-month-view { border: 1px solid #2d2d2d; border-radius: 24px; overflow: hidden; }
                .dark .rbc-header { border-bottom: 1px solid #2d2d2d; border-left: 1px solid #2d2d2d; color: #f8f9fa; }
                .dark .rbc-header + .rbc-header { border-left: 1px solid #2d2d2d; }
                .dark .rbc-time-view { border: 1px solid #2d2d2d; border-radius: 24px; overflow: hidden; }
                .dark .rbc-time-header { border-bottom: 1px solid #2d2d2d; color: #f8f9fa; }
                .dark .rbc-time-header-content { border-left: 1px solid #2d2d2d; }
                .dark .rbc-time-content { border-top: 1px solid #2d2d2d; }
                .dark .rbc-time-content > * + * > * { border-left: 1px solid #2d2d2d; }
                .dark .rbc-timeslot-group { border-bottom: 1px solid #2d2d2d; }
                .dark .rbc-day-slot .rbc-time-slot { border-top: 1px solid #2d2d2d; }
                .dark .rbc-toolbar button { color: #f8f9fa; border: 1px solid #2d2d2d; border-radius: 8px; margin: 0 2px; }
                .dark .rbc-toolbar button:hover { background-color: #2d2d2d; }
                .dark .rbc-toolbar button.rbc-active { background-color: var(--color-primary); color: black; }
                .dark .rbc-button-link { color: #f8f9fa; }
                .dark .rbc-show-more { color: var(--color-primary); }
              `}</style>
              <BigCalendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                views={['month', 'week', 'day']}
                view={calendarView}
                onView={(v) => setCalendarView(v)}
                date={calendarDate}
                onNavigate={(d) => setCalendarDate(d)}
                eventPropGetter={eventPropGetter}
                components={{
                  toolbar: CustomCalendarToolbar
                }}
              />
            </div>
          ) : filteredAppts.length === 0 ? (
            <div className="text-center py-32 bg-muted/5 rounded-[3rem] border-2 border-dashed border-border">
              <div className="w-24 h-24 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarIcon className="text-muted-foreground/30" size={48} />
              </div>
              <p className="text-muted-foreground text-lg font-bold italic">No appointments found matching your criteria.</p>
              <button 
                onClick={() => { resetForm(); setIsAdding(true); }}
                className="mt-6 text-primary font-black text-sm uppercase tracking-widest hover:underline flex items-center gap-2 mx-auto"
              >
                <Plus size={16} />
                Book New Appointment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAppts.map((appt) => {
                  const customer = customers.find(c => c.id === appt.customerId);
                  return (
                    <motion.div 
                      layout
                      key={appt.id} 
                      onClick={() => {
                        if (isAdmin || (appt.status !== 'completed' && appt.status !== 'cancelled')) {
                          startEdit(appt);
                        }
                      }}
                      className={cn(
                        "bg-card border border-border rounded-2xl p-5 shadow-sm transition-all group relative overflow-hidden",
                        (isAdmin || (appt.status !== 'completed' && appt.status !== 'cancelled')) ? "hover:shadow-xl hover:border-primary/30 cursor-pointer" : "opacity-90"
                      )}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[3rem] -mr-8 -mt-8 transition-all group-hover:scale-110 group-hover:bg-primary/10"></div>
                      
                      <div className="flex justify-between items-start relative z-10 mb-6">
                        <div className="flex flex-col">
                          <div className="bg-primary/5 text-primary px-4 py-2 rounded-xl font-black text-xl tracking-tighter shadow-sm border border-primary/10">
                            {appt.time}
                          </div>
                          <div className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1.5 ml-1">
                            {formatDisplayDate(appt.date)}
                          </div>
                        </div>
                        <div className={cn(
                          "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border  transition-all",
                          appt.status === 'pending' && "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 text-yellow-600  border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]",
                          appt.status === 'confirmed' && "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600  border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
                          appt.status === 'completed' && "bg-gradient-to-r from-green-500 to-emerald-600 text-foreground border-transparent shadow-[0_0_15px_rgba(34,197,94,0.4)]",
                          appt.status === 'cancelled' && "bg-gradient-to-r from-red-500/10 to-rose-500/10 text-red-600  border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                        )}>
                          {appt.status === 'pending' && <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />}
                          {appt.status === 'confirmed' && <Check size={12} strokeWidth={3} />}
                          {appt.status === 'completed' && <Check size={12} strokeWidth={3} />}
                          {appt.status === 'cancelled' && <X size={12} strokeWidth={3} />}
                          {appt.status}
                        </div>
                      </div>

                      <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-black text-foreground text-xl group-hover:text-primary transition-colors truncate tracking-tight leading-tight">{appt.customerName}</h3>
                            <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-xs mt-3 font-bold">
                              <div className="flex items-center gap-1.5 bg-muted/5 px-2.5 py-1 rounded-lg border border-border">
                                <Phone size={14} className="text-primary" />
                                <span className="text-xs tracking-tight">{appt.customerPhone}</span>
                              </div>
                              {customer && (
                                <span className="bg-primary/5 text-primary px-3 py-1 rounded-full text-[9px] font-black border border-primary/10 tracking-widest shadow-sm">
                                  {customer.points} PTS
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {appt.isHomeService && (
                              <div className="p-2.5 bg-green-600 text-foreground rounded-xl shadow-lg shadow-green-900/10 transition-transform group-hover:scale-110" title="At Home Service">
                                <Car size={18} strokeWidth={2.5} />
                              </div>
                            )}
                            {profile?.role !== 'customer' && (
                              <a 
                                href={`https://wa.me/${appt.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent('Hello ' + appt.customerName + ',\n\nYour appointment for ' + appt.serviceName + ' has been ' + appt.status + ' for ' + formatDisplayDate(appt.date) + ' at ' + appt.time + '.\n\nThank you for choosing Nail Pro!')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-2.5 bg-green-500/5 text-green-600 hover:bg-green-600 hover:text-foreground rounded-xl transition-all border border-green-500/10 shadow-sm active:scale-90"
                                title="WhatsApp"
                              >
                                <MessageCircle size={16} strokeWidth={2.5} />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="bg-muted/5 rounded-2xl p-4 space-y-3 border border-border shadow-inner group-hover:bg-muted/10 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-primary/5 rounded-xl text-primary shadow-sm border border-primary/5">
                                <Briefcase size={18} strokeWidth={2.5} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black text-muted-foreground text-muted-foreground uppercase tracking-widest">Service</span>
                                <span className="text-lg font-black text-foreground tracking-tight">{appt.serviceName}</span>
                              </div>
                            </div>
                            {appt.willEarnPoints && appt.willEarnPoints > 0 && (
                              <span className="text-[9px] font-black text-green-600 bg-green-500/5 px-2.5 py-1 rounded-lg border border-green-500/10 shadow-sm">+{appt.willEarnPoints} PTS</span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-border/30">
                            {appt.staffName ? (
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-muted/5 rounded-xl text-muted-foreground shadow-sm border border-border">
                                  <UserIcon size={18} strokeWidth={2.5} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-black text-muted-foreground text-muted-foreground uppercase tracking-widest">Staff</span>
                                  <span className="text-xs text-foreground font-bold">{appt.staffName}</span>
                                </div>
                              </div>
                            ) : <div />}
                            {appt.pointsToRedeem && appt.pointsToRedeem > 0 && (
                              <span className="text-[9px] font-black text-red-600 bg-red-500/5 px-2.5 py-1 rounded-lg border border-red-500/10 shadow-sm">-{appt.pointsToRedeem} PTS</span>
                            )}
                          </div>
                        </div>

                        {appt.notes && (
                          <div className="text-xs text-muted-foreground italic line-clamp-2 bg-primary/5 p-3 rounded-xl border border-primary/5 font-medium leading-relaxed shadow-inner">
                            <span className="text-primary font-black not-italic mr-1.5">Notes:</span>
                            "{appt.notes}"
                          </div>
                        )}

                        <div className="pt-4 flex items-center justify-between border-t border-border">
                          <div className="flex flex-col">
                            <span className="text-[8px] text-muted-foreground uppercase tracking-[0.2em] font-black">Booked By</span>
                            <span className="text-[9px] font-bold text-foreground">{appt.creatorName || 'SYSTEM'}</span>
                          </div>
                          <div className="flex gap-2">
                            {profile?.role !== 'customer' && (
                              <div className="relative">
                                <CustomSelect
                                  disabled={!isAdmin && (appt.status === 'completed' || appt.status === 'cancelled')}
                                  value={appt.status}
                                  onChange={(val) => handleQuickStatusUpdate(appt.id, val as any)}
                                  options={[
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'confirmed', label: 'Confirmed' },
                                    { value: 'completed', label: 'Completed' },
                                    { value: 'cancelled', label: 'Cancelled' }
                                  ]}
                                  buttonClassName={cn(
                                    "text-[9px] font-black uppercase tracking-widest border rounded-xl px-4 py-2 pr-8 ",
                                    appt.status === 'pending' && "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 text-yellow-600  border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]",
                                    appt.status === 'confirmed' && "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600  border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
                                    appt.status === 'completed' && "bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-600  border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]",
                                    appt.status === 'cancelled' && "bg-gradient-to-r from-red-500/10 to-rose-500/10 text-red-600  border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                                  )}
                                />
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={12} />
                              </div>
                            )}
                            {(isAdmin || (appt.status !== 'completed' && appt.status !== 'cancelled')) && (
                              <div className="flex gap-1.5">
                                <button
                                  onClick={(e) => { e.stopPropagation(); startEdit(appt); }}
                                  className="p-2.5 bg-muted/5 text-primary-foreground hover:bg-primary hover:text-primary-foreground rounded-xl transition-all border border-border shadow-sm active:scale-90"
                                  title="Edit"
                                >
                                  <Pencil size={16} strokeWidth={2.5} />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteAppt(appt); }}
                                  className="p-2.5 bg-red-500/5 text-red-600 hover:bg-red-600 hover:text-foreground rounded-xl transition-all border border-red-500/10 shadow-sm active:scale-90"
                                  title="Delete"
                                >
                                  <Trash2 size={16} strokeWidth={2.5} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-card rounded-3xl border border-border p-8 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-foreground">Points Summary</h2>
                <p className="text-sm text-muted-foreground">Track your loyalty rewards and redemptions.</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-primary tracking-tighter">{profile?.points?.toLocaleString() || 0}</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Available Points</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-green-500/10 p-5 rounded-2xl border border-green-500/20">
                <div className="text-[10px] font-bold text-green-600  uppercase tracking-widest mb-1">Total Earned</div>
                <div className="text-2xl font-bold text-green-700 ">
                  +{
                    sales.filter(s => s.customerPhone === profile?.phone).reduce((sum, s) => sum + (s.pointsEarned || 0), 0) +
                    appointments.filter(a => a.customerPhone === profile?.phone && a.pointsProcessed).reduce((sum, a) => sum + (a.willEarnPoints || 0), 0)
                  }
                </div>
              </div>
              <div className="bg-red-500/10 p-5 rounded-2xl border border-red-500/20">
                <div className="text-[10px] font-bold text-red-600  uppercase tracking-widest mb-1">Total Redeemed</div>
                <div className="text-2xl font-bold text-red-700 ">
                  -{
                    sales.filter(s => s.customerPhone === profile?.phone).reduce((sum, s) => sum + (s.pointsRedeemed || 0), 0) +
                    appointments.filter(a => a.customerPhone === profile?.phone && a.pointsProcessed).reduce((sum, a) => sum + (a.pointsToRedeem || 0), 0)
                  }
                </div>
              </div>
              <div className="bg-primary/10 p-5 rounded-2xl border border-border">
                <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Next Reward</div>
                <div className="text-2xl font-bold text-primary">500 pts</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                <HistoryIcon size={16} className="text-primary" />
                Recent Activity
              </h3>
              <div className="overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/10">
                      <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Activity</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(() => {
                      const history = [
                        ...sales.filter(s => s.customerPhone === profile?.phone).flatMap(sale => [
                          ...(sale.pointsEarned ? [{
                            id: `${sale.id}-earned`,
                            date: sale.dateTime,
                            title: 'Service Visit',
                            details: sale.items.map(i => i.name).join(', '),
                            points: sale.pointsEarned,
                            type: 'earned'
                          }] : []),
                          ...(sale.pointsRedeemed ? [{
                            id: `${sale.id}-redeemed`,
                            date: sale.dateTime,
                            title: 'Points Redeemed',
                            details: 'Discount applied to visit',
                            points: -sale.pointsRedeemed,
                            type: 'redeemed'
                          }] : [])
                        ]),
                        ...appointments.filter(a => a.customerPhone === profile?.phone && a.pointsProcessed).flatMap(appt => [
                          ...(appt.willEarnPoints ? [{
                            id: `${appt.id}-earned`,
                            date: appt.date + 'T' + appt.time,
                            title: 'Appointment Completed',
                            details: appt.serviceName,
                            points: appt.willEarnPoints,
                            type: 'earned'
                          }] : []),
                          ...(appt.pointsToRedeem ? [{
                            id: `${appt.id}-redeemed`,
                            date: appt.date + 'T' + appt.time,
                            title: 'Points Redeemed',
                            details: `Redeemed for ${appt.serviceName}`,
                            points: -appt.pointsToRedeem,
                            type: 'redeemed'
                          }] : [])
                        ])
                      ].sort((a, b) => b.date.localeCompare(a.date));

                      if (history.length === 0) {
                        return (
                          <tr>
                            <td colSpan={3} className="px-4 py-10 text-center text-xs text-muted-foreground italic">No point activity recorded yet.</td>
                          </tr>
                        );
                      }

                      return history.map(item => (
                        <tr key={item.id} className="hover:bg-muted/5 transition-colors">
                          <td className="px-4 py-3 text-xs text-muted-foreground">{format(new Date(item.date), 'MMM d, yyyy')}</td>
                          <td className="px-4 py-3">
                            <div className="text-xs font-bold text-foreground">{item.title}</div>
                            <div className="text-[10px] text-muted-foreground">{item.details}</div>
                          </td>
                          <td className={cn(
                            "px-4 py-3 text-right text-xs font-bold",
                            item.type === 'earned' ? "text-green-600 " : "text-red-500 "
                          )}>
                            {item.points > 0 ? `+${item.points}` : item.points}
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewingCustomerHistory && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[20000] p-4 pt-[90px] sm:p-6 sm:pt-[90px] ">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-card rounded-[2.5rem] w-full max-w-2xl max-h-[calc(100dvh-110px)] overflow-hidden shadow-2xl border border-border transition-colors duration-300"
          >
            <div className="p-8 border-b border-border bg-muted/5 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-4">
                  <h3 className="text-primary font-black text-3xl tracking-tighter">{viewingCustomerHistory.name}</h3>
                  {isAdmin && (
                    <button 
                      onClick={() => {
                        setViewingCustomerHistory(null);
                        navigate('/manage', { state: { activeTab: 'customers', viewCustomer: viewingCustomerHistory } });
                      }}
                      className="flex items-center gap-2 text-[10px] bg-primary text-primary-foreground px-3 py-1 rounded-full font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                      <HistoryIcon size={12} />
                      Full History
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">{viewingCustomerHistory.phone}</p>
                  <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-border">{(viewingCustomerHistory.points || 0).toLocaleString()} pts</span>
                </div>
              </div>
              <button 
                onClick={() => setViewingCustomerHistory(null)}
                className="p-3 hover:bg-muted/10 rounded-2xl transition-all text-muted-foreground hover:text-foreground active:scale-90"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
              <div className="space-y-10">
                {/* Points Summary for Admin */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-500/5 p-4 rounded-2xl border border-green-500/10">
                    <div className="text-[10px] font-bold text-green-600  uppercase tracking-widest mb-1">Total Earned</div>
                    <div className="text-xl font-bold text-green-700 ">
                      +{
                        sales.filter(s => s.customerPhone === viewingCustomerHistory.phone).reduce((sum, s) => sum + (s.pointsEarned || 0), 0) +
                        appointments.filter(a => (a.customerId === viewingCustomerHistory.id || a.customerPhone === viewingCustomerHistory.phone) && a.pointsProcessed).reduce((sum, a) => sum + (a.willEarnPoints || 0), 0)
                      }
                    </div>
                  </div>
                  <div className="bg-red-500/5 p-4 rounded-2xl border border-red-500/10">
                    <div className="text-[10px] font-bold text-red-600  uppercase tracking-widest mb-1">Total Redeemed</div>
                    <div className="text-xl font-bold text-red-700 ">
                      -{
                        sales.filter(s => s.customerPhone === viewingCustomerHistory.phone).reduce((sum, s) => sum + (s.pointsRedeemed || 0), 0) +
                        appointments.filter(a => (a.customerId === viewingCustomerHistory.id || a.customerPhone === viewingCustomerHistory.phone) && a.pointsProcessed).reduce((sum, a) => sum + (a.pointsToRedeem || 0), 0)
                      }
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
                    <HistoryIcon className="text-primary" size={16} />
                    Sales History
                  </h4>
                  <div className="space-y-3">
                    {sales.filter(s => s.customerPhone === viewingCustomerHistory.phone || s.customerName === viewingCustomerHistory.name).length === 0 ? (
                      <p className="text-muted-foreground text-xs italic bg-muted/5 p-6 rounded-2xl border border-dashed border-border text-center">No sales history found.</p>
                    ) : (
                      sales.filter(s => s.customerPhone === viewingCustomerHistory.phone || s.customerName === viewingCustomerHistory.name)
                        .sort((a, b) => b.dateTime.localeCompare(a.dateTime))
                        .map(s => (
                        <div key={s.id} className="bg-card border border-border p-5 rounded-2xl shadow-sm flex justify-between items-center hover:border-primary/50 transition-all group">
                          <div>
                            <div className="font-bold text-foreground group-hover:text-primary transition-colors">{s.items.map(i => i.name).join(', ')}</div>
                            <div className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-wider">{format(new Date(s.dateTime), 'MMM d, yyyy • hh:mm a')}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-primary text-lg tracking-tighter">{s.total.toLocaleString()} Ks</div>
                            {s.pointsEarned > 0 && <div className="text-[10px] text-green-600  font-bold uppercase tracking-widest">+{s.pointsEarned} pts</div>}
                            {s.pointsRedeemed > 0 && <div className="text-[10px] text-red-500  font-bold uppercase tracking-widest">-{s.pointsRedeemed} pts</div>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
                    <Calendar className="text-primary" size={16} />
                    Appointment History
                  </h4>
                  <div className="space-y-3">
                    {appointments.filter(a => a.customerId === viewingCustomerHistory.id || a.customerPhone === viewingCustomerHistory.phone).length === 0 ? (
                      <p className="text-muted-foreground text-xs italic bg-muted/5 p-6 rounded-2xl border border-dashed border-border text-center">No appointment history found.</p>
                    ) : (
                      appointments
                        .filter(a => a.customerId === viewingCustomerHistory.id || a.customerPhone === viewingCustomerHistory.phone)
                        .sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime())
                        .map(a => (
                          <div key={a.id} className="bg-card border border-border p-5 rounded-2xl shadow-sm flex justify-between items-center hover:border-primary/50 transition-all group">
                            <div>
                              <div className="font-bold text-foreground group-hover:text-primary transition-colors">{a.serviceName}</div>
                              <div className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-wider">{format(new Date(a.date + 'T' + a.time), 'MMM d, yyyy • hh:mm a')}</div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className={cn(
                                "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                                a.status === 'completed' ? "bg-green-500/10 text-green-600  border-green-500/20" : 
                                a.status === 'cancelled' ? "bg-red-500/10 text-red-600  border-red-500/20" :
                                "bg-muted/10 text-muted-foreground border-border"
                              )}>
                                {a.status}
                              </div>
                              {a.pointsProcessed && (
                                <div className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                  {a.willEarnPoints > 0 && `+${a.willEarnPoints} pts`}
                                  {a.pointsToRedeem > 0 && ` -${a.pointsToRedeem} pts`}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[20000] p-4 pt-[90px] sm:p-6 sm:pt-[90px] ">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-card rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-border flex flex-col max-h-[calc(100dvh-110px)] overflow-hidden"
          >
            <div className="p-6 sm:p-8 border-b bg-muted/5 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-primary font-black text-2xl sm:text-3xl tracking-tighter">
                  {editingAppointment ? 'Edit Appointment' : 'Book Appointment'}
                </h3>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                  {editingAppointment ? 'Update existing booking details' : 'Schedule a new customer visit'}
                </p>
              </div>
              <button 
                onClick={resetForm}
                className="p-3 hover:bg-muted/10 rounded-2xl transition-all text-muted-foreground hover:text-foreground active:scale-90"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (formStep === 1) {
                setFormStep(2);
              } else {
                editingAppointment ? handleUpdateAppointment(e) : handleAddAppointment(e);
              }
            }} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
              {formStep === 1 ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Customer Section */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                    <UserIcon size={14} className="text-primary" />
                    Customer Information
                  </label>
                  
                  {profile?.role !== 'customer' ? (
                    <div className="space-y-3">
                      <CustomSelect
                        value={selectedCustId}
                        onChange={(val) => {
                          setSelectedCustId(val);
                          if (val !== 'manual') {
                            const c = customers.find(c => c.id === val);
                            if (c) {
                              setManualCustName(c.name);
                              setManualCustPhone(c.phone);
                            }
                          }
                        }}
                        placeholder="Select Customer..."
                        options={[
                          { value: '', label: 'Select Customer...' },
                          { value: 'manual', label: 'New Customer (Manual Entry)' },
                          ...customers.map(c => ({ value: c.id, label: `${c.name} (${c.phone})` }))
                        ]}
                        icon={<Search size={18} />}
                        buttonClassName="w-full p-3 border border-border rounded-xl bg-input text-foreground shadow-inner font-bold text-sm"
                      />

                      {selectedCustId === 'manual' && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                          <FloatingInput
                            label="Customer Name"
                            value={manualCustName}
                            onChange={(val) => setManualCustName(val)}
                            required
                          />
                          <FloatingInput
                            label="Phone Number"
                            type="tel"
                            value={manualCustPhone}
                            onChange={(val) => setManualCustPhone(val)}
                            required
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 shadow-inner">
                      <div className="font-black text-foreground text-lg tracking-tight">{profile.name}</div>
                      <div className="text-xs text-muted-foreground font-bold mt-1 uppercase tracking-wider">{profile.phone || profile.email}</div>
                    </div>
                  )}
                </div>

                {/* Service & Staff Section */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                    <Briefcase size={14} className="text-primary" />
                    Service & Staff
                  </label>
                  
                  <div className="space-y-3">
                    <CustomSelect
                      value={selectedSvcId}
                      onChange={(val) => {
                        setSelectedSvcId(val);
                        if (val !== 'manual') {
                          const s = services.find(s => s.id === val);
                          if (s) setManualSvcName(s.name);
                        }
                      }}
                      placeholder="Select Service..."
                      options={[
                        { value: '', label: 'Select Service...' },
                        { value: 'manual', label: 'Other Service (Manual Entry)' },
                        ...services.map(s => ({ value: s.id, label: s.name }))
                      ]}
                      buttonClassName="w-full p-3 border border-border rounded-xl bg-input text-foreground shadow-inner font-bold text-sm"
                    />

                    {selectedSvcId === 'manual' && (
                      <FloatingInput
                        label="Service Name"
                        value={manualSvcName}
                        onChange={(val) => setManualSvcName(val)}
                        required
                      />
                    )}

                    <CustomSelect
                      value={selectedStaffEmail}
                      onChange={setSelectedStaffEmail}
                      placeholder="Any Staff (Auto-assign)"
                      options={[
                        { value: '', label: 'Any Staff (Auto-assign)' },
                        ...staff.filter(s => {
                          const [year, month, day] = (apptDate || getLocalISODate()).split('-');
                          const apptDateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                          const apptDayName = apptDateObj.toLocaleDateString('en-US', { weekday: 'long' });
                          return !s.workingDays || s.workingDays.includes(apptDayName);
                        }).map(s => ({ value: s.email, label: s.name }))
                      ]}
                      buttonClassName="w-full p-3 border border-border rounded-xl bg-input text-foreground shadow-inner font-bold text-sm"
                    />
                  </div>
                </div>

                {/* Date & Time Section */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                    <CalendarIcon size={14} className="text-primary" />
                    Schedule
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <CustomDatePicker 
                      label="DATE" 
                      value={apptDate} 
                      onChange={setApptDate} 
                      className="rounded-xl border-border shadow-inner"
                    />
                    <div className="relative group flex items-center gap-3 px-4 py-2 bg-input border border-border rounded-xl shadow-inner hover:border-primary/30 transition-all">
                      <Clock size={18} className="text-primary" />
                      <div className="flex flex-col flex-1">
                        <label className="text-[8px] text-muted-foreground font-black uppercase tracking-widest leading-none mb-1">TIME</label>
                        <span className="text-sm font-bold text-foreground">{apptTime}</span>
                      </div>
                      <input
                        type="time"
                        value={apptTime}
                        onChange={(e) => setApptTime(e.target.value)}
                        required
                        className="absolute inset-0 opacity-0 cursor-pointer w-full"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/5 rounded-2xl border border-border shadow-inner">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary/5 rounded-xl text-primary shadow-sm">
                        <HistoryIcon size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Duration</span>
                        <span className="text-xs text-foreground font-bold">Ends at {apptEndTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={apptDuration}
                        onChange={(e) => setApptDuration(parseInt(e.target.value) || 0)}
                        className="w-20 p-2 text-sm border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-input text-foreground shadow-inner font-black text-center"
                      />
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Mins</span>
                    </div>
                  </div>
                </div>

                {/* Status & Points Section */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                    <Star size={14} className="text-primary" />
                    Status & Rewards
                  </label>
                  
                  <div className="space-y-3">
                    {profile?.role !== 'customer' && (
                      <CustomSelect
                        value={apptStatus}
                        onChange={(val) => setApptStatus(val as any)}
                        options={[
                          { value: 'pending', label: 'Pending' },
                          { value: 'confirmed', label: 'Confirmed' },
                          { value: 'completed', label: 'Completed' },
                          { value: 'cancelled', label: 'Cancelled' }
                        ]}
                        buttonClassName="w-full p-3 border border-border rounded-xl bg-input text-foreground shadow-inner font-bold text-sm"
                      />
                    )}

                    <div className="flex items-center justify-between p-4 bg-green-500/5 rounded-2xl border border-green-500/10 shadow-inner">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-green-500/10 rounded-xl text-green-600 shadow-sm">
                          <Home size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Service Type</span>
                          <span className="text-xs font-bold text-foreground">At Home Service</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsHomeService(!isHomeService)}
                        className={cn(
                          "w-12 h-6 rounded-full transition-all relative shadow-inner",
                          isHomeService ? "bg-green-600" : "bg-muted"
                        )}
                      >
                        <div className={cn(
                          "absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-md",
                          isHomeService ? "left-6.5" : "left-0.5"
                        )} />
                      </button>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 space-y-3 shadow-inner">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Points to Earn</span>
                        <span className="text-sm font-black text-green-600">+{willEarnPoints} PTS</span>
                      </div>
                      
                      {selectedCustId && selectedCustId !== 'manual' && (
                        <div className="space-y-2 pt-3 border-t border-primary/10">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Available Points</span>
                            <span className="text-sm font-black text-primary">
                              {customers.find(c => c.id === selectedCustId)?.points || 0} PTS
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="Redeem Points"
                              value={pointsToRedeem}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                const max = customers.find(c => c.id === selectedCustId)?.points || 0;
                                setPointsToRedeem(Math.min(val, max));
                              }}
                              className="w-full p-2 text-xs border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-input text-foreground shadow-inner font-bold"
                            />
                            <button 
                              type="button"
                              onClick={() => setPointsToRedeem(customers.find(c => c.id === selectedCustId)?.points || 0)}
                              className="text-[9px] font-black text-primary hover:underline whitespace-nowrap uppercase tracking-widest"
                            >
                              Redeem All
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                    <FileText size={14} className="text-primary" />
                    Additional Notes
                  </label>
                  <textarea
                    placeholder="Any special requests or details..."
                    value={apptNotes}
                    onChange={(e) => setApptNotes(e.target.value)}
                    className="w-full p-4 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 bg-input text-foreground shadow-inner font-medium min-h-[100px] text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 space-y-6 shadow-inner">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-sm border border-border">
                      <Check size={32} strokeWidth={3} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-primary tracking-tighter">
                        Booking Confirmation
                      </h3>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Review your appointment details</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        <UserIcon size={12} className="text-primary" />
                        Customer
                      </div>
                      <div className="bg-card/50 p-4 rounded-xl border border-border shadow-sm">
                        <p className="font-black text-foreground text-xl tracking-tight leading-none">{manualCustName || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground font-bold mt-1.5 flex items-center gap-1.5">
                          <Phone size={12} />
                          {manualCustPhone || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        <Briefcase size={12} className="text-primary" />
                        Service
                      </div>
                      <div className="bg-card/50 p-4 rounded-xl border border-border shadow-sm">
                        <p className="font-black text-foreground text-xl tracking-tight leading-none">{manualSvcName || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground font-bold mt-1.5 flex items-center gap-1.5">
                          <HistoryIcon size={12} />
                          {apptDuration} mins ({apptTime} - {apptEndTime})
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        <UserIcon size={12} className="text-primary" />
                        Staff Member
                      </div>
                      <div className="bg-card/50 p-4 rounded-xl border border-border shadow-sm">
                        <p className="font-black text-foreground text-lg tracking-tight">
                          {staff.find(s => s.email === selectedStaffEmail)?.name || 'Any Staff (Auto)'}
                        </p>
                        <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">Professional Stylist</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        <CalendarIcon size={12} className="text-primary" />
                        Scheduled Date
                      </div>
                      <div className="bg-card/50 p-4 rounded-xl border border-border shadow-sm">
                        <p className="font-black text-foreground text-lg tracking-tight">{format(new Date(apptDate), 'EEEE, MMMM d, yyyy')}</p>
                        <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">Mark your calendar</p>
                      </div>
                    </div>

                    {isHomeService && (
                      <div className="col-span-full bg-green-500/10 p-4 rounded-2xl border border-green-500/20 flex items-center gap-4 shadow-sm">
                        <div className="p-3 bg-green-600 text-foreground rounded-xl shadow-lg">
                          <Car size={20} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Service Location</span>
                          <span className="text-sm font-black text-foreground">At Home Service Requested</span>
                        </div>
                      </div>
                    )}

                    {apptNotes && (
                      <div className="col-span-full space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                          <FileText size={12} className="text-primary" />
                          Additional Notes
                        </div>
                        <div className="bg-card/50 p-4 rounded-xl border border-border shadow-sm italic text-muted-foreground font-medium text-xs">
                          "{apptNotes}"
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            </div>

            <div className="p-6 bg-muted/5 border-t border-border flex justify-end gap-3 rounded-b-3xl shrink-0">
              {formStep === 1 ? (
                <>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2.5 text-xs font-black text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2.5 bg-primary text-primary-foreground rounded-xl font-black text-xs hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 flex items-center gap-2 uppercase tracking-widest"
                  >
                    Next Step
                    <ArrowRight size={14} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setFormStep(1)}
                    className="px-6 py-2.5 text-xs font-black text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingAppt}
                    className="px-8 py-2.5 bg-primary text-primary-foreground rounded-xl font-black text-xs hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 flex items-center gap-2 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingAppt ? (
                      <>
                        Processing...
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </>
                    ) : (
                      <>
                        {editingAppointment ? 'Update Appointment' : 'Confirm Booking'}
                        <Check size={14} />
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
            </form>
          </motion.div>
        </div>
      )}

      {confirmDeleteAppt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[20000] p-4 pt-[90px] sm:p-6 sm:pt-[90px] ">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-card rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-border max-h-[calc(100dvh-110px)] overflow-y-auto"
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600 mb-6 mx-auto shadow-inner border border-red-500/20">
              <Trash2 size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-4 tracking-tighter text-center">Confirm Deletion</h3>
            <p className="text-muted-foreground font-bold mb-8 leading-relaxed text-center">
              Are you sure you want to delete the appointment for <span className="text-foreground font-black">{confirmDeleteAppt.customerName}</span> at <span className="text-foreground font-black">{confirmDeleteAppt.time}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmDeleteAppt(null)}
                className="flex-1 px-6 py-4 border-2 border-border text-muted-foreground font-black uppercase tracking-widest rounded-2xl hover:bg-muted/10 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAppointment}
                className="flex-1 px-6 py-4 bg-red-600 text-foreground font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Overlap Alert Popup */}
      {showOverlapPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[20000] p-4 pt-[90px] sm:p-6 sm:pt-[90px] ">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-card rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-border max-h-[calc(100dvh-110px)] overflow-y-auto"
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600 mb-6 mx-auto shadow-inner border border-red-500/20">
              <AlertCircle size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-4 tracking-tighter text-center">Time Slot Overlap</h3>
            <p className="text-muted-foreground font-bold mb-8 leading-relaxed text-center">
              The selected time slot overlaps with an existing appointment for this staff member. Please select a different time or staff member.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowOverlapPopup(false)}
                className="w-full px-6 py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95"
              >
                Okay
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const PrintPreviewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  text: string;
  onPrint: () => void;
  onSkipPrint?: () => void;
  title?: string;
  printLabel?: string;
  skipLabel?: string;
}> = ({ isOpen, onClose, text, onPrint, onSkipPrint, title = "Print Preview", printLabel = "Process & Print", skipLabel = "Complete Without Printing" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[30000] flex items-center justify-center p-4 bg-black/60 ">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card w-full max-w-md rounded-[2rem] shadow-2xl border border-border flex flex-col overflow-hidden max-h-[calc(100dvh-40px)]"
      >
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10 shrink-0">
          <h3 className="font-bold text-lg tracking-tight flex items-center gap-2">
            <Printer size={20} className="text-primary" />
            {title}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto bg-muted/20 flex-1 flex justify-center custom-scrollbar">
          <div className="bg-white text-black p-6 shadow-md shadow-black/5" style={{ minWidth: '320px' }}>
            <pre className="font-mono text-[12px] leading-[1.4] whitespace-pre-wrap font-medium">
              {text}
            </pre>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-card shrink-0 space-y-3">
          <button
            onClick={() => { onPrint(); onClose(); }}
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <Printer size={20} />
            {printLabel}
          </button>
          
          {onSkipPrint && (
            <button
              onClick={() => { onSkipPrint(); onClose(); }}
              className="w-full bg-muted text-muted-foreground hover:text-foreground py-4 rounded-2xl font-bold transition-colors"
            >
              {skipLabel}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}> = ({ isOpen, onClose, title, children, maxWidth = "max-w-sm" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60  z-[20000] flex items-center justify-center p-4 pt-[90px] sm:p-6 sm:pt-[90px]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={cn("bg-card w-full rounded-[2.5rem] border border-primary/30 p-8 space-y-8 shadow-2xl relative overflow-y-auto max-h-[calc(100dvh-110px)]", maxWidth)}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
        <div className="flex justify-between items-center">
          <h3 className="text-primary font-bold text-xl uppercase tracking-widest">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1"><X size={24} /></button>
        </div>
        <div className="space-y-4">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export const ManagePage: React.FC = () => {
  const { user, profile, isAdmin, isSuperAdmin, isCashier, loading } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'shop' | 'categories' | 'services' | 'staff' | 'customers'>('shop');
  const [shopSettings, setShopSettings] = useState<ShopSettings>({ name: '', addr: '', ph: '', receiptHeader: '', receiptFooter: '' });
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [staff, setStaff] = useState<UserProfile[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [editingStaff, setEditingStaff] = useState<UserProfile | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [quickEditingPoints, setQuickEditingPoints] = useState<Customer | null>(null);
  const [quickPointsValue, setQuickPointsValue] = useState('');
  const [viewingCustomerHistory, setViewingCustomerHistory] = useState<Customer | null>(null);
  const [showConfirm, setShowConfirm] = useState<{ coll: string, id: string } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showSvcForm, setShowSvcForm] = useState(false);
  const [showStfForm, setShowStfForm] = useState(false);
  const [showCustForm, setShowCustForm] = useState(false);
  const [showCatForm, setShowCatForm] = useState(false);
  const [showShopForm, setShowShopForm] = useState(false);
  
  // Theme state
  const [localTheme, setLocalTheme] = useState(localStorage.getItem('luxury-theme') || 'gold');

  // Form states
  const [svcName, setSvcName] = useState('');
  const [svcPrice, setSvcPrice] = useState('');
  const [svcDuration, setSvcDuration] = useState('');
  const [svcCategory, setSvcCategory] = useState('');
  const [svcAllowCommission, setSvcAllowCommission] = useState(true);
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('LayoutGrid');
  const [stfName, setStfName] = useState('');
  const [stfEmail, setStfEmail] = useState('');
  const [stfComm, setStfComm] = useState('');
  const [stfRole, setStfRole] = useState<'super_admin' | 'owner' | 'cashier' | 'staff' | 'customer'>('staff');
  const [stfRoles, setStfRoles] = useState<string[]>(['staff']);
  const [stfStatus, setStfStatus] = useState<'active' | 'inactive' | 'on_leave' | 'deleted'>('active');
  const [stfBio, setStfBio] = useState('');
  const [stfSpecialties, setStfSpecialties] = useState<string[]>([]);
  const [stfWorkingDays, setStfWorkingDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
  const [stfPhotoURL, setStfPhotoURL] = useState('');
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custAddr, setCustAddr] = useState('');
  const [custNotes, setCustNotes] = useState('');
  const [custPoints, setCustPoints] = useState('');
  const [showAccessMatrix, setShowAccessMatrix] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    
    const unsubSettings = onSnapshot(doc(db, 'settings', 'salon'), (docSnap) => {
      if (docSnap.exists()) setShopSettings(docSnap.data() as ShopSettings);
    });

    const unsubServices = onSnapshot(query(collection(db, 'services'), orderBy('name')), (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'services'));

    const unsubCategories = onSnapshot(query(collection(db, 'categories'), orderBy('name')), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'categories'));

    const unsubStaff = onSnapshot(collection(db, 'users'), (snapshot) => {
      // Use a Map to ensure unique emails in the UI list
      const uniqueStaff = new Map<string, UserProfile>();
      snapshot.docs.forEach(doc => {
        const data = doc.data() as UserProfile;
        // Client-side filtering: Hide super_admin and customers from the staff list
        // EXCLUDE the Super Admin emails from appearing in any UI list
        const superAdminEmails = ['aungsoe366@gmail.com'];
        const isExcluded = data.role === 'super_admin' || 
                          data.role === 'customer' || 
                          (data.email && superAdminEmails.includes(data.email.toLowerCase().trim()));
        if (data.email && data.status !== 'deleted' && !isExcluded) {
          const email = data.email.toLowerCase().trim();
          // Prefer documents that have a UID (already logged in)
          if (!uniqueStaff.has(email) || data.uid) {
            uniqueStaff.set(email, { ...data, id: doc.id });
          }
        }
      });
      setStaff(Array.from(uniqueStaff.values()));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));

    const unsubCustomers = onSnapshot(query(collection(db, 'customers'), orderBy('name')), (snapshot) => {
      setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'customers'));

    const unsubSales = onSnapshot(query(collection(db, 'sales'), orderBy('dateTime', 'desc')), (snapshot) => {
      setSales(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'sales'));

    return () => { 
      unsubSettings(); 
      unsubServices(); 
      unsubCategories(); 
      unsubStaff(); 
      unsubCustomers();
      unsubSales();
    };
  }, [profile]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
    if (location.state?.viewCustomer) {
      setViewingCustomerHistory(location.state.viewCustomer);
    }
  }, [location.state]);

  const handleUpdateShop = async () => {
    try {
      await setDoc(doc(db, 'settings', 'salon'), shopSettings);
      setShowShopForm(false);
      setStatusMsg({ type: 'success', text: "Shop settings updated!" });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/salon');
    }
  };

  const handleAddService = async () => {
    if (!svcName || !svcPrice) return;
    try {
      await addDoc(collection(db, 'services'), { 
        name: svcName, 
        price: Number(svcPrice),
        duration: Number(svcDuration) || 30,
        category: svcCategory || 'General',
        allowCommission: svcAllowCommission
      });
      setSvcName(''); setSvcPrice(''); setSvcDuration(''); setSvcCategory(''); setSvcAllowCommission(true);
      setShowSvcForm(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'services');
    }
  };

  const handleUpdateService = async () => {
    if (!editingService || !svcName || !svcPrice) return;
    try {
      await updateDoc(doc(db, 'services', editingService.id), {
        name: svcName,
        price: Number(svcPrice),
        duration: Number(svcDuration) || 30,
        category: svcCategory || 'General',
        allowCommission: svcAllowCommission
      });
      setEditingService(null);
      setSvcName(''); setSvcPrice(''); setSvcDuration(''); setSvcCategory(''); setSvcAllowCommission(true);
      setShowSvcForm(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `services/${editingService.id}`);
    }
  };

  const handleAddCategory = async () => {
    if (!catName) return;
    try {
      await addDoc(collection(db, 'categories'), { 
        name: catName.trim(),
        icon: catIcon
      });
      setCatName('');
      setCatIcon('LayoutGrid');
      setShowCatForm(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'categories');
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !catName) return;
    try {
      await updateDoc(doc(db, 'categories', editingCategory.id), { 
        name: catName.trim(),
        icon: catIcon
      });
      setEditingCategory(null);
      setCatName('');
      setCatIcon('LayoutGrid');
      setShowCatForm(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `categories/${editingCategory.id}`);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (coll: string, id: string) => {
    if (loading || isDeleting) return;
    setIsDeleting(true);
    
    // Only admins can delete
    if (!isAdmin) {
      setStatusMsg({ type: 'error', text: "Unauthorized: You do not have permission to delete." });
      setIsDeleting(false);
      setShowConfirm(null);
      return;
    }

    // Special protection for users collection
    if (coll === 'users') {
      const targetUser = staff.find(s => (s.id || s.email) === id);
      const targetEmail = (targetUser?.email || id).toLowerCase();
      const currentUserEmail = user?.email?.toLowerCase();

      // 1. Prevent self-deletion
      if (targetEmail === currentUserEmail) {
        setStatusMsg({ type: 'error', text: "Unauthorized: You cannot delete your own account." });
        setIsDeleting(false);
        setShowConfirm(null);
        return;
      }

      // 2. Role-based protection
      // Only master can delete super_admins
      if (targetUser?.role === 'super_admin' && currentUserEmail !== 'aungsoe366@gmail.com') {
        setStatusMsg({ type: 'error', text: "Unauthorized: Only the master account can delete Super Admin accounts." });
        setIsDeleting(false);
        setShowConfirm(null);
        return;
      }

      // Owners can be deleted by Super Admins (including master)
      // But regular Owners cannot delete other Owners
      if (targetUser?.role === 'owner' && !isSuperAdmin) {
        setStatusMsg({ type: 'error', text: "Unauthorized: Only Super Admins can delete Owner accounts." });
        setIsDeleting(false);
        setShowConfirm(null);
        return;
      }
    }

    try {
      if (coll === 'users') {
        try {
          const functions = getFunctions(app, 'asia-southeast1');
          const deleteUserAccount = httpsCallable(functions, 'deleteUserAccount');
          await deleteUserAccount({ targetEmail: id });
        } catch (err) {
          console.warn("Cloud function failed, fallback to direct deletion. Auth deletion will require deployed functions.", err);
          try {
            await deleteDoc(doc(db, coll, id));
          } catch(err2) {
            handleFirestoreError(err2, OperationType.DELETE, `users/${id}`);
          }
        }
      } else {
        try {
          await deleteDoc(doc(db, coll, id));
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `${coll}/${id}`);
        }
      }
      setShowConfirm(null);
      setStatusMsg({ type: 'success', text: `Successfully deleted from ${coll}.` });
    } catch (error: any) {
      console.error('Delete error:', error);
      let errorText = "Failed to delete. Please try again.";
      
      if (error.code === 'permission-denied') {
        errorText = "Unauthorized: You do not have permission to delete this item.";
      } else if (error.message) {
        // Try to parse JSON error from handleFirestoreError if it was already wrapped
        try {
          const parsed = JSON.parse(error.message);
          if (parsed.error) errorText = `Error: ${parsed.error}`;
        } catch (e) {
          errorText = `Error: ${error.message}`;
        }
      }
      
      setStatusMsg({ type: 'error', text: errorText });
      setShowConfirm(null); // Close the modal even on error so they can see the message
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetupSuperAdmin = async () => {
    if (!user?.email) return;
    const superAdminEmails = ['aungsoe366@gmail.com'];
    if (superAdminEmails.includes(user.email.toLowerCase())) {
      try {
        const docRef = doc(db, 'users', user.email.toLowerCase());
        await setDoc(docRef, { role: 'super_admin', status: 'active' }, { merge: true });
        setStatusMsg({ type: 'success', text: "Super Admin role assigned successfully!" });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.email}`);
      }
    }
  };

  const addAuditLog = async (action: string, resource: string, details: any) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'audit_logs'), {
        timestamp: new Date().toISOString(),
        userId: user.uid,
        userEmail: user.email,
        action,
        resource,
        details
      });
    } catch (err) {
      console.error("Audit log error:", err);
    }
  };

  const handleAddStaff = async () => {
    if (loading) return;
    if (!stfName || !stfEmail || !stfComm) {
      setStatusMsg({ type: 'error', text: 'Please fill in all required fields (Name, Email, Commission).' });
      return;
    }
    
    // Only admins can add staff
    if (!isAdmin) {
      setStatusMsg({ type: 'error', text: "Unauthorized: You do not have permission to add staff." });
      return;
    }

    const commissionVal = Number(stfComm);
    
    // Only master account can create super_admin or owner
    if (user?.email?.toLowerCase() !== 'aungsoe366@gmail.com' && (stfRole === 'super_admin' || stfRole === 'owner')) {
      setStatusMsg({ type: 'error', text: "Unauthorized: Only the master account can assign Admin or Owner roles." });
      return;
    }

    const now = new Date().toISOString();
    const userData = {
      name: stfName,
      email: stfEmail.toLowerCase().trim(),
      role: stfRole,
      roles: stfRoles,
      commission: isNaN(commissionVal) ? 0 : commissionVal,
      status: stfStatus,
      bio: stfBio,
      photoURL: stfPhotoURL,
      specialties: stfSpecialties,
      workingDays: stfWorkingDays,
      createdAt: now,
      updatedAt: now
    };

    console.log('Registering user...', userData);

    try {
      const email = userData.email;
      await setDoc(doc(db, 'users', email), userData, { merge: true });
      
      await addAuditLog('CREATE_STAFF', `users/${email}`, { role: stfRole, name: stfName });
      
      setStfName(''); setStfEmail(''); setStfComm(''); setStfRole('staff'); setStfRoles(['staff']);
      setStfStatus('active'); setStfBio(''); setStfPhotoURL(''); setStfSpecialties([]);
      setStfWorkingDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
      setShowStfForm(false);
      setStatusMsg({ type: 'success', text: "Staff registered successfully!" });
    } catch (error) {
      console.error('Error details:', error);
      handleFirestoreError(error, OperationType.CREATE, `users/${stfEmail.toLowerCase().trim()}`);
    }
  };

  const handleUpdateStaff = async () => {
    if (loading) return;
    if (!editingStaff) return;
    if (!stfName || !stfEmail || !stfComm) {
      setStatusMsg({ type: 'error', text: 'Please fill in all required fields (Name, Email, Commission).' });
      return;
    }
    
    // Only admins can update staff
    if (!isAdmin) {
      setStatusMsg({ type: 'error', text: "Unauthorized: You do not have permission to update staff." });
      return;
    }

    // Only master account can update super_admin or owner accounts
    if (user?.email?.toLowerCase() !== 'aungsoe366@gmail.com' && (editingStaff.role === 'super_admin' || editingStaff.role === 'owner' || stfRole === 'super_admin' || stfRole === 'owner')) {
      setStatusMsg({ type: 'error', text: "Unauthorized: Only the master account can modify Admin or Owner accounts." });
      return;
    }

    const now = new Date().toISOString();
    const newEmail = stfEmail.toLowerCase().trim();
    const commissionVal = Number(stfComm);
    const userData = {
      ...editingStaff,
      name: stfName,
      email: newEmail,
      role: stfRole,
      roles: stfRoles,
      commission: isNaN(commissionVal) ? 0 : commissionVal,
      status: stfStatus,
      bio: stfBio,
      photoURL: stfPhotoURL,
      specialties: stfSpecialties,
      workingDays: stfWorkingDays,
      updatedAt: now
    };

    console.log('Updating user...', userData);

    try {
      if (newEmail !== editingStaff.email) {
        // If email changed, we must move the document because email is the ID
        await deleteDoc(doc(db, 'users', editingStaff.email));
      }
      await setDoc(doc(db, 'users', newEmail), userData, { merge: true });
      
      await addAuditLog('UPDATE_STAFF', `users/${newEmail}`, { 
        oldRole: editingStaff.role, 
        newRole: stfRole,
        oldName: editingStaff.name,
        newName: stfName,
        emailChanged: newEmail !== editingStaff.email
      });
      
      setEditingStaff(null);
      setStfName(''); setStfEmail(''); setStfComm(''); setStfRole('staff'); setStfRoles(['staff']);
      setStfStatus('active'); setStfBio(''); setStfPhotoURL(''); setStfSpecialties([]);
      setStfWorkingDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
      setShowStfForm(false);
      setStatusMsg({ type: 'success', text: "Staff updated successfully!" });
    } catch (error) {
      console.error('Error details:', error);
      handleFirestoreError(error, OperationType.UPDATE, `users/${editingStaff.email}`);
    }
  };

  const handleAddCustomer = async () => {
    if (!custName || !custPhone) {
      setStatusMsg({ type: 'error', text: 'Name and Phone are required.' });
      return;
    }

    // Basic phone validation: digits, spaces, plus, hyphens, parentheses, 7-20 chars
    const phoneRegex = /^[0-9+\-() ]{7,20}$/;
    if (!phoneRegex.test(custPhone.trim())) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid phone number.' });
      return;
    }

    // Basic email validation if provided
    if (custEmail && custEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(custEmail.trim())) {
        setStatusMsg({ type: 'error', text: 'Please enter a valid email address.' });
        return;
      }
    }

    try {
      await addDoc(collection(db, 'customers'), {
        name: custName.trim(),
        phone: custPhone.trim(),
        email: custEmail.trim().toLowerCase(),
        address: custAddr.trim(),
        notes: custNotes.trim(),
        points: 0,
        createdAt: new Date().toISOString()
      });
      setCustName(''); setCustPhone(''); setCustEmail(''); setCustAddr(''); setCustNotes('');
      setShowCustForm(false);
      setStatusMsg({ type: 'success', text: 'Customer added successfully!' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'customers');
    }
  };

  const handleUpdateCustomer = async () => {
    if (!editingCustomer || !custName || !custPhone) {
      setStatusMsg({ type: 'error', text: 'Name and Phone are required.' });
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[0-9+\-() ]{7,20}$/;
    if (!phoneRegex.test(custPhone.trim())) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid phone number.' });
      return;
    }

    // Basic email validation if provided
    if (custEmail && custEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(custEmail.trim())) {
        setStatusMsg({ type: 'error', text: 'Please enter a valid email address.' });
        return;
      }
    }

    const pts = Number(custPoints);
    if (isNaN(pts) || pts < 0 || !Number.isInteger(pts)) {
      setStatusMsg({ type: 'error', text: 'Points must be a non-negative integer.' });
      return;
    }

    try {
      await updateDoc(doc(db, 'customers', editingCustomer.id), {
        name: custName.trim(),
        phone: custPhone.trim(),
        email: custEmail.trim().toLowerCase(),
        address: custAddr.trim(),
        notes: custNotes.trim(),
        points: pts
      });
      
      // Update user profile points if email is present
      const targetEmail = custEmail.trim() ? custEmail.trim().toLowerCase() : editingCustomer.email;
      if (targetEmail) {
        const userDocRef = doc(db, 'users', targetEmail.toLowerCase());
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
           await updateDoc(userDocRef, { points: pts });
        }
      }

      setEditingCustomer(null);
      setCustName(''); setCustPhone(''); setCustEmail(''); setCustAddr(''); setCustNotes(''); setCustPoints('');
      setStatusMsg({ type: 'success', text: 'Customer updated successfully!' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `customers/${editingCustomer.id}`);
    }
  };

  const handleQuickUpdatePoints = async () => {
    if (!quickEditingPoints) return;
    const pts = Number(quickPointsValue);
    if (isNaN(pts) || pts < 0 || !Number.isInteger(pts)) {
      setStatusMsg({ type: 'error', text: 'Points must be a non-negative integer.' });
      return;
    }
    try {
      await updateDoc(doc(db, 'customers', quickEditingPoints.id), {
        points: pts
      });
      
      // Update user profile points if email is present
      if (quickEditingPoints.email) {
        const userDocRef = doc(db, 'users', quickEditingPoints.email.toLowerCase());
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
           await updateDoc(userDocRef, { points: pts });
        }
      }

      setQuickEditingPoints(null);
      setQuickPointsValue('');
      setStatusMsg({ type: 'success', text: 'Points updated successfully!' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `customers/${quickEditingPoints.id}`);
    }
  };

  const handleClearHistory = async () => {
    setIsClearing(true);
    try {
      const snapshot = await getDocs(collection(db, 'sales'));
      const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletePromises);
      setShowClearConfirm(false);
      setStatusMsg({ type: 'success', text: "All sales history has been cleared." });
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'sales/*');
    } finally {
      setIsClearing(false);
    }
  };

  if (!isAdmin && !isCashier) return <Navigate to="/" />;

  return (
    <div className="p-4 space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {[
          { id: 'shop', label: 'Shop', icon: <Store size={16} /> },
          { id: 'categories', label: 'Categories', icon: <Menu size={16} /> },
          { id: 'services', label: 'Services', icon: <Briefcase size={16} /> },
          { id: 'staff', label: 'Staff', icon: <UserIcon size={16} /> },
          { id: 'customers', label: 'Customers', icon: <UsersIcon size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
              activeTab === tab.id 
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                : "bg-card text-muted-foreground border-border hover:border-primary/50"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 space-y-8 shadow-xl transition-all duration-300">
        {activeTab === 'shop' && (
          <div className="space-y-8">
            {isSuperAdmin && profile?.role !== 'super_admin' && (
              <div className="bg-primary/10 p-6 rounded-[2rem] border border-border flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-primary font-black text-sm uppercase tracking-widest">First Time Setup</h4>
                  <p className="text-[10px] text-muted-foreground font-bold mt-1">Assign your account the Super Admin role in Firestore.</p>
                </div>
                <button 
                  onClick={handleSetupSuperAdmin}
                  className="btn-primary px-6 py-3 text-[10px] rounded-xl font-black tracking-widest"
                >
                  SETUP ROLE
                </button>
              </div>
            )}
            <div className="flex items-center justify-between px-1">
              <h4 className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                Shop Settings
              </h4>
            </div>
            
            <div className="space-y-4">
              <FloatingInput 
                label="Shop Name"
                value={shopSettings.name}
                onChange={(val) => setShopSettings({ ...shopSettings, name: val })}
                onFocusClear
              />
              <FloatingInput 
                label="Address"
                value={shopSettings.addr}
                onChange={(val) => setShopSettings({ ...shopSettings, addr: val })}
                onFocusClear
              />
              <FloatingInput 
                label="Phone"
                value={shopSettings.ph}
                onChange={(val) => setShopSettings({ ...shopSettings, ph: val })}
                onFocusClear
              />
              <FloatingInput 
                label="Receipt Header"
                value={shopSettings.receiptHeader || ''}
                onChange={(val) => setShopSettings({ ...shopSettings, receiptHeader: val })}
                onFocusClear
              />
              <FloatingInput 
                label="Receipt Footer"
                value={shopSettings.receiptFooter || ''}
                onChange={(val) => setShopSettings({ ...shopSettings, receiptFooter: val })}
                onFocusClear
              />

              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Palette size={14} className="text-primary" /> Local Preferences
                </h4>
                
                <div className="flex flex-col gap-3 p-4 bg-background rounded-2xl border border-border">
                  <div>
                    <span className="block text-sm font-bold text-foreground">App Theme Color</span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Select a luxury color palette for this device</span>
                  </div>
                  
                  <div className="flex gap-4 mt-2">
                    <button 
                      onClick={() => { 
                        setLocalTheme('gold');
                        window.dispatchEvent(new CustomEvent('theme:change', { detail: 'gold' })); 
                      }}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className={cn("w-12 h-12 rounded-full border-4 transition-all duration-300", localTheme === 'gold' ? "border-[#d4af37] scale-110" : "border-transparent scale-100 hover:scale-105")} style={{ backgroundColor: '#d4af37' }} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Gold</span>
                    </button>
                    
                    <button 
                      onClick={() => { 
                        setLocalTheme('rose-gold');
                        window.dispatchEvent(new CustomEvent('theme:change', { detail: 'rose-gold' })); 
                      }}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className={cn("w-12 h-12 rounded-full border-4 transition-all duration-300", localTheme === 'rose-gold' ? "border-[#b76e79] scale-110" : "border-transparent scale-100 hover:scale-105")} style={{ backgroundColor: '#b76e79' }} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Rose</span>
                    </button>
                    
                    <button 
                      onClick={() => { 
                        setLocalTheme('midnight-blue');
                        window.dispatchEvent(new CustomEvent('theme:change', { detail: 'midnight-blue' })); 
                      }}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className={cn("w-12 h-12 rounded-full border-4 transition-all duration-300", localTheme === 'midnight-blue' ? "border-[#192a56] scale-110" : "border-transparent scale-100 hover:scale-105")} style={{ backgroundColor: '#192a56' }} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Midnight</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Printer size={14} className="text-primary" /> Receipt Settings
                </h4>
                
                <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border">
                  <div>
                    <span className="block text-sm font-bold text-foreground">Hide Shop Name</span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Do not print shop name on receipts</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShopSettings({ ...shopSettings, hideShopNameOnReceipt: !shopSettings.hideShopNameOnReceipt })}
                    className={cn(
                      "w-12 h-6 rounded-full p-1 transition-all duration-300 relative",
                      shopSettings.hideShopNameOnReceipt ? "bg-primary" : "bg-muted/30"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300",
                      shopSettings.hideShopNameOnReceipt ? "translate-x-6" : "translate-x-0"
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border">
                  <div>
                    <span className="block text-sm font-bold text-foreground">Hide Date & Time</span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Do not print date and time on receipts</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShopSettings({ ...shopSettings, hideDateTimeOnReceipt: !shopSettings.hideDateTimeOnReceipt })}
                    className={cn(
                      "w-12 h-6 rounded-full p-1 transition-all duration-300 relative",
                      shopSettings.hideDateTimeOnReceipt ? "bg-primary" : "bg-muted/30"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300",
                      shopSettings.hideDateTimeOnReceipt ? "translate-x-6" : "translate-x-0"
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border">
                  <div>
                    <span className="block text-sm font-bold text-foreground">Hide Staff Name</span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Do not print staff name on receipts</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShopSettings({ ...shopSettings, hideStaffNameOnReceipt: !shopSettings.hideStaffNameOnReceipt })}
                    className={cn(
                      "w-12 h-6 rounded-full p-1 transition-all duration-300 relative",
                      shopSettings.hideStaffNameOnReceipt ? "bg-primary" : "bg-muted/30"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300",
                      shopSettings.hideStaffNameOnReceipt ? "translate-x-6" : "translate-x-0"
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border">
                  <div>
                    <span className="block text-sm font-bold text-foreground">Hide Loyalty Points</span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Do not print points on receipts</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShopSettings({ ...shopSettings, hideLoyaltyPointsOnReceipt: !shopSettings.hideLoyaltyPointsOnReceipt })}
                    className={cn(
                      "w-12 h-6 rounded-full p-1 transition-all duration-300 relative",
                      shopSettings.hideLoyaltyPointsOnReceipt ? "bg-primary" : "bg-muted/30"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300",
                      shopSettings.hideLoyaltyPointsOnReceipt ? "translate-x-6" : "translate-x-0"
                    )} />
                  </button>
                </div>
              </div>

              <button onClick={handleUpdateShop} className="btn-primary w-full py-4 mt-2 uppercase tracking-widest font-black">Save Settings</button>
            </div>

            {isSuperAdmin && (
              <div className="pt-8 border-t border-border space-y-4">
                <h4 className="text-red-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-red-500 rounded-full"></div>
                  Danger Zone
                </h4>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Use these options with extreme caution. Actions are irreversible.</p>
                <button 
                  onClick={() => setShowClearConfirm(true)}
                  className="w-full bg-red-500/10 text-red-500 border border-red-500/20 font-bold py-4 rounded-2xl hover:bg-red-500 hover:text-foreground transition-all active:scale-95"
                >
                  CLEAR ALL SALES HISTORY
                </button>

                <div className="pt-6 border-t border-border space-y-4">
                  <h4 className="text-blue-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                    Debug & Diagnostics
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Test your Cloud Functions connectivity and database access.</p>
                  <button
                    onClick={async () => {
                      try {
                        const functions = getFunctions(app, 'asia-southeast1');
                        const pingFunctions = httpsCallable(functions, 'pingFunctions');
                        const result = await pingFunctions();
                        setStatusMsg({ type: 'success', text: `Functions Online: ${JSON.stringify(result.data)}` });
                      } catch (err) {
                        setStatusMsg({ type: 'error', text: `Functions Offline: ${err instanceof Error ? err.message : String(err)}` });
                      }
                    }}
                    className="w-full bg-blue-500/10 text-blue-500 border border-blue-500/20 font-bold py-4 rounded-2xl hover:bg-blue-500 hover:text-foreground transition-all active:scale-95 uppercase tracking-widest"
                  >
                    Test Cloud Functions
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                Category Management
              </h4>
              <button 
                onClick={() => setShowCatForm(!showCatForm)}
                className="btn-primary px-4 py-2 text-[10px] rounded-xl flex items-center gap-2"
              >
                {showCatForm ? <X size={14} /> : <Plus size={14} />}
                {showCatForm ? 'CANCEL' : 'ADD NEW'}
              </button>
            </div>

            <Modal 
              isOpen={showCatForm} 
              onClose={() => { setShowCatForm(false); setEditingCategory(null); setCatName(''); setCatIcon('LayoutGrid'); }} 
              title={editingCategory ? "Edit Category" : "Add New Category"}
            >
              <FloatingInput 
                label="Category Name"
                value={catName}
                onChange={setCatName}
                onFocusClear
              />
              
              <div className="space-y-3">
                <label className="text-[10px] text-muted-foreground font-black uppercase tracking-widest ml-1">Select Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {CATEGORY_ICONS.map((item) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setCatIcon(item.name)}
                        className={cn(
                          "p-3 rounded-xl border transition-all flex items-center justify-center",
                          catIcon === item.name 
                            ? "bg-primary border-primary text-foreground shadow-lg shadow-primary/20 scale-105" 
                            : "bg-background border-border text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        <IconComp size={20} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {editingCategory ? (
                <button onClick={handleUpdateCategory} className="w-full btn-primary py-4 mt-2 uppercase tracking-widest font-black">Update Category</button>
              ) : (
                <button onClick={handleAddCategory} className="w-full btn-primary py-4 mt-2 uppercase tracking-widest font-black">Add Category</button>
              )}
            </Modal>
            <div className="space-y-3 pt-4">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest px-1">Existing Categories</p>
              {categories.length === 0 ? (
                <div className="text-center py-8 bg-background/50 rounded-2xl border border-dashed border-border">
                  <p className="text-muted-foreground text-xs italic">No categories added yet.</p>
                </div>
              ) : (
                categories.map(c => {
                  const IconComp = CATEGORY_ICONS.find(i => i.name === c.icon)?.icon || LayoutGrid;
                  return (
                    <div key={c.id} className="flex justify-between items-center p-4 bg-background rounded-2xl border border-border group hover:border-primary/50 transition-all shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-foreground transition-all">
                          <IconComp size={16} />
                        </div>
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">{c.name}</span>
                      </div>
                      <div className="flex gap-2">
                        {isAdmin && (
                          <button 
                            onClick={() => { setEditingCategory(c); setCatName(c.name); setCatIcon(c.icon || 'LayoutGrid'); setShowCatForm(true); }} 
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Edit Category"
                          >
                            <Settings size={16} />
                          </button>
                        )}
                        {isAdmin && (
                          <button 
                            onClick={() => setShowConfirm({ coll: 'categories', id: c.id })} 
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                Services Management
              </h4>
              <button 
                onClick={() => setShowSvcForm(!showSvcForm)}
                className="btn-primary px-4 py-2 text-[10px] rounded-xl flex items-center gap-2"
              >
                {showSvcForm ? <X size={14} /> : <Plus size={14} />}
                {showSvcForm ? 'CANCEL' : 'ADD NEW'}
              </button>
            </div>

            <Modal 
              isOpen={showSvcForm} 
              onClose={() => { setShowSvcForm(false); setEditingService(null); setSvcName(''); setSvcPrice(''); setSvcDuration(''); setSvcCategory(''); setSvcAllowCommission(true); }} 
              title={editingService ? "Edit Service" : "Add New Service"}
            >
              <FloatingInput 
                label="Service Name"
                value={svcName}
                onChange={setSvcName}
                onFocusClear
              />
              <FloatingInput 
                label="Price (Ks)"
                type="number"
                value={svcPrice}
                onChange={setSvcPrice}
                onFocusClear
              />
              <FloatingInput 
                label="Duration (Minutes)"
                type="number"
                value={svcDuration}
                onChange={setSvcDuration}
                onFocusClear
              />
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest ml-1">Category</label>
                <CustomSelect
                  value={svcCategory}
                  onChange={setSvcCategory}
                  placeholder="Select Category"
                  options={[
                    { value: '', label: 'Select Category' },
                    ...categories.map(c => ({ value: c.name, label: c.name }))
                  ]}
                  buttonClassName="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:border-primary"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl mt-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground">Enable Staff Commission</span>
                  <span className="text-[10px] text-muted-foreground">Calculate commission for this service</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSvcAllowCommission(!svcAllowCommission)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    svcAllowCommission ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      svcAllowCommission ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {editingService ? (
                <button onClick={handleUpdateService} className="w-full btn-primary py-4 mt-2 uppercase tracking-widest font-black">Update Service</button>
              ) : (
                <button onClick={handleAddService} className="w-full btn-primary py-4 mt-2 uppercase tracking-widest font-black">Add Service</button>
              )}
            </Modal>
            <div className="space-y-3 pt-6">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest px-1">Service List</p>
              {services.length === 0 ? (
                <div className="text-center py-8 bg-background/50 rounded-2xl border border-dashed border-border">
                  <p className="text-muted-foreground text-xs italic">No services added yet.</p>
                </div>
              ) : (
                services.map(s => (
                  <div key={s.id} className="flex justify-between items-center p-4 bg-background rounded-2xl border border-border group hover:border-primary/50 transition-all shadow-sm">
                    <div>
                      <span className="font-bold text-foreground block group-hover:text-primary transition-colors">{s.name}</span>
                      <div className="flex gap-2 items-center mt-1">
                        <span className="text-xs text-muted-foreground font-medium">{s.price.toLocaleString()} Ks</span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">•</span>
                        <span className="text-xs text-muted-foreground font-medium">{s.duration || 30} mins</span>
                        <span className="bg-primary/10 text-primary text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{s.category || 'General'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isAdmin && (
                        <button 
                          onClick={() => { 
                            setEditingService(s); 
                            setSvcName(s.name); 
                            setSvcPrice(s.price.toString()); 
                            setSvcDuration(s.duration?.toString() || '30');
                            setSvcCategory(s.category || '');
                            setSvcAllowCommission(s.allowCommission !== false);
                            setShowSvcForm(true);
                          }} 
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit Service"
                        >
                          <Settings size={16} />
                        </button>
                      )}
                      {isAdmin && (
                        <button 
                          onClick={() => setShowConfirm({ coll: 'services', id: s.id })} 
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                Staff Management
              </h4>
              {isAdmin && (
                <button 
                  onClick={() => setShowStfForm(!showStfForm)}
                  className="btn-primary px-4 py-2 text-[10px] rounded-xl flex items-center gap-2"
                >
                  {showStfForm ? <X size={14} /> : <Plus size={14} />}
                  {showStfForm ? 'CANCEL' : 'ADD NEW'}
                </button>
              )}
            </div>

            <Modal 
              isOpen={showStfForm} 
              onClose={() => { 
                setShowStfForm(false); 
                setEditingStaff(null); 
                setStfName(''); setStfEmail(''); setStfComm(''); setStfRole('staff'); setStfRoles(['staff']);
                setStfStatus('active'); setStfBio(''); setStfPhotoURL(''); setStfSpecialties([]);
                setStfWorkingDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
              }} 
              title={editingStaff ? "Edit Staff" : "Register New Staff"}
              maxWidth="max-w-md"
            >
              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar pb-4">
                {/* Profile Photo Section */}
                <div className="flex flex-col items-center gap-3 pb-6 border-b border-border/50">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-background shadow-xl group-hover:border-border transition-all">
                      {stfPhotoURL ? (
                        <img src={stfPhotoURL} alt="Staff" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <UserIcon size={40} className="text-muted-foreground/30" />
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        const url = prompt("Enter photo URL:", stfPhotoURL);
                        if (url !== null) setStfPhotoURL(url);
                      }}
                      className="absolute bottom-0 right-0 p-2.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform"
                      title="Update Photo"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Profile Photo</span>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <UserIcon size={12} />
                    Basic Information
                  </h5>
                  <FloatingInput 
                    label="Staff Name"
                    value={stfName}
                    onChange={setStfName}
                    placeholder="e.g. John Doe"
                  />
                  <FloatingInput 
                    label="Email Address"
                    value={stfEmail}
                    onChange={setStfEmail}
                    type="email"
                    placeholder="e.g. john@example.com"
                  />
                </div>

                {/* Employment Details */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <Briefcase size={12} />
                    Employment Details
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <FloatingInput 
                      label="Commission %"
                      value={stfComm}
                      onChange={setStfComm}
                      type="number"
                      placeholder="e.g. 50"
                    />
                  <div className="space-y-3">
                    <label className="text-[10px] text-muted-foreground font-black uppercase tracking-widest ml-1">Assigned Roles</label>
                    <div className="flex flex-wrap gap-2 pb-4">
                       {['staff', 'cashier', 'owner', 'super_admin'].map(roleOption => (
                         <button 
                           key={roleOption}
                           type="button"
                           onClick={() => {
                              let newRoles;
                              if (stfRoles.includes(roleOption)) {
                                 newRoles = stfRoles.filter(r => r !== roleOption);
                                 if (newRoles.length === 0) newRoles = ['staff']; // ensure at least one role
                              } else {
                                 newRoles = [...stfRoles, roleOption];
                              }
                              setStfRoles(newRoles);
                              
                              const calculatedRole = newRoles.includes('super_admin') ? 'super_admin' :
                                                     newRoles.includes('owner') ? 'owner' :
                                                     newRoles.includes('cashier') ? 'cashier' : 'staff';
                              setStfRole(calculatedRole as any);
                           }}
                           className={`px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest transition-all ${
                             stfRoles.includes(roleOption) ? "bg-primary text-primary-foreground border-primary" : "bg-transparent border-border text-foreground hover:border-primary/50"
                           }`}
                         >
                           {roleOption.replace('_', ' ')}
                         </button>
                       ))}
                    </div>
                  </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Activity size={18} />
                    </div>
                    <CustomSelect
                      value={stfStatus}
                      onChange={(val) => setStfStatus(val as any)}
                      options={[
                        { value: 'active', label: '🟢 Active' },
                        { value: 'inactive', label: '🔴 Inactive' },
                        { value: 'on_leave', label: '🟡 On Leave' }
                      ]}
                      buttonClassName={cn(
                        "w-full bg-background border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold uppercase tracking-widest",
                        stfStatus === 'active' ? "border-green-500/30 text-green-500" :
                        stfStatus === 'on_leave' ? "border-yellow-500/30 text-yellow-500" :
                        "border-red-500/30 text-red-500"
                      )}
                    />
                  </div>
                </div>

                {/* Schedule & Capabilities */}
                <div className="space-y-5 pt-4 border-t border-border/50">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <CalendarHeart size={12} />
                    Schedule & Expertise
                  </h5>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Working Days</label>
                    <div className="flex flex-wrap gap-2 p-3 bg-muted/5 rounded-2xl border border-border/50">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <button
                          key={day}
                          onClick={() => {
                            if (stfWorkingDays.includes(day)) {
                              setStfWorkingDays(stfWorkingDays.filter(d => d !== day));
                            } else {
                              setStfWorkingDays([...stfWorkingDays, day]);
                            }
                          }}
                          className={cn(
                            "px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border flex-1 text-center min-w-[80px]",
                            stfWorkingDays.includes(day) 
                              ? "bg-primary/10 border-primary text-primary shadow-sm" 
                              : "bg-background border-border text-muted-foreground hover:border-primary/30"
                          )}
                        >
                          {day.substring(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Specialties</label>
                    <div className="flex flex-wrap gap-2 p-3 bg-muted/5 rounded-2xl border border-border/50 min-h-[60px]">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            if (stfSpecialties.includes(cat.name)) {
                              setStfSpecialties(stfSpecialties.filter(s => s !== cat.name));
                            } else {
                              setStfSpecialties([...stfSpecialties, cat.name]);
                            }
                          }}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                            stfSpecialties.includes(cat.name) 
                              ? "bg-secondary text-secondary-foreground border-secondary shadow-sm" 
                              : "bg-background border-border text-muted-foreground hover:border-secondary/30"
                          )}
                        >
                          {cat.name}
                        </button>
                      ))}
                      {categories.length === 0 && (
                        <p className="text-xs text-muted-foreground italic m-auto">No categories found. Please add categories first.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/50">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <FileText size={12} />
                    Additional Notes
                  </h5>
                  <textarea 
                    value={stfBio}
                    onChange={(e) => setStfBio(e.target.value)}
                    placeholder="Brief staff bio, performance notes, or internal remarks..."
                    className="w-full bg-background border border-border rounded-2xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px] text-sm resize-none"
                  />
                </div>

              </div>
              <div className="pt-4 border-t border-border mt-4">
                {editingStaff ? (
                  <button onClick={handleUpdateStaff} className="w-full btn-primary py-4 uppercase tracking-widest font-black shadow-lg">Update Staff Profile</button>
                ) : (
                  <button onClick={handleAddStaff} className="w-full btn-primary py-4 uppercase tracking-widest font-black shadow-lg">Register Staff Member</button>
                )}
              </div>
            </Modal>
            
            <div className="space-y-4 pt-2">
              <h4 className="text-primary font-bold uppercase tracking-widest text-xs px-1 flex items-center justify-between">
                <span>Registered Staff ({staff.length})</span>
                <UsersIcon size={14} />
              </h4>
              {staff.map(s => (
                <div key={s.email} className="bg-background p-5 rounded-2xl border border-border space-y-4 shadow-sm hover:border-primary/30 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-muted overflow-hidden border border-border">
                        {s.photoURL ? (
                          <img src={s.photoURL} alt={s.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                            {s.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="block font-bold text-primary text-lg leading-tight">{s.name}</span>
                        <span className="text-xs text-muted-foreground font-medium">{s.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Edit Button Logic: Owners are uneditable except by master account */}
                      {(isAdmin && s.role !== 'owner' && s.role !== 'super_admin') || (user?.email?.toLowerCase() === 'aungsoe366@gmail.com') ? (
                        <button 
                          onClick={() => {
                            setEditingStaff(s);
                            setStfName(s.name);
                            setStfEmail(s.email);
                            setStfComm(s.commission.toString());
                            setStfRole(s.role);
                            setStfRoles(s.roles || [s.role]);
                            setStfStatus(s.status || 'active');
                            setStfBio(s.bio || '');
                            setStfPhotoURL(s.photoURL || '');
                            setStfSpecialties(s.specialties || []);
                            setStfWorkingDays(s.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
                            setShowStfForm(true);
                          }}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit Staff"
                        >
                          <Settings size={18} />
                        </button>
                      ) : null}
                      
                      {/* Delete Button Logic: Owners are undeletable easily */}
                      {isAdmin && s.email !== user?.email && s.role !== 'owner' && s.role !== 'super_admin' && (
                        <button 
                          onClick={() => setShowConfirm({ coll: 'users', id: s.id || s.email })} 
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete Staff"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  {s.bio && (
                    <p className="text-xs text-muted-foreground line-clamp-2 italic px-1">
                      "{s.bio}"
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <div className={cn(
                      "px-3 py-1.5 rounded-xl border flex items-center gap-2",
                      s.status === 'active' ? "bg-green-500/10 border-green-500/30" :
                      s.status === 'on_leave' ? "bg-yellow-500/10 border-yellow-500/30" :
                      "bg-red-500/10 border-red-500/30"
                    )}>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        s.status === 'active' ? "bg-green-500 animate-pulse" :
                        s.status === 'on_leave' ? "bg-yellow-500" :
                        "bg-red-500"
                      )}></div>
                      <b className={cn(
                        "text-[10px] uppercase tracking-widest",
                        s.status === 'active' ? "text-green-500" :
                        s.status === 'on_leave' ? "text-yellow-500" :
                        "text-red-500"
                      )}>
                        {s.status || 'active'}
                      </b>
                    </div>

                    <div className="bg-muted/10 px-3 py-1.5 rounded-xl border border-border flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Comm:</span> 
                      <b className="text-green-500 text-xs">{s.commission}%</b>
                    </div>
                    <div className="bg-muted/10 px-3 py-1.5 rounded-xl border border-border flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Role:</span> 
                      <b className="text-primary text-xs uppercase">
                        {s.roles && s.roles.length > 0 ? s.roles.map(r => r === 'super_admin' ? 'Admin' : r).join(', ') : (s.role === 'super_admin' ? 'Admin' : s.role)}
                      </b>
                    </div>
                  </div>

                  {s.specialties && s.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {s.specialties.map(spec => (
                        <span key={spec} className="text-[9px] font-bold bg-primary/10 text-primary border border-border px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}



        {activeTab === 'customers' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                Customer Management
              </h4>
              <button 
                onClick={() => setShowCustForm(!showCustForm)}
                className="btn-primary px-4 py-2 text-[10px] rounded-xl flex items-center gap-2"
              >
                {showCustForm ? <X size={14} /> : <Plus size={14} />}
                {showCustForm ? 'CANCEL' : 'ADD NEW'}
              </button>
            </div>

            <Modal 
              isOpen={showCustForm} 
              onClose={() => { setShowCustForm(false); setCustName(''); setCustPhone(''); setCustEmail(''); setCustAddr(''); setCustNotes(''); }} 
              title="Add New Customer"
            >
              <div className="space-y-4">
                <FloatingInput label="Full Name" value={custName} onChange={setCustName} />
                <FloatingInput label="Phone Number" value={custPhone} onChange={setCustPhone} />
                <FloatingInput label="Email (Optional)" value={custEmail} onChange={setCustEmail} />
                <FloatingInput label="Address" value={custAddr} onChange={setCustAddr} />
                <FloatingInput label="Notes" value={custNotes} onChange={setCustNotes} />
                <button 
                  onClick={handleAddCustomer}
                  className="w-full btn-primary py-4 mt-2 uppercase tracking-widest font-black"
                >
                  Save Customer
                </button>
              </div>
            </Modal>

            <div className="space-y-4">
              <h4 className="text-primary font-bold uppercase tracking-widest text-xs px-1 flex items-center justify-between">
                <span>Customer List ({customers.length})</span>
                <UsersIcon size={14} />
              </h4>
              {customers.length === 0 ? (
                <div className="text-center py-12 bg-background/50 rounded-3xl border border-dashed border-border">
                  <p className="text-muted-foreground text-sm italic">No customers registered yet.</p>
                </div>
              ) : (
                customers.map(c => (
                  <div key={c.id} className="bg-background p-5 rounded-2xl border border-border space-y-4 shadow-sm hover:border-primary/30 transition-all group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{c.name}</h5>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-primary text-sm font-bold">{c.phone}</p>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border border-border">{(c.points || 0).toLocaleString()} pts</span>
                            <button 
                              onClick={() => {
                                setQuickEditingPoints(c);
                                setQuickPointsValue(String(c.points || 0));
                              }}
                              className="p-1 bg-primary/5 text-primary rounded-md border border-primary/10 hover:bg-primary hover:text-primary-foreground transition-all"
                              title="Quick Edit Points"
                            >
                              <Coins size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingCustomer(c);
                            setCustName(c.name);
                            setCustPhone(c.phone);
                            setCustEmail(c.email || '');
                            setCustAddr(c.address || '');
                            setCustNotes(c.notes || '');
                            setCustPoints(String(c.points || 0));
                          }}
                          className="p-2.5 bg-primary/10 text-primary rounded-xl border border-border hover:bg-primary hover:text-primary-foreground transition-all"
                          title="Edit Customer"
                        >
                          <Settings size={18} />
                        </button>
                        <button 
                          onClick={() => setShowConfirm({ coll: 'customers', id: c.id })}
                          className="p-2.5 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-foreground transition-all"
                          title="Delete Customer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setViewingCustomerHistory(c)}
                      className="w-full bg-muted/5 border border-border text-muted-foreground py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                    >
                      <FileText size={14} />
                      VIEW HISTORY
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Customer Modal */}
      <Modal 
        isOpen={!!editingCustomer} 
        onClose={() => setEditingCustomer(null)} 
        title="Edit Customer"
      >
        <div className="space-y-4">
          <FloatingInput label="Full Name" value={custName} onChange={setCustName} />
          <FloatingInput label="Phone Number" value={custPhone} onChange={setCustPhone} />
          <FloatingInput label="Email" value={custEmail} onChange={setCustEmail} />
          <FloatingInput label="Address" value={custAddr} onChange={setCustAddr} />
          <FloatingInput label="Notes" value={custNotes} onChange={setCustNotes} />
          <FloatingInput label="Loyalty Points" type="number" value={custPoints} onChange={setCustPoints} />
          <button 
            onClick={handleUpdateCustomer}
            className="w-full btn-primary py-4 mt-4 shadow-xl shadow-primary/20 uppercase tracking-widest font-black"
          >
            Update Customer
          </button>
        </div>
      </Modal>

      {/* Quick Edit Points Modal */}
      <Modal 
        isOpen={!!quickEditingPoints} 
        onClose={() => setQuickEditingPoints(null)} 
        title="Points"
        maxWidth="max-w-xs"
      >
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Customer</p>
            <p className="font-bold text-foreground">{quickEditingPoints?.name}</p>
          </div>
          <FloatingInput 
            label="Loyalty Points" 
            type="number" 
            value={quickPointsValue} 
            onChange={setQuickPointsValue} 
            onFocusClear
          />
          <button 
            onClick={handleQuickUpdatePoints}
            className="w-full btn-primary py-3 shadow-lg shadow-primary/20 uppercase tracking-widest font-black"
          >
            Save Points
          </button>
        </div>
      </Modal>

      {/* Customer History Modal */}
      {viewingCustomerHistory && (
        <div className="fixed inset-0 bg-background/95  z-[25000] flex flex-col p-4">
          <div className="flex justify-between items-center mb-8 max-w-2xl mx-auto w-full">
            <div>
              <h3 className="text-primary font-bold text-2xl tracking-tight">{viewingCustomerHistory.name}</h3>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">{viewingCustomerHistory.phone}</p>
                <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border border-border">{(viewingCustomerHistory.points || 0).toLocaleString()} pts</span>
              </div>
            </div>
            <button onClick={() => setViewingCustomerHistory(null)} className="p-3 bg-card rounded-2xl text-foreground border border-border hover:border-primary transition-all"><X size={24} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pb-10 max-w-2xl mx-auto w-full">
            <h4 className="text-primary font-bold uppercase text-xs tracking-widest border-b border-border pb-3 flex items-center gap-2">
              <div className="w-1.5 h-4 bg-primary rounded-full"></div>
              Service History
            </h4>
            {sales.filter(s => s.customerPhone === viewingCustomerHistory.phone || s.customerName === viewingCustomerHistory.name).length === 0 ? (
              <div className="text-center py-24 bg-card/50 rounded-[2rem] border border-dashed border-border">
                <p className="text-muted-foreground text-sm italic">No service history found for this customer.</p>
              </div>
            ) : (
              sales.filter(s => s.customerPhone === viewingCustomerHistory.phone || s.customerName === viewingCustomerHistory.name).map(s => (
                <div key={s.id} className="bg-card p-6 rounded-3xl border border-border space-y-4 shadow-sm hover:border-primary/30 transition-all group">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{new Date(s.dateTime).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    <span className="text-primary font-bold text-lg">{s.total.toLocaleString()} Ks</span>
                  </div>
                  <div className="space-y-2">
                    {s.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm items-center">
                        <span className="text-foreground font-medium">{item.name} <span className="text-muted-foreground text-xs ml-1">x{item.qty}</span></span>
                        {item.disP > 0 && <span className="bg-red-500/10 text-red-500 text-[9px] px-2 py-0.5 rounded-full font-bold">-{item.disP}%</span>}
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <UserIcon size={10} className="text-primary" />
                      Staff: {s.staff}
                    </span>
                    <span className="bg-muted/10 px-2 py-0.5 rounded-md">
                      {s.payments && s.payments.length > 1 
                        ? s.payments.map(p => `${p.method}: ${p.amount.toLocaleString()}`).join(' | ') 
                        : (s.method || 'Cash')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Status Message Toast */}
      {statusMsg && (
        <div className="fixed bottom-20 left-4 right-4 z-[30000] flex justify-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
              "px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 pointer-events-auto",
              statusMsg.type === 'success' 
                ? "bg-green-500 border-green-600 text-foreground" 
                : "bg-red-500 border-red-600 text-foreground"
            )}
          >
            {statusMsg.type === 'success' ? <div className="p-1 bg-white/20 rounded-full"><Check size={16} /></div> : <div className="p-1 bg-white/20 rounded-full"><X size={16} /></div>}
            <span className="font-bold text-sm tracking-tight">{statusMsg.text}</span>
            <button onClick={() => setStatusMsg(null)} className="ml-2 p-1 hover:bg-muted rounded-full transition-colors"><X size={16} /></button>
          </motion.div>
        </div>
      )}

      {/* Clear History Confirmation Modal */}
      <Modal 
        isOpen={showClearConfirm} 
        onClose={() => setShowClearConfirm(false)} 
        title="Clear All History?"
        maxWidth="max-w-xs"
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mx-auto animate-pulse">
            <Trash2 size={40} />
          </div>
          <p className="text-muted-foreground text-sm font-bold leading-relaxed">This will permanently delete every single sale record. This cannot be undone.</p>
          <div className="flex flex-col gap-3">
            <button 
              disabled={isClearing}
              onClick={handleClearHistory}
              className="w-full bg-red-500 text-foreground font-black py-4 rounded-2xl shadow-lg shadow-red-500/20 disabled:opacity-50 uppercase tracking-widest"
            >
              {isClearing ? "CLEARING..." : "YES, DELETE EVERYTHING"}
            </button>
            <button 
              disabled={isClearing}
              onClick={() => setShowClearConfirm(false)}
              className="w-full bg-muted/20 text-foreground font-black py-4 rounded-2xl border border-border hover:bg-muted/30 transition-all uppercase tracking-widest"
            >
              CANCEL
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={!!showConfirm} 
        onClose={() => setShowConfirm(null)} 
        title="Are you sure?"
        maxWidth="max-w-xs"
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto">
            <Trash2 size={32} />
          </div>
          <p className="text-muted-foreground text-sm font-bold">This action cannot be undone.</p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setShowConfirm(null)}
              className="bg-muted/20 text-foreground font-black py-3 rounded-xl border border-border hover:bg-muted/30 transition-all uppercase tracking-widest text-xs"
            >
              CANCEL
            </button>
            <button 
              disabled={isDeleting}
              onClick={() => handleDelete(showConfirm!.coll, showConfirm!.id)}
              className="bg-red-500 text-foreground font-black py-3 rounded-xl shadow-lg shadow-red-500/20 uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {isDeleting ? "DELETING..." : "DELETE"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const ForcePasswordChangePage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { forceChangePassword, error, setError, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await forceChangePassword(newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      // Error handled in useAuth
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background p-4 sm:p-6 overflow-y-auto select-none">
      <div className="max-w-md w-full p-8 bg-card rounded-3xl shadow-2xl border border-border/50 relative overflow-hidden my-auto shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-primary/10 rounded-2xl border border-border">
              <AlertTriangle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter">Security Update</h2>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">Password Change Required</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6 font-medium leading-relaxed">
            An administrator has reset your password. For your security, you must set a new password before continuing.
          </p>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-2xl flex items-center gap-3 font-bold"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-sm rounded-2xl flex items-center gap-3 font-bold"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              Password updated! Redirecting...
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-4 rounded-2xl bg-muted/30 border border-border/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 rounded-2xl bg-muted/30 border border-border/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-4 px-6 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 transition-all font-black text-xs tracking-widest uppercase shadow-xl shadow-primary/20 disabled:opacity-50 active:scale-95"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
              <button
                type="button"
                onClick={logout}
                className="w-full py-4 px-6 rounded-2xl border border-border/50 hover:bg-muted transition-all font-black text-xs tracking-widest uppercase active:scale-95"
              >
                Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ChangePasswordPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { changePassword, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      // Error handled in useAuth
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-card rounded-3xl shadow-2xl border border-border/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary/10 rounded-2xl border border-border">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tighter">Change Password</h2>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">Security Settings</p>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-2xl flex items-center gap-3 font-bold"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-sm rounded-2xl flex items-center gap-3 font-bold"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            Password updated successfully! Redirecting...
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-4 rounded-2xl bg-muted/30 border border-border/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-4 rounded-2xl bg-muted/30 border border-border/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 rounded-2xl bg-muted/30 border border-border/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 py-4 px-6 rounded-2xl border border-border/50 hover:bg-muted transition-all font-black text-xs tracking-widest uppercase active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 px-6 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 transition-all font-black text-xs tracking-widest uppercase shadow-xl shadow-primary/20 disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const IdentityResetPage: React.FC = () => {
  const [step, setStep] = useState<'verify' | 'reset'>('verify');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetPasswordWithIdentity, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cleanPhone = normalizePhone(phone);
      // Look up by doc ID directly
      const dummyEmail = `${cleanPhone}@nailpro.com`;
      const docRef = doc(db, 'users', dummyEmail);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error("Information does not match our records.");
      }
      
      const data = docSnap.data() as UserProfile;
      
      if (data.name.toLowerCase() !== name.toLowerCase() || data.dob !== dob) {
        throw new Error("Information does not match our records.");
      }

      setStep('reset');
    } catch (err: any) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await resetPasswordWithIdentity(phone, name, dob, newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      // Error handled in useAuth
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center bg-input p-4 sm:p-6 overflow-y-auto select-none">
        <div className="max-w-md w-full p-8 bg-card rounded-3xl shadow-2xl border border-border text-center my-auto shrink-0">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-foreground mb-4">Password Reset!</h2>
          <p className="text-muted-foreground font-bold">Your password has been updated successfully. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center bg-input p-4 sm:p-6 overflow-y-auto select-none">
      <div className="max-w-md w-full p-8 bg-card rounded-3xl shadow-2xl border border-border relative overflow-hidden my-auto shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-border">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-black text-foreground tracking-tighter">
              {step === 'verify' ? 'Verify Identity' : 'New Password'}
            </h2>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-2">
              {step === 'verify' ? 'Confirm your details' : 'Set your new password'}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-2xl flex items-center gap-3 font-bold"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {step === 'verify' ? (
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-input border border-border text-foreground focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition-all font-bold text-sm"
                  placeholder="As registered"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-input border border-border text-foreground focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition-all font-bold text-sm"
                  placeholder="09..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-input border border-border text-foreground focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition-all font-bold text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                {loading ? 'Verifying...' : 'Verify Identity'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-input border border-border text-foreground focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition-all font-bold text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-input border border-border text-foreground focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition-all font-bold text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                {loading ? 'Updating...' : 'Set New Password'}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PhoneSignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUpWithPhone, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await signUpWithPhone(phone, password, dob, name);
      navigate('/appointments');
    } catch (err) {
      // Error handled in useAuth
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center bg-input p-4 sm:p-6 overflow-y-auto select-none">
      <div className="max-w-md w-full p-8 bg-card rounded-3xl shadow-2xl border border-border relative overflow-hidden my-auto shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-border">
              <Phone className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-black text-foreground tracking-tighter">Join Us</h2>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-2">Sign up with Phone</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-2xl flex flex-col gap-3 font-bold"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
              {error.includes("already registered") && (
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-[10px] uppercase tracking-widest bg-red-500 text-foreground py-2 px-4 rounded-xl hover:bg-red-600 transition-colors self-start"
                >
                  Login Now
                </button>
              )}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 rounded-2xl bg-input border border-border text-foreground focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition-all font-bold text-sm"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-4 rounded-2xl bg-input border border-border text-foreground focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition-all font-bold text-sm"
                placeholder="09..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-4 rounded-2xl bg-input border border-border text-foreground focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition-all font-bold text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded-2xl bg-input border border-border text-foreground focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition-all font-bold text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 rounded-2xl bg-input border border-border text-foreground focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none transition-all font-bold text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-primary text-foreground font-black text-xs tracking-[0.2em] uppercase shadow-xl shadow-primary/20 disabled:opacity-50 active:scale-95 transition-all mt-4"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-4 px-6 rounded-2xl border border-border text-foreground font-black text-xs tracking-[0.2em] uppercase hover:bg-muted-foreground/20 transition-all active:scale-95"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ResetPasswordPage: React.FC = () => {
  const { resetPassword, loading, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setIsSent(true);
    } catch (err) {
      // Error is handled in useAuth
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#FFF5F5] via-[#F4DCD9] to-[#E8BEB9] z-[99999] flex flex-col items-center justify-center p-6 overflow-y-auto transition-colors duration-300 select-none">
      <div className="bg-white p-8 rounded-3xl border border-border w-full max-w-[380px] text-center space-y-6 shadow-xl my-auto transition-colors duration-300">
        <div className="space-y-1">
          <h2 className="text-[#4A2E31] tracking-[0.25em] uppercase text-2xl font-black font-serif">Nail Pro</h2>
          <p className="text-muted-foreground text-xs uppercase tracking-widest mt-2">Reset Password</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs p-3 rounded-xl animate-shake leading-relaxed">
            {error}
          </div>
        )}

        {isSent ? (
          <div className="space-y-6">
            <div className="bg-green-500/10 border border-green-500/30 text-green-600 text-xs p-4 rounded-xl leading-relaxed">
              Password reset link has been sent to <strong>{email}</strong>. Please check your inbox and follow the instructions.
            </div>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-primary text-foreground font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all"
            >
              BACK TO LOGIN
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground uppercase ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full bg-input border border-border rounded-xl p-3 text-foreground text-sm focus:border-primary outline-none transition-colors duration-300"
              />
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-muted text-foreground font-bold py-3 rounded-xl border border-border active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "SENDING..." : "SEND RESET LINK"}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="w-full text-muted-foreground text-xs font-bold hover:text-primary transition-colors"
            >
              CANCEL
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const LoginPage: React.FC = () => {
  const { user, profile, login, loginWithEmail, loginWithPhone, signUp, signUpWithPhone, loading, error, setError, isCustomer } = useAuth();
  const navigate = useNavigate();
  
  const [viewState, setViewState] = useState<'welcome' | 'login' | 'signup'>('welcome');
  
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Sign up state
  const [signUpMethod, setSignUpMethod] = useState<'phone' | 'email'>('phone');
  const [signUpIdentifier, setSignUpIdentifier] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpDob, setSignUpDob] = useState('');
  const [signUpShowPassword, setSignUpShowPassword] = useState(false);

  useEffect(() => {
    if (user && profile) {
      if (isCustomer) {
        navigate('/appointments');
      } else {
        navigate('/');
      }
    }
  }, [user, profile, navigate]);
  
  if (loading) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (loginMethod === 'phone') {
        await loginWithPhone(identifier, password);
      } else {
        await loginWithEmail(identifier, password);
      }
    } catch (err) {
      // Error is already handled and set in AuthProvider
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpIdentifier || !signUpPassword || !signUpName) {
      setError("Please fill in all required fields.");
      return;
    }

    if (signUpMethod === 'phone') {
      if (signUpPassword !== signUpConfirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (!signUpDob) {
        setError("Date of Birth is required for phone sign up.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (signUpMethod === 'phone') {
        await signUpWithPhone(signUpIdentifier, signUpPassword, signUpDob, signUpName);
      } else {
        await signUp(signUpIdentifier, signUpPassword, signUpName);
      }
    } catch (err) {
      // Error is already handled and set in AuthProvider
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await login();
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden overscroll-none bg-gradient-to-br from-[#FFF5F5] via-[#F4DCD9] to-[#E8BEB9] transition-colors duration-500 ease-in-out text-foreground select-none">
      <div className="h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
        <div className="relative w-full max-w-[400px] flex flex-col justify-center z-10 shrink-0 h-full max-h-[800px]">
        <AnimatePresence mode="wait">
        {viewState === 'welcome' && (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-full flex flex-col items-center justify-center space-y-8 bg-card p-10 sm:p-12 rounded-[2.5rem] shadow-2xl shadow-[#4A2E31]/10 border border-border"
          >
            {/* Header */}
            <div className="text-center shrink-0 w-full flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center w-full"
              >
                <h1 className="text-4xl sm:text-5xl font-serif text-[#4A2E31] tracking-[0.25em] leading-none mb-4 uppercase ml-4">NAIL PRO</h1>
                <p className="text-[10px] sm:text-[11px] font-medium text-[#4A2E31]/80 uppercase tracking-[0.5em] ml-2 font-serif">Beauty Studio Management</p>
              </motion.div>
            </div>

            <div className="w-full space-y-4 pt-8">
              <button
                onClick={() => { setViewState('login'); setError(null); }}
                className="w-full bg-[#4A2E31] text-white font-black py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all text-[10px] tracking-[0.2em]"
              >
                SIGN IN
              </button>
              <button
                onClick={() => { setViewState('signup'); setError(null); }}
                className="w-full bg-white border border-[#4A2E31]/20 text-[#4A2E31] font-black py-4 rounded-xl shadow-sm hover:bg-[#F9EFEF] hover:scale-[1.02] active:scale-[0.98] transition-all text-[10px] tracking-[0.2em]"
              >
                CREATE ACCOUNT
              </button>
            </div>
          </motion.div>
        )}

        {viewState === 'login' && (
          <motion.div 
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card p-5 sm:p-6 rounded-[2rem] border border-border shadow-2xl shadow-[#4A2E31]/10 shrink-0 relative"
          >
            <button
              onClick={() => setViewState('welcome')}
              className="absolute top-4 left-4 p-2 text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Back
            </button>
            
            <div className="text-center mb-6 mt-4">
              <h2 className="text-xl font-black text-[#4A2E31] tracking-widest uppercase font-serif">Welcome Back</h2>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl font-bold flex items-center gap-3"
              >
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Auth Method Selector */}
            <div className="flex p-1 bg-input rounded-xl mb-5 border border-border shadow-sm">
              <button
                type="button"
                onClick={() => { setLoginMethod('phone'); setIdentifier(''); setError(null); }}
                className={cn(
                  "flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative",
                  loginMethod === 'phone' ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {loginMethod === 'phone' && (
                  <motion.div layoutId="activeTabLogin" className="absolute inset-0 bg-primary rounded-xl z-0" />
                )}
                <span className="relative z-10">Phone</span>
              </button>
              <button
                type="button"
                onClick={() => { setLoginMethod('email'); setIdentifier(''); setError(null); }}
                className={cn(
                  "flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative",
                  loginMethod === 'email' ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {loginMethod === 'email' && (
                  <motion.div layoutId="activeTabLogin" className="absolute inset-0 bg-primary rounded-xl z-0" />
                )}
                <span className="relative z-10">Email</span>
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] text-primary/60 font-black uppercase tracking-widest ml-1">
                  {loginMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                </label>
                <div className="relative">
                  {loginMethod === 'email' ? (
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={16} />
                  ) : (
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={16} />
                  )}
                  <input 
                    type={loginMethod === 'email' ? "email" : "tel"} 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={loginMethod === 'email' ? "email@example.com" : "09xxxxxxxxx"}
                    className="w-full bg-input border border-border rounded-xl p-3 pl-10 text-foreground text-sm focus:border-primary outline-none transition-all placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[9px] text-primary/60 font-black uppercase tracking-widest">Password</label>
                  <button 
                    type="button"
                    onClick={() => navigate('/identity-reset')}
                    className="text-[9px] text-primary font-bold hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={16} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-input border border-border rounded-xl p-3 pl-10 pr-10 text-foreground text-sm focus:border-primary outline-none transition-all placeholder:text-muted-foreground"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-foreground font-black py-3 mt-2 rounded-xl shadow-[0_10px_20px_rgba(212,175,55,0.2)] active:scale-[0.98] transition-all disabled:opacity-50 text-[10px] tracking-[0.2em]"
              >
                {isSubmitting ? "PROCESSING..." : "SIGN IN"}
              </button>
            </form>

            <div className="mt-5 space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <span className="relative px-4 text-[8px] font-black text-muted-foreground uppercase tracking-widest bg-card">Or continue with</span>
              </div>

              <button 
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-input border border-border text-foreground font-bold py-3 rounded-xl hover:bg-muted transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
              >
                <span className="text-xs tracking-wider">Continue with Google</span>
              </button>
            </div>
            
            <div className="pt-6 text-center">
              <button 
                onClick={() => setShowHelp(!showHelp)}
                className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <HelpCircle size={12} />
                Need help?
              </button>
              
              {showHelp && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-primary/5 border border-primary/10 rounded-2xl text-left"
                >
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Staff Registration</p>
                  <p className="text-[9px] text-muted-foreground leading-relaxed">
                    If you were added as a staff member by an admin, you still need to <strong className="text-primary">Sign Up</strong> once with your email to set your password.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {viewState === 'signup' && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card p-5 sm:p-6 rounded-[2rem] border border-border shadow-2xl  shrink-0 relative w-full overflow-y-auto max-h-[80vh]"
          >
            <button
              onClick={() => setViewState('welcome')}
              className="absolute top-4 left-4 p-2 text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest z-20"
            >
              <ArrowLeft size={14} /> Back
            </button>
            
            <div className="text-center mb-6 mt-4">
              <h2 className="text-xl font-black text-[#4A2E31] tracking-widest uppercase font-serif">Create Account</h2>
              <p className="text-[9px] text-[#4A2E31]/70 font-bold uppercase tracking-[0.2em] mt-1">Join Nail Pro Studio</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl font-bold flex items-center gap-3">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <div className="flex p-1 bg-input rounded-xl mb-5 border border-border shadow-sm">
              <button
                type="button"
                onClick={() => { setSignUpMethod('phone'); setSignUpIdentifier(''); setError(null); }}
                className={cn(
                  "flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative",
                  signUpMethod === 'phone' ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {signUpMethod === 'phone' && (
                  <motion.div layoutId="signUpActiveTab" className="absolute inset-0 bg-primary rounded-xl z-0" />
                )}
                <span className="relative z-10">Phone</span>
              </button>
              <button
                type="button"
                onClick={() => { setSignUpMethod('email'); setSignUpIdentifier(''); setError(null); }}
                className={cn(
                  "flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative",
                  signUpMethod === 'email' ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {signUpMethod === 'email' && (
                  <motion.div layoutId="signUpActiveTab" className="absolute inset-0 bg-primary rounded-xl z-0" />
                )}
                <span className="relative z-10">Email</span>
              </button>
            </div>

            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] text-primary/60 font-black uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={16} />
                  <input 
                    type="text" 
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-input border border-border rounded-xl p-3 pl-10 text-foreground text-sm focus:border-primary outline-none transition-all placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-primary/60 font-black uppercase tracking-widest ml-1">
                  {signUpMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                </label>
                <div className="relative">
                  {signUpMethod === 'email' ? (
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={16} />
                  ) : (
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={16} />
                  )}
                  <input 
                    type={signUpMethod === 'email' ? "email" : "tel"} 
                    value={signUpIdentifier}
                    onChange={(e) => setSignUpIdentifier(e.target.value)}
                    placeholder={signUpMethod === 'email' ? "email@example.com" : "09xxxxxxxxx"}
                    className="w-full bg-input border border-border rounded-xl p-3 pl-10 text-foreground text-sm focus:border-primary outline-none transition-all placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {signUpMethod === 'phone' && (
                <div className="space-y-1">
                  <label className="text-[9px] text-primary/60 font-black uppercase tracking-widest ml-1">Date of Birth</label>
                  <input 
                    type="date"
                    value={signUpDob}
                    onChange={(e) => setSignUpDob(e.target.value)}
                    className="w-full bg-input border border-border rounded-xl p-3 text-foreground text-sm focus:border-primary outline-none transition-all"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[9px] text-primary/60 font-black uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={16} />
                  <input 
                    type={signUpShowPassword ? "text" : "password"} 
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-input border border-border rounded-xl p-3 pl-10 pr-10 text-foreground text-sm focus:border-primary outline-none transition-all placeholder:text-muted-foreground"
                  />
                  <button 
                    type="button"
                    onClick={() => setSignUpShowPassword(!signUpShowPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary transition-colors"
                  >
                    {signUpShowPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {signUpMethod === 'phone' && (
                <div className="space-y-1">
                  <label className="text-[9px] text-primary/60 font-black uppercase tracking-widest ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={16} />
                    <input 
                      type={signUpShowPassword ? "text" : "password"} 
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-input border border-border rounded-xl p-3 pl-10 pr-10 text-foreground text-sm focus:border-primary outline-none transition-all placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-foreground font-black py-3 mt-4 rounded-xl shadow-[0_10px_20px_rgba(212,175,55,0.2)] active:scale-[0.98] transition-all disabled:opacity-50 text-[10px] tracking-[0.2em]"
              >
                {isSubmitting ? "PROCESSING..." : "CREATE ACCOUNT"}
              </button>
            </form>

            <div className="mt-5 space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <span className="relative px-4 text-[8px] font-black text-muted-foreground uppercase tracking-widest bg-card">Or continue with</span>
              </div>

              <button 
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-input border border-border text-foreground font-bold py-3 rounded-xl hover:bg-muted transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
              >
                <span className="text-xs tracking-wider">Continue with Google</span>
              </button>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, profile, loading, isCustomer, isSuperAdmin, isOwner, isCashier } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    let listener: any = null;
    
    const handleBackButton = () => {
      // If we are not logged in, or on main pages, confirm exit instead of going back.
      if (!user || location.pathname === '/' || location.pathname === '/login' || location.pathname === '/appointments') {
        setShowExitConfirm(true);
      } else {
        navigate(-1);
      }
    };

    if (Capacitor.isNativePlatform()) {
      CapApp.addListener('backButton', handleBackButton).then(handle => {
        listener = handle;
      }).catch(() => {
        listener = CapApp.addListener('backButton', handleBackButton);
      });
    }

    return () => {
      if (listener) {
        if (typeof listener.remove === 'function') {
          listener.remove();
        } else if (listener.then) {
          listener.then((l: any) => l?.remove?.());
        }
      }
    };
  }, [location.pathname, navigate, user]);

  useEffect(() => {
    if (!loading && user && profile) {
      const hasRedirected = sessionStorage.getItem('initial_redirect_done');
      if (!hasRedirected) {
        navigate('/');
        sessionStorage.setItem('initial_redirect_done', 'true');
      }
    }
  }, [user, profile, loading, navigate]);

  const renderExitConfirm = () => {
    if (!showExitConfirm) return null;
    return (
      <div className="fixed inset-0 bg-black/60 z-[999999] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300 select-none">
        <div className="bg-white p-6 rounded-3xl border border-border w-full max-w-[320px] text-center space-y-6 shadow-xl">
          <h3 className="text-xl font-black text-[#4A2E31] uppercase tracking-widest font-serif">Exit App</h3>
          <p className="text-muted-foreground text-sm">Are you sure you want to exit the app?</p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowExitConfirm(false)}
              className="flex-1 bg-muted text-[#4A2E31] font-bold py-3 rounded-xl hover:bg-muted/80 transition-all text-xs tracking-wider"
            >
              NO
            </button>
            <button
              onClick={() => {
                setShowExitConfirm(false);
                CapApp.exitApp();
              }}
              className="flex-1 bg-[#4A2E31] text-white font-bold py-3 rounded-xl hover:bg-[#4A2E31]/90 transition-all text-xs tracking-wider shadow-md"
            >
              YES
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-background transition-colors duration-300 select-none">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) {
    if (location.pathname === '/reset-password') {
      return <>{renderExitConfirm()}<ResetPasswordPage /></>;
    }
    if (location.pathname === '/identity-reset') {
      return <>{renderExitConfirm()}<IdentityResetPage /></>;
    }
    return <>{renderExitConfirm()}<LoginPage /></>;
  }

  if (profile?.mustChangePassword && location.pathname !== '/force-password-change') {
    return <Navigate to="/force-password-change" />;
  }

  const handleRefresh = async () => {
    // Dispatch event for components to optionally re-fetch
    window.dispatchEvent(new CustomEvent('app:refresh'));
    // Await for a brief duration for the spinner to show, mimicking data sync over live sockets
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-10 transition-colors duration-300 select-none">
      {renderExitConfirm()}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <main className="max-w-md mx-auto px-4 pt-4 h-full">
        <PullToRefresh onRefresh={handleRefresh}>
          {children}
        </PullToRefresh>
      </main>
    </div>
  );
};


const LazyDashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const LazyCustomerDashboardPage = React.lazy(() => import('./pages/CustomerDashboardPage'));
const LazyPOSPage = React.lazy(() => import('./pages/POSPage'));
const LazyAppointmentsPage = React.lazy(() => import('./pages/AppointmentsPage'));
const LazyHistoryPage = React.lazy(() => import('./pages/HistoryPage'));
const LazyStaffCommissionsPage = React.lazy(() => import('./pages/StaffCommissionsPage'));
const LazyMonthlySummaryPage = React.lazy(() => import('./pages/MonthlySummaryPage'));
const LazySalesReportPage = React.lazy(() => import('./pages/SalesReportPage'));
const LazyExpenseListPage = React.lazy(() => import('./pages/ExpenseListPage'));
const LazyManagePage = React.lazy(() => import('./pages/ManagePage'));

const AppRoutes = () => {
  const { profile, isAdmin, isStaff, isCashier, isStaffMember, isCustomer } = useAuth();
  
  return (
    <React.Suspense fallback={
      <div className="flex-1 flex items-center justify-center p-10">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <Routes>
        <Route path="/" element={isCustomer ? <LazyCustomerDashboardPage /> : <LazyDashboardPage />} />
        <Route path="/pos" element={!isStaff ? <Navigate to="/appointments" /> : <LazyPOSPage />} />
        <Route path="/appointments" element={<LazyAppointmentsPage />} />
        <Route path="/history" element={!isStaff ? <Navigate to="/appointments" /> : <LazyHistoryPage />} />
        <Route path="/staff-commissions" element={!(isAdmin || isCashier || isStaffMember) ? <Navigate to="/appointments" /> : <LazyStaffCommissionsPage />} />
        <Route path="/monthly" element={!(isAdmin || isCashier) ? <Navigate to="/appointments" /> : <LazyMonthlySummaryPage />} />
        <Route path="/sales-report" element={!(isAdmin || isCashier) ? <Navigate to="/appointments" /> : <LazySalesReportPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/force-password-change" element={<ForcePasswordChangePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/identity-reset" element={<IdentityResetPage />} />
        <Route path="/expenses" element={!(isAdmin || isCashier) ? <Navigate to="/appointments" /> : <LazyExpenseListPage />} />
        <Route path="/manage" element={!isAdmin ? <Navigate to="/appointments" /> : <LazyManagePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </React.Suspense>
  );
};

// --- App ---

export function AppCore() {
return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
export default AppCore;
