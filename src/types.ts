export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  category?: string;
  duration?: number; // duration in minutes
}

export interface CartItem extends Service {
  qty: number;
  disP: number;
}

export interface Sale {
  id: string;
  date: string;
  dateTime: string;
  staff: string;
  staffEmail: string;
  customerName?: string;
  customerPhone?: string;
  total: number;
  payments: {
    method: 'Cash' | 'KBZPay' | 'WavePay' | 'AYA Pay' | 'CB PAY' | 'OK$';
    amount: number;
  }[];
  method?: string; // Kept for backward compatibility during transition
  commission: number;
  pointsEarned?: number;
  pointsRedeemed?: number;
  items: {
    name: string;
    qty: number;
    price: number;
    disP: number;
  }[];
}

export interface Expense {
  id: string;
  date: string;
  desc: string;
  amount: number;
  category?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
}

export interface UserProfile {
  id?: string;
  uid?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'super_admin' | 'owner' | 'cashier' | 'staff' | 'customer';
  roles?: string[]; // Multiple roles support
  commission: number;
  points?: number;
  mustChangePassword?: boolean;
  dob?: string;
  last4Digits?: string;
  status?: 'active' | 'inactive' | 'on_leave' | 'deleted';
  photoURL?: string;
  bio?: string;
  specialties?: string[]; // Array of service IDs or category names
  workingDays?: string[]; // e.g., ['Monday', 'Tuesday', ...]
  rating?: number;
  totalSalesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  details: any;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

export interface ShopSettings {
  name: string;
  addr: string;
  ph: string;
  receiptHeader?: string;
  receiptFooter?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  points: number;
  createdAt: string;
}

export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  customerId?: string;
  serviceName: string;
  serviceId?: string;
  staffName?: string;
  staffEmail?: string;
  date: string;
  time: string;
  endTime?: string;
  duration?: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  pointsToRedeem?: number;
  willEarnPoints?: number;
  pointsProcessed?: boolean;
  isHomeService?: boolean;
  createdAt: string;
  creatorName?: string;
  creatorEmail?: string;
}
