import React, { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { 
 TrendingUp, 
 TrendingDown, Minus, 
 DollarSign, 
 Users, 
 Receipt, 
 Percent, 
 Award, 
 Clock, 
 Calendar, 
 Sparkles, 
 Download, 
 BarChart3,
 Search,
 PieChart as PieChartIcon,
 RefreshCw,
 Star,
 AlertCircle,
 Database,
 Filter
} from 'lucide-react';
import { 
 ResponsiveContainer, 
 AreaChart, 
 Area, 
 BarChart, 
 Bar, 
 PieChart, 
 Pie, 
 Cell, 
 XAxis, 
 YAxis, 
 CartesianGrid, 
 Tooltip, 
 Legend 
} from 'recharts';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Sale, UserProfile, Appointment } from '../types';
import { useAuth } from '../AppCore';

// Date parser helper
const parseSaleDate = (sale: Sale): Date => {
 if (sale.dateTime) {
 const d = new Date(sale.dateTime);
 if (!isNaN(d.getTime())) return d;
 }
 if (sale.date) {
 const d = new Date(sale.date);
 if (!isNaN(d.getTime())) return d;
 }
 return new Date();
};

const getLocalDateKey = (d: Date): string => {
 const year = d.getFullYear();
 const month = String(d.getMonth() + 1).padStart(2, '0');
 const day = String(d.getDate()).padStart(2, '0');
 return `${year}-${month}-${day}`;
};

export const BusinessAnalysisPage: React.FC = () => {
 const { isAdmin } = useAuth();



 const [timeRange, setTimeRange] = useState<'7days' | '30days' | 'month' | 'year' | 'custom'>('7days');
 const [customStartDate, setCustomStartDate] = useState<string>(() => {
 const d = new Date();
 d.setDate(d.getDate() - 29);
 return getLocalDateKey(d);
 });
 const [customEndDate, setCustomEndDate] = useState<string>(() => {
 return getLocalDateKey(new Date());
 });

 const [sales, setSales] = useState<Sale[]>([]);
 const [users, setUsers] = useState<UserProfile[]>([]);
 const [appointments, setAppointments] = useState<Appointment[]>([]);
 const [loading, setLoading] = useState(true);
 const [staffSearch, setStaffSearch] = useState('');
 const [sortBy, setSortBy] = useState<'revenue' | 'commission' | 'services'>('revenue');

 // Load Real Firestore Data
 useEffect(() => {
 setLoading(true);

 const qSales = query(collection(db, 'sales'), orderBy('date', 'desc'));
 const unsubSales = onSnapshot(qSales, (snapshot) => {
 const fetchedSales: Sale[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
 setSales(fetchedSales);
 setLoading(false);
 }, (error) => {
 console.error('Firestore Sales listener error:', error);
 handleFirestoreError(error, OperationType.LIST, 'sales');
 setLoading(false);
 });

 const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
 const fetchedUsers: UserProfile[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
 setUsers(fetchedUsers);
 }, (error) => {
 console.error('Firestore Users listener error:', error);
 handleFirestoreError(error, OperationType.LIST, 'users');
 });

 const unsubAppts = onSnapshot(collection(db, 'appointments'), (snapshot) => {
 const fetchedAppts: Appointment[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
 setAppointments(fetchedAppts);
 }, (error) => {
 console.error('Firestore Appointments listener error:', error);
 handleFirestoreError(error, OperationType.LIST, 'appointments');
 });

 return () => {
 unsubSales();
 unsubUsers();
 unsubAppts();
 };
 }, []);

 // Filter Sales & Appointments by selected timeRange (Current vs Previous period)
 const { currentSales, previousSales, currentAppts, previousAppts, currentStart, currentEnd, periodLabel } = useMemo(() => {
 const now = new Date();
 const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

 let currentStart = new Date(today);
 let currentEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
 let prevStart = new Date(today);
 let prevEnd = new Date(today);
 let periodLabel = '';

 if (timeRange === '7days') {
 currentStart.setDate(today.getDate() - 6);
 prevStart.setDate(today.getDate() - 13);
 prevEnd.setDate(today.getDate() - 7);
 prevEnd.setHours(23, 59, 59, 999);
 periodLabel = 'Last 7 Days';
 } else if (timeRange === '30days') {
 currentStart.setDate(today.getDate() - 29);
 prevStart.setDate(today.getDate() - 59);
 prevEnd.setDate(today.getDate() - 30);
 prevEnd.setHours(23, 59, 59, 999);
 periodLabel = 'Last 30 Days';
 } else if (timeRange === 'month') {
 currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
 currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
 prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
 prevEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
 periodLabel = 'This Month';
 } else if (timeRange === 'year') {
 currentStart = new Date(now.getFullYear(), 0, 1);
 currentEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
 prevStart = new Date(now.getFullYear() - 1, 0, 1);
 prevEnd = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
 periodLabel = 'This Year';
 } else if (timeRange === 'custom') {
 if (customStartDate) {
 const [sy, sm, sd] = customStartDate.split('-').map(Number);
 currentStart = new Date(sy, sm - 1, sd, 0, 0, 0, 0);
 }
 if (customEndDate) {
 const [ey, em, ed] = customEndDate.split('-').map(Number);
 currentEnd = new Date(ey, em - 1, ed, 23, 59, 59, 999);
 }
 prevStart = new Date(currentStart.getFullYear(), currentStart.getMonth() - 1, currentStart.getDate(), 0, 0, 0, 0);
      prevEnd = new Date(currentEnd.getFullYear(), currentEnd.getMonth() - 1, currentEnd.getDate(), 23, 59, 59, 999);
      periodLabel = `${customStartDate} to ${customEndDate}`;
 }

 const currentSales = sales.filter(s => {
 const d = parseSaleDate(s);
 return d >= currentStart && d <= currentEnd;
 });

 const previousSales = sales.filter(s => {
 const d = parseSaleDate(s);
 return d >= prevStart && d <= prevEnd;
 });

 const currentAppts = appointments.filter(a => {
 const d = new Date(a.date);
 return d >= currentStart && d <= currentEnd;
 });

 const previousAppts = appointments.filter(a => {
 const d = new Date(a.date);
 return d >= prevStart && d <= prevEnd;
 });

 return { currentSales, previousSales, currentAppts, previousAppts, currentStart, currentEnd, periodLabel };
 }, [sales, appointments, timeRange, customStartDate, customEndDate]);

 // SECTION A: KPI Metrics calculated directly from ACTUAL sales & appointments
 const metrics = useMemo(() => {
 const currentTotalRev = currentSales.reduce((acc, s) => acc + (s.total || 0), 0);
 const prevTotalRev = previousSales.reduce((acc, s) => acc + (s.total || 0), 0);

 const getGrowthValue = (current, previous) => {
      if (previous > 0) {
        return ((current - previous) / previous) * 100;
      }
      return current > 0 ? 100 : 0;
    };

    const revGrowthVal = getGrowthValue(currentTotalRev, prevTotalRev);

    const currentSalesCount = currentSales.length;
    const prevSalesCount = previousSales.length;

    const currentAvgTicket = currentSalesCount > 0 ? Math.round(currentTotalRev / currentSalesCount) : 0;
    const prevAvgTicket = prevSalesCount > 0 ? Math.round(prevTotalRev / prevSalesCount) : 0;

    const ticketGrowthVal = getGrowthValue(currentAvgTicket, prevAvgTicket);

    // Total Discounts from sales items
    let totalDiscount = 0;
    currentSales.forEach(s => {
      s.items?.forEach(item => {
        if (item.disP && item.disP > 0) {
          totalDiscount += (item.price * item.qty * (item.disP / 100));
        }
      });
    });

    const discountRatio = currentTotalRev > 0 
      ? ((totalDiscount / (currentTotalRev + totalDiscount)) * 100).toFixed(1) 
      : '0.0';

    // Unique Customers or Total Appointments
    const clientCount = currentAppts.length > 0 ? currentAppts.length : currentSalesCount;
    const prevClientCount = previousAppts.length > 0 ? previousAppts.length : prevSalesCount;

    const clientGrowthVal = getGrowthValue(clientCount, prevClientCount);

    return {
      totalRevenue: currentTotalRev,
      revenueGrowthValue: revGrowthVal,

      avgTicket: currentAvgTicket,
      ticketGrowthValue: ticketGrowthVal,

      totalDiscount: Math.round(totalDiscount),
      discountRatio: `${discountRatio}%`,

      clientCount,
      clientGrowthValue: clientGrowthVal
    };
 }, [currentSales, previousSales, currentAppts, previousAppts]);

 // SECTION B1: Revenue Trend Over Time (Area Chart Data) - Daily for 7days, 30days, month, custom!
 const revenueTrendData = useMemo(() => {
 // Build quick lookup dictionary for all sales total by YYYY-MM-DD
 const salesByDate: Record<string, number> = {};
 sales.forEach(s => {
 const dateKey = getLocalDateKey(parseSaleDate(s));
 salesByDate[dateKey] = (salesByDate[dateKey] || 0) + (s.total || 0);
 });

 if (timeRange === '7days') {
 const result = [];
 for (let i = 0; i < 7; i++) {
 const currDate = new Date(currentStart.getFullYear(), currentStart.getMonth(), currentStart.getDate() + i);
 const prevDate = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate() - 7);

 const currKey = getLocalDateKey(currDate);
 const prevKey = getLocalDateKey(prevDate);

 const rev = salesByDate[currKey] || 0;
 const prevRev = salesByDate[prevKey] || 0;

 const dayLabel = currDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
 result.push({ name: dayLabel, revenue: rev, previous: prevRev, fullDate: currKey });
 }
 return result;
 } else if (timeRange === '30days') {
 const result = [];
 for (let i = 0; i < 30; i++) {
 const currDate = new Date(currentStart.getFullYear(), currentStart.getMonth(), currentStart.getDate() + i);
 const prevDate = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate() - 30);

 const currKey = getLocalDateKey(currDate);
 const prevKey = getLocalDateKey(prevDate);

 const rev = salesByDate[currKey] || 0;
 const prevRev = salesByDate[prevKey] || 0;

 const dayLabel = currDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
 result.push({ name: dayLabel, revenue: rev, previous: prevRev, fullDate: currKey });
 }
 return result;
 } else if (timeRange === 'month') {
 const year = currentStart.getFullYear();
 const month = currentStart.getMonth();
 const daysInMonth = new Date(year, month + 1, 0).getDate();

 const result = [];
 for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
 const currDate = new Date(year, month, dayNum);
 const prevDate = new Date(year, month - 1, dayNum);

 const currKey = getLocalDateKey(currDate);
 const prevKey = getLocalDateKey(prevDate);

 const rev = salesByDate[currKey] || 0;
 const prevRev = salesByDate[prevKey] || 0;

 const dayLabel = currDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
 result.push({ name: dayLabel, revenue: rev, previous: prevRev, fullDate: currKey });
 }
 return result;
 } else if (timeRange === 'custom') {
 const diffMs = currentEnd.getTime() - currentStart.getTime();
 const totalDays = Math.min(365, Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1));

 const result = [];
 for (let i = 0; i < totalDays; i++) {
 const currDate = new Date(currentStart.getFullYear(), currentStart.getMonth(), currentStart.getDate() + i);
 const prevDate = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate() - totalDays);

 const currKey = getLocalDateKey(currDate);
 const prevKey = getLocalDateKey(prevDate);

 const rev = salesByDate[currKey] || 0;
 const prevRev = salesByDate[prevKey] || 0;

 const dayLabel = currDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
 result.push({ name: dayLabel, revenue: rev, previous: prevRev, fullDate: currKey });
 }
 return result;
 } else {
 // Year: 12 months
 const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
 return months.map((mName, idx) => {
 const rev = currentSales
 .filter(s => parseSaleDate(s).getMonth() === idx)
 .reduce((acc, s) => acc + (s.total || 0), 0);
 
 const prevRev = previousSales
 .filter(s => parseSaleDate(s).getMonth() === idx)
 .reduce((acc, s) => acc + (s.total || 0), 0);

 return { name: mName, revenue: rev, previous: prevRev };
 });
 }
 }, [sales, currentSales, previousSales, timeRange, currentStart, currentEnd]);

 // SECTION B2: Payment Methods Breakdown (Donut Chart)
 const paymentBreakdownData = useMemo(() => {
 const map: Record<string, number> = {
 'KBZPay': 0,
 'WavePay': 0,
 'Cash': 0,
 'AYA Pay': 0,
 'CB PAY': 0,
 'Card / Bank': 0
 };

 currentSales.forEach(sale => {
 if (sale.payments && Array.isArray(sale.payments) && sale.payments.length > 0) {
 sale.payments.forEach(p => {
 const method = p.method || 'Cash';
 if (map[method] !== undefined) {
 map[method] += p.amount || 0;
 } else {
 map['Card / Bank'] += p.amount || 0;
 }
 });
 } else if (sale.method) {
 const method = sale.method;
 if (map[method] !== undefined) {
 map[method] += sale.total || 0;
 } else {
 map['Cash'] += sale.total || 0;
 }
 } else {
 map['Cash'] += sale.total || 0;
 }
 });

 const colors: Record<string, string> = {
 'KBZPay': '#10B981',
 'WavePay': '#F59E0B',
 'Cash': '#3B82F6',
 'AYA Pay': '#8B5CF6',
 'CB PAY': '#EC4899',
 'Card / Bank': '#06B6D4'
 };

 const formatted = Object.entries(map)
 .map(([name, value]) => ({ name, value, color: colors[name] || '#64748B' }))
 .filter(item => item.value > 0);

 // If no sales exist, provide clean empty fallback array for chart rendering
 if (formatted.length === 0) {
 return [
 { name: 'KBZPay', value: 0, color: '#10B981' },
 { name: 'WavePay', value: 0, color: '#F59E0B' },
 { name: 'Cash', value: 0, color: '#3B82F6' },
 ];
 }

 return formatted;
 }, [currentSales]);

 // SECTION B3: Top Selling Services
 const { topServicesByRevenue, topServicesByUsage } = useMemo(() => {
 const serviceMap: Record<string, { revenue: number, count: number }> = {};

 currentSales.forEach(sale => {
 sale.items?.forEach(item => {
 const name = item.name || 'Unspecified Service';
 const netRev = (item.price * item.qty) * (1 - ((item.disP || 0) / 100));
 
 if (!serviceMap[name]) {
 serviceMap[name] = { revenue: 0, count: 0 };
 }
 serviceMap[name].revenue += netRev;
 serviceMap[name].count += item.qty || 1;
 });
 });

 const entries = Object.entries(serviceMap)
 .map(([name, data]) => ({ name, revenue: Math.round(data.revenue), count: data.count }));

 const topServicesByRevenue = [...entries].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
 const topServicesByUsage = [...entries].sort((a, b) => b.count - a.count).slice(0, 5);

 return { topServicesByRevenue, topServicesByUsage };
 }, [currentSales]);

 // SECTION B4: Hourly Traffic / Peak Hours (Column Chart)
 const hourlyTrafficData = useMemo(() => {
 const hourBlocks = [
 { hour: '9 AM', h: 9 },
 { hour: '10 AM', h: 10 },
 { hour: '11 AM', h: 11 },
 { hour: '12 PM', h: 12 },
 { hour: '1 PM', h: 13 },
 { hour: '2 PM', h: 14 },
 { hour: '3 PM', h: 15 },
 { hour: '4 PM', h: 16 },
 { hour: '5 PM', h: 17 },
 { hour: '6 PM', h: 18 },
 { hour: '7 PM', h: 19 },
 { hour: '8 PM', h: 20 },
 ];

 const counts: Record<number, number> = {};
 hourBlocks.forEach(hb => { counts[hb.h] = 0; });

 currentSales.forEach(sale => {
 const d = parseSaleDate(sale);
 const hour = d.getHours();
 if (counts[hour] !== undefined) {
 counts[hour] += 1;
 }
 });

 currentAppts.forEach(appt => {
 if (appt.time) {
 const match = appt.time.match(/^(\d{1,2})/);
 if (match) {
 let h = parseInt(match[1], 10);
 if (appt.time.toLowerCase().includes('pm') && h < 12) h += 12;
 if (counts[h] !== undefined) {
 counts[h] += 1;
 }
 }
 }
 });

 const maxCount = Math.max(...Object.values(counts), 1);

 return hourBlocks.map(hb => {
 const clientCount = counts[hb.h] || 0;
 return {
 hour: hb.hour,
 clients: clientCount,
 isPeak: clientCount > 0 && clientCount >= (maxCount * 0.7)
 };
 });
 }, [currentSales, currentAppts]);

 // SECTION C: Staff Leaderboard & Commission
 const staffLeaderboardData = useMemo(() => {
 const staffMap: Record<string, {
 name: string;
 role: string;
 servicesCount: number;
 revenueGenerated: number;
 commissionEarned: number;
 email?: string;
 }> = {};

 const superAdminNames = new Set(
 users.filter(u => u.role === 'super_admin').map(u => u.name)
 );

 // Initialize map with known staff/users (excluding super_admin)
 users.forEach(u => {
 if (['staff', 'cashier', 'owner'].includes(u.role)) {
 staffMap[u.name] = {
 name: u.name,
 role: u.role === 'staff' ? 'Nail Specialist' : u.role === 'owner' ? 'Salon Owner' : 'Cashier',
 servicesCount: 0,
 revenueGenerated: 0,
 commissionEarned: 0,
 email: u.email
 };
 }
 });

 // Process actual current sales
 currentSales.forEach(sale => {
 sale.items?.forEach(item => {
 const itemNetPrice = item.price * item.qty * (1 - ((item.disP || 0) / 100));

 if (item.staffAssignments && item.staffAssignments.length > 0) {
 item.staffAssignments.forEach(sa => {
 if (superAdminNames.has(sa.name)) return;
 if (!staffMap[sa.name]) {
 staffMap[sa.name] = {
 name: sa.name,
 role: 'Nail Artist',
 servicesCount: 0,
 revenueGenerated: 0,
 commissionEarned: 0
 };
 }
 staffMap[sa.name].revenueGenerated += (itemNetPrice / item.staffAssignments!.length);
 staffMap[sa.name].commissionEarned += (sa.commission || 0);
 staffMap[sa.name].servicesCount += sa.qty || 1;
 });
 } else if (item.staffName) {
 const sName = item.staffName;
 if (superAdminNames.has(sName)) return;
 if (!staffMap[sName]) {
 staffMap[sName] = {
 name: sName,
 role: 'Nail Artist',
 servicesCount: 0,
 revenueGenerated: 0,
 commissionEarned: 0
 };
 }
 staffMap[sName].revenueGenerated += itemNetPrice;
 staffMap[sName].commissionEarned += (item.commission || 0);
 staffMap[sName].servicesCount += item.qty || 1;
 } else if (sale.staff) {
 const sName = sale.staff;
 if (superAdminNames.has(sName)) return;
 if (!staffMap[sName]) {
 staffMap[sName] = {
 name: sName,
 role: 'Nail Specialist',
 servicesCount: 0,
 revenueGenerated: 0,
 commissionEarned: 0
 };
 }
 staffMap[sName].revenueGenerated += itemNetPrice;
 staffMap[sName].commissionEarned += (item.commission || 0);
 staffMap[sName].servicesCount += item.qty || 1;
 }
 });
 });

 return Object.values(staffMap)
 .filter(s => !superAdminNames.has(s.name) && s.role !== 'Super Admin')
 .map(s => ({
 ...s,
 revenueGenerated: Math.round(s.revenueGenerated),
 commissionEarned: Math.round(s.commissionEarned)
 }))
 .filter(s => s.name.toLowerCase().includes(staffSearch.toLowerCase()))
 .sort((a, b) => {
 if (sortBy === 'revenue') return b.revenueGenerated - a.revenueGenerated;
 if (sortBy === 'commission') return b.commissionEarned - a.commissionEarned;
 return b.servicesCount - a.servicesCount;
 });
 }, [users, currentSales, staffSearch, sortBy]);

 // Export Report Functionality
 const handleExportReport = () => {
 const reportData = `
========================================
SALON BUSINESS ANALYSIS REPORT (ACTUAL DATA)
Time Range: ${timeRange.toUpperCase()}
Generated On: ${new Date().toLocaleString()}
========================================
Total Revenue: ${metrics.totalRevenue.toLocaleString()} Ks
Average Ticket Size: ${metrics.avgTicket.toLocaleString()} Ks
Total Discounts Given: ${metrics.totalDiscount.toLocaleString()} Ks (${metrics.discountRatio})
Total Clients / Appointments: ${metrics.clientCount}

STAFF CONTRIBUTION LEADERBOARD:
${staffLeaderboardData.map((s, idx) => `${idx + 1}. ${s.name} (${s.role}) - Services: ${s.servicesCount} | Rev: ${s.revenueGenerated.toLocaleString()} Ks | Commission: ${s.commissionEarned.toLocaleString()} Ks`).join('\n')}
========================================
`;
 const blob = new Blob([reportData], { type: 'text/plain' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `Business_Analysis_${timeRange}_${new Date().toISOString().slice(0,10)}.txt`;
 a.click();
 URL.revokeObjectURL(url);
 };

 // Role Protection: Only Admin and Owner allowed!
 if (!isAdmin) {
 return <Navigate to="/appointments" replace />;
 }

 return (
 <div className="w-full px-3 py-4 md:p-6 space-y-3 pb-12 animate-in fade-in duration-300">
 
 {/* BUSINESS ANALYTICS CARD WITH EMBEDDED FILTERING & CUSTOM DATE RANGE */}
 <div className="bg-card border border-border rounded-2xl p-4 md:p-5 space-y-3">
 {/* Top Header Row */}
 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
 <div>
 <div className="flex flex-wrap items-center gap-2 mb-1">
 <span className="p-2 rounded-xl bg-primary/20 text-primary">
 <BarChart3 size={22} />
 </span>
 <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
 Business Analytics
</h1>
 <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black px-2.5 py-1 rounded-full border-emerald-500/20">
 <Sparkles size={12} /> Actual Live Firestore
 </span>
 </div>
 <p className="text-xs sm:text-sm text-muted-foreground font-medium">
 Real-time analytics computed directly from your POS transactions, appointments, and staff sales.
 </p>
 </div>

 <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-muted/60 px-3.5 py-2 rounded-xl shrink-0 self-start lg:self-auto shadow-2xs">
 <Calendar size={14} className="text-primary shrink-0" />
 <span>Selected Period: <strong className="text-foreground font-black">{periodLabel}</strong></span>
 </div>
 </div>

 {/* Date Range Filtering Controls Row inside the Card */}
 <div className=" border-slate-200/60 dark:-slate-700/50 pt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 min-w-0 max-w-full">
 <div className="flex items-center gap-2 text-xs font-black text-foreground shrink-0">
 <Filter size={15} className="text-primary shrink-0" />
 <span>Date Range Filtering:</span>
 </div>

 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-0 max-w-full">
 {/* Time Range Preset Selector */}
 <div className="flex items-center gap-1 bg-muted p-1 rounded-xl overflow-x-auto max-w-full whitespace-nowrap scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] min-w-0">
 {[
 { id: '7days', label: '7 Days' },
 { id: '30days', label: '30 Days' },
 { id: 'month', label: 'This Month' },
 { id: 'year', label: 'This Year' },
 { id: 'custom', label: 'Custom Range' }
 ].map(preset => (
 <button
 key={preset.id}
 onClick={() => setTimeRange(preset.id as any)}
 className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
 timeRange === preset.id 
 ? 'bg-primary text-primary-foreground shadow-xs font-extrabold' 
 : 'text-muted-foreground hover:text-foreground hover:bg-card'
 }`}
 >
 {preset.label}
 </button>
 ))}
 </div>

 <button
 onClick={handleExportReport}
 className="flex items-center justify-center gap-1.5 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-extrabold rounded-xl transition-all cursor-pointer active:scale-95 shrink-0 border-primary/20 shadow-2xs"
 title="Export Report"
 >
 <Download size={14} />
 <span className="inline">Export Report</span>
 </button>
 </div>
 </div>

 {/* Embedded Custom Analysis Date Range inside the Card */}
 {timeRange === 'custom' && (
 <div className="bg-muted/40 rounded-xl p-3.5 border-primary/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 min-w-0 max-w-full animate-in fade-in slide-in-from-top-1 duration-200">
 <div className="flex items-center gap-2 text-xs font-extrabold text-foreground shrink-0">
 <Calendar size={15} className="text-primary shrink-0" />
 <span>Custom Analysis Date Range:</span>
 </div>

 <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full sm:w-auto overflow-x-auto max-w-full min-w-0 pb-1 sm:pb-0">
 <div className="flex items-center gap-1.5 bg-card px-3 py-1.5 rounded-lg text-xs shadow-2xs shrink-0">
 <span className="text-muted-foreground font-semibold">From:</span>
 <input
 type="date"
 value={customStartDate}
 onChange={(e) => setCustomStartDate(e.target.value)}
 className="bg-transparent border-none text-foreground font-extrabold outline-none cursor-pointer"
 />
 </div>

 <div className="flex items-center gap-1.5 bg-card px-3 py-1.5 rounded-lg text-xs shadow-2xs shrink-0">
 <span className="text-muted-foreground font-semibold">To:</span>
 <input
 type="date"
 value={customEndDate}
 onChange={(e) => setCustomEndDate(e.target.value)}
 className="bg-transparent border-none text-foreground font-extrabold outline-none cursor-pointer"
 />
 </div>

 <span className="text-[11px] font-extrabold text-primary bg-primary/20 px-2.5 py-1 rounded-md border-primary/20 shrink-0 whitespace-nowrap">
 {periodLabel}
 </span>
 </div>
 </div>
 )}
 </div>

 {/* EMPTY SALES DATA NOTICE IF NEEDED */}
 {currentSales.length === 0 && !loading && (
 <div className="bg-primary/10 border-primary/20 rounded-2xl p-4 flex items-center gap-3 text-primary text-xs font-bold">
 <AlertCircle size={18} className="shrink-0" />
 <span>No sales transactions recorded in Firestore for the selected range ({timeRange}). New completed sales from POS will automatically populate this dashboard in real time.</span>
 </div>
 )}

 {/* SECTION A: OVERVIEW KPI CARDS */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-3 md:gap-5">
 
 {/* Card 1: Total Revenue */}
 <div className="bg-card border border-border rounded-2xl p-4 relative overflow-hidden group hover:bg-rose-50/50 dark:hover:bg-slate-800/90 transition-all">
 <div className="flex justify-between items-start mb-3">
 <div>
 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
 Total Revenue
 </p>
 <h3 className="text-2xl font-black text-foreground tracking-tight">
 {metrics.totalRevenue.toLocaleString()} <span className="text-xs font-extrabold text-muted-foreground">Ks</span>
 </h3>
 </div>
 <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
 <DollarSign size={20} />
 </div>
 </div>
 <div className="flex items-center justify-between text-xs pt-1 ">
 {(() => {
                  const val = metrics.revenueGrowthValue;
                  if (val > 0) {
                    return (
                      <span className="inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <TrendingUp size={12} /> +{val.toFixed(1)}%
                      </span>
                    );
                  } else if (val < 0) {
                    return (
                      <span className="inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 dark:text-rose-400">
                        <TrendingDown size={12} /> {val.toFixed(1)}%
                      </span>
                    );
                  } else {
                    return (
                      <span className="inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-500 dark:text-slate-400">
                        <Minus size={12} /> 0.0%
                      </span>
                    );
                  }
                })()}
 <span className="text-muted-foreground font-medium text-[11px]">vs previous period</span>
 </div>
 </div>

 {/* Card 2: Average Ticket Size */}
 <div className="bg-card border border-border rounded-2xl p-4 relative overflow-hidden group hover:bg-rose-50/50 dark:hover:bg-slate-800/90 transition-all">
 <div className="flex justify-between items-start mb-3">
 <div>
 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
 Avg Ticket Size
 </p>
 <h3 className="text-2xl font-black text-foreground tracking-tight">
 {metrics.avgTicket.toLocaleString()} <span className="text-xs font-extrabold text-muted-foreground">Ks</span>
 </h3>
 </div>
 <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
 <Receipt size={20} />
 </div>
 </div>
 <div className="flex items-center justify-between text-xs pt-1 ">
 {(() => {
                  const val = metrics.ticketGrowthValue;
                  if (val > 0) {
                    return (
                      <span className="inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <TrendingUp size={12} /> +{val.toFixed(1)}%
                      </span>
                    );
                  } else if (val < 0) {
                    return (
                      <span className="inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 dark:text-rose-400">
                        <TrendingDown size={12} /> {val.toFixed(1)}%
                      </span>
                    );
                  } else {
                    return (
                      <span className="inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-500 dark:text-slate-400">
                        <Minus size={12} /> 0.0%
                      </span>
                    );
                  }
                })()}
 <span className="text-muted-foreground font-medium text-[11px]">per transaction</span>
 </div>
 </div>

 {/* Card 3: Total Discounts Given */}
 <div className="bg-card border border-border rounded-2xl p-4 relative overflow-hidden group hover:bg-rose-50/50 dark:hover:bg-slate-800/90 transition-all">
 <div className="flex justify-between items-start mb-3">
 <div>
 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
 Discounts Given
 </p>
 <h3 className="text-2xl font-black text-foreground tracking-tight">
 {metrics.totalDiscount.toLocaleString()} <span className="text-xs font-extrabold text-muted-foreground">Ks</span>
 </h3>
 </div>
 <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
 <Percent size={20} />
 </div>
 </div>
 <div className="flex items-center justify-between text-xs pt-1 ">
 <span className="inline-flex items-center gap-1 text-primary font-extrabold bg-primary/10 px-2 py-0.5 rounded-md">
 {metrics.discountRatio} of total
 </span>
 <span className="text-muted-foreground font-medium text-[11px]">loyalty & promos</span>
 </div>
 </div>

 {/* Card 4: Clients Served / Active Appointments */}
 <div className="bg-card border border-border rounded-2xl p-4 relative overflow-hidden group hover:bg-rose-50/50 dark:hover:bg-slate-800/90 transition-all">
 <div className="flex justify-between items-start mb-3">
 <div>
 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
 Clients Served
 </p>
 <h3 className="text-2xl font-black text-foreground tracking-tight">
 {metrics.clientCount} <span className="text-xs font-extrabold text-muted-foreground">Clients</span>
 </h3>
 </div>
 <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
 <Users size={20} />
 </div>
 </div>
 <div className="flex items-center justify-between text-xs pt-1 ">
 {(() => {
                  const val = metrics.clientGrowthValue;
                  if (val > 0) {
                    return (
                      <span className="inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <TrendingUp size={12} /> +{val.toFixed(1)}%
                      </span>
                    );
                  } else if (val < 0) {
                    return (
                      <span className="inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 dark:text-rose-400">
                        <TrendingDown size={12} /> {val.toFixed(1)}%
                      </span>
                    );
                  } else {
                    return (
                      <span className="inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-500 dark:text-slate-400">
                        <Minus size={12} /> 0.0%
                      </span>
                    );
                  }
                })()}
 <span className="text-muted-foreground font-medium text-[11px]">active appointments</span>
 </div>
 </div>

 </div>

 {/* SECTION B: CORE VISUALIZATIONS (RECHARTS) */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
 
 {/* CHART 1: REVENUE TREND OVER TIME (AREA CHART) */}
 <div className="bg-card border border-border rounded-2xl p-4 md:p-5 flex flex-col justify-between">
 <div className="flex justify-between items-center mb-4">
 <div>
 <h3 className="text-base font-black text-foreground flex items-center gap-2">
 <TrendingUp size={18} className="text-primary" /> Revenue Growth Trend
 </h3>
 <p className="text-xs text-muted-foreground">Sales volume vs previous comparative period</p>
 </div>
 <span className="text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary px-2.5 py-1 rounded-lg">
 Area Graph
 </span>
 </div>

 <div className="h-64 sm:h-72 w-full pt-2">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
 <defs>
 <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
 <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0}/>
 </linearGradient>
 <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.2}/>
 <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0}/>
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted-foreground/40" />
 <XAxis 
 dataKey="name" 
 tick={{ fontSize: 10 }} 
 tickLine={false} 
 axisLine={false} 
 minTickGap={12} 
 interval="preserveStartEnd" 
 />
 <YAxis 
 tick={{ fontSize: 11 }} 
 tickLine={false} 
 axisLine={false} 
 tickFormatter={(v) => `${v >= 1000000 ? (v / 1000000).toFixed(1) + 'M' : (v / 1000).toFixed(0) + 'k'}`}
 />
 <Tooltip 
 formatter={(value: any) => [`${Number(value).toLocaleString()} Ks`, 'Revenue']}
 contentStyle={{ backgroundColor: 'var(--color-card, #1e293b)', borderColor: 'var(--color-border, #334155)', borderRadius: '12px', fontSize: '12px' }}
 />
 <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
 <Area type="monotone" dataKey="revenue" name="Current Revenue" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
 <Area type="monotone" dataKey="previous" name="Prev Period" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorPrev)" />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* CHART 2: PAYMENT METHODS BREAKDOWN (DONUT CHART) */}
 <div className="bg-card border border-border rounded-2xl p-4 md:p-5 flex flex-col justify-between">
 <div className="flex justify-between items-center mb-4">
 <div>
 <h3 className="text-base font-black text-foreground flex items-center gap-2">
 <PieChartIcon size={18} className="text-primary" /> Payment Method Share
 </h3>
 <p className="text-xs text-muted-foreground">Distribution across digital payment providers & cash</p>
 </div>
 <span className="text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary px-2.5 py-1 rounded-lg">
 Donut Chart
 </span>
 </div>

 <div className="h-64 sm:h-72 w-full flex items-center justify-center relative">
 <ResponsiveContainer width="100%" height="100%">
 <PieChart>
 <Pie
 data={paymentBreakdownData}
 cx="50%"
 cy="50%"
 innerRadius={65}
 outerRadius={95}
 paddingAngle={5}
 dataKey="value"
 >
 {paymentBreakdownData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
 ))}
 </Pie>
 <Tooltip 
 formatter={(value: any) => [`${Number(value).toLocaleString()} Ks`, 'Amount']}
 contentStyle={{ backgroundColor: 'var(--color-card, #1e293b)', borderColor: 'var(--color-border, #334155)', borderRadius: '12px', fontSize: '12px' }}
 />
 <Legend 
 layout="horizontal" 
 align="center" 
 verticalAlign="bottom" 
 iconType="circle" 
 wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} 
 />
 </PieChart>
 </ResponsiveContainer>
 </div>
 </div>

  {/* CHART 3A: TOP-SELLING SERVICES BY REVENUE (HORIZONTAL BAR CHART) */}
 <div className="bg-card border border-border rounded-2xl p-4 md:p-5 flex flex-col justify-between">
 <div className="flex justify-between items-center mb-4">
 <div>
 <h3 className="text-base font-black text-foreground flex items-center gap-2">
 <Award size={18} className="text-primary" /> Top Services by Revenue
 </h3>
 <p className="text-xs text-muted-foreground">Most requested nail treatments by revenue volume</p>
 </div>
 <span className="text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary px-2.5 py-1 rounded-lg">
 Horizontal Bar
 </span>
 </div>

 <div className="h-64 sm:h-72 w-full pt-2">
 {topServicesByRevenue.length === 0 ? (
 <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
 <p className="text-xs font-bold">No services sold yet in this period.</p>
 </div>
 ) : (
 <ResponsiveContainer width="100%" height="100%">
 <BarChart 
 layout="vertical" 
 data={topServicesByRevenue} 
 margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
 >
 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-muted-foreground/40" />
 <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v >= 1000000 ? (v/1000000).toFixed(1) + 'M' : (v/1000).toFixed(0) + 'k'}`} />
 <YAxis 
 dataKey="name" 
 type="category" 
 tick={{ fontSize: 11, fontWeight: 700 }} 
 axisLine={false} 
 tickLine={false} 
 width={130}
 />
 <Tooltip 
 formatter={(value: any) => [`${Number(value).toLocaleString()} Ks`, 'Revenue']}
 contentStyle={{ backgroundColor: 'var(--color-card, #1e293b)', borderColor: 'var(--color-border, #334155)', borderRadius: '12px', fontSize: '12px' }}
 />
 <Bar dataKey="revenue" name="Revenue (Ks)" fill="#10B981" radius={[0, 8, 8, 0]} />
 </BarChart>
 </ResponsiveContainer>
 )}
 </div>
 </div>

 {/* CHART 3B: TOP-SELLING SERVICES BY USAGE (HORIZONTAL BAR CHART) */}
 <div className="bg-card border border-border rounded-2xl p-4 md:p-5 flex flex-col justify-between">
 <div className="flex justify-between items-center mb-4">
 <div>
 <h3 className="text-base font-black text-foreground flex items-center gap-2">
 <Award size={18} className="text-primary" /> Top Services by Usage
 </h3>
 <p className="text-xs text-muted-foreground">Most requested nail treatments by customer usage</p>
 </div>
 <span className="text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary px-2.5 py-1 rounded-lg">
 Horizontal Bar
 </span>
 </div>

 <div className="h-64 sm:h-72 w-full pt-2">
 {topServicesByUsage.length === 0 ? (
 <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
 <p className="text-xs font-bold">No services sold yet in this period.</p>
 </div>
 ) : (
 <ResponsiveContainer width="100%" height="100%">
 <BarChart 
 layout="vertical" 
 data={topServicesByUsage} 
 margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
 >
 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-muted-foreground/40" />
 <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
 <YAxis 
 dataKey="name" 
 type="category" 
 tick={{ fontSize: 11, fontWeight: 700 }} 
 axisLine={false} 
 tickLine={false} 
 width={130}
 />
 <Tooltip 
 formatter={(value: any) => [value, 'Count']}
 contentStyle={{ backgroundColor: 'var(--color-card, #1e293b)', borderColor: 'var(--color-border, #334155)', borderRadius: '12px', fontSize: '12px' }}
 />
 <Bar dataKey="count" name="Count" fill="#3B82F6" radius={[0, 8, 8, 0]} />
 </BarChart>
 </ResponsiveContainer>
 )}
 </div>
 </div>

 {/* CHART 4: HOURLY TRAFFIC & PEAK HOURS (COLUMN CHART) */}
 <div className="bg-card border border-border rounded-2xl p-4 md:p-5 flex flex-col justify-between lg:col-span-2">
 <div className="flex justify-between items-center mb-4">
 <div>
 <h3 className="text-base font-black text-foreground flex items-center gap-2">
 <Clock size={18} className="text-primary" /> Peak Hour Foot Traffic
 </h3>
 <p className="text-xs text-muted-foreground">Hourly client count distribution for shift scheduling</p>
 </div>
 <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg">
 Traffic Peak
 </span>
 </div>

 <div className="h-64 sm:h-72 w-full pt-2">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={hourlyTrafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted-foreground/40" />
 <XAxis dataKey="hour" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
 <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
 <Tooltip 
 formatter={(value: any) => [`${value} Clients`, 'Visits']}
 contentStyle={{ backgroundColor: 'var(--color-card, #1e293b)', borderColor: 'var(--color-border, #334155)', borderRadius: '12px', fontSize: '12px' }}
 />
 <Bar dataKey="clients" name="Clients" radius={[6, 6, 0, 0]}>
 {hourlyTrafficData.map((entry, index) => (
 <Cell 
 key={`cell-traffic-${index}`} 
 fill={entry.isPeak ? '#D4AF37' : '#3B82F6'} 
 />
 ))}
 </Bar>
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

 </div>

 {/* SECTION C: STAFF LEADERBOARD & COMMISSION TABLE */}
 <div className="bg-card border border-border rounded-2xl overflow-hidden">
 
 {/* Table Header & Controls */}
 <div className="p-4 border-slate-200/60 dark:-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div>
 <h3 className="text-base font-black text-foreground flex items-center gap-2">
 <Star size={18} className="text-primary fill-primary" /> Staff Leaderboard & Commission Tracker
 </h3>
 <p className="text-xs text-muted-foreground">
 Individual staff contribution, service volume, and commission earnings calculated from live sales.
 </p>
 </div>

 <div className="flex items-center gap-2.5">
 {/* Search Input */}
 <div className="relative flex-1 sm:w-56">
 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
 <input
 type="text"
 placeholder="Search staff..."
 value={staffSearch}
 onChange={(e) => setStaffSearch(e.target.value)}
 className="w-full bg-input border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground focus:border-primary outline-none"
 />
 </div>

 {/* Sort Dropdown */}
 <select
 value={sortBy}
 onChange={(e) => setSortBy(e.target.value as any)}
 className="bg-input border border-border rounded-xl px-3 py-1.5 text-xs font-bold text-foreground outline-none cursor-pointer"
 >
 <option value="revenue">Sort by Revenue</option>
 <option value="commission">Sort by Commission</option>
 <option value="services">Sort by Services</option>
 </select>
 </div>
 </div>

 {/* Data Table */}
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-muted/40 text-[10px] uppercase tracking-widest font-black text-muted-foreground">
 <th className="py-3.5 px-3 md:px-5">Rank & Staff Member</th>
 <th className="py-3.5 px-4 text-center">Services Done</th>
 <th className="py-3.5 px-4 text-right">Revenue Generated</th>
 <th className="py-3.5 px-4 text-right">Commission Earned</th>
 <th className="py-3.5 px-3 md:px-5 text-right">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border/40 text-xs font-medium">
 {staffLeaderboardData.length === 0 ? (
 <tr>
 <td colSpan={5} className="text-center py-4 md:py-8 text-muted-foreground font-bold">
 No staff records found for the selected filter.
 </td>
 </tr>
 ) : (
 staffLeaderboardData.map((staff, idx) => (
 <tr key={staff.name + idx} className="hover:bg-muted/30 transition-colors">
 
 {/* Rank & Staff Info */}
 <td className="py-4 px-3 md:px-5">
 <div className="flex items-center gap-3">
 <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] shrink-0 ${
 idx === 0 
 ? 'bg-primary text-white ' 
 : idx === 1 
 ? 'bg-slate-300 text-slate-800' 
 : idx === 2 
 ? 'bg-primary/80 text-white' 
 : 'bg-muted text-muted-foreground'
 }`}>
 {idx + 1}
 </span>
 <div>
 <p className="font-extrabold text-foreground text-sm leading-tight flex items-center gap-1.5">
 {staff.name}
 {idx === 0 && <Award size={14} className="text-primary inline shrink-0" />}
 </p>
 <p className="text-[10px] text-muted-foreground font-semibold">{staff.role}</p>
 </div>
 </div>
 </td>

 {/* Services Count */}
 <td className="py-4 px-4 text-center font-bold text-foreground">
 <span className="bg-muted/60 px-2.5 py-1 rounded-lg text-xs font-extrabold">
 {staff.servicesCount} jobs
 </span>
 </td>

 {/* Total Revenue */}
 <td className="py-4 px-4 text-right font-black text-foreground text-sm">
 {staff.revenueGenerated.toLocaleString()} <span className="text-[10px] text-muted-foreground font-bold">Ks</span>
 </td>

 {/* Commission Earned */}
 <td className="py-4 px-4 text-right font-black text-emerald-600 dark:text-emerald-400 text-sm">
 {staff.commissionEarned.toLocaleString()} <span className="text-[10px] text-emerald-600/70 font-bold">Ks</span>
 </td>

 {/* Performance Badge */}
 <td className="py-4 px-3 md:px-5 text-right">
 <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black ${
 idx === 0 
 ? 'bg-primary/10 text-primary border-primary/30 ' 
 : staff.servicesCount > 0 
 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400' 
 : 'bg-muted text-muted-foreground '
 }`}>
 {idx === 0 ? 'Top Performer' : staff.servicesCount > 0 ? 'Active' : 'No Sales'}
 </span>
 </td>

 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>

 </div>

 </div>
 );
};

export default BusinessAnalysisPage;
