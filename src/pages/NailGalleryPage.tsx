import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../AppCore';
import { db, OperationType, handleFirestoreError } from '../firebase';
import { 
  collection, where, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { Product, Order } from '../types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Sparkles, 
  Image as ImageIcon,
  Tag,
  DollarSign,
  PackageOpen,
  Scissors
, ShoppingBag, Minus, CheckCircle, CreditCard, Truck, Store, MapPin, Phone, User, ChevronLeft , Copy, Check, ZoomIn } from 'lucide-react';
import { Modal } from '../components/Modal';
import { CustomSelect } from '../components/CustomSelect';
import { cn } from '../lib/utils';

const STATUS_COLORS = {
  'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
  'Confirmed': 'bg-blue-100 text-blue-700 border-blue-200',
  'In Production': 'bg-purple-100 text-purple-700 border-purple-200',
  'Ready for Delivery': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Cancelled': 'bg-rose-100 text-rose-700 border-rose-200'
};

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'In Production', 'Ready for Delivery', 'Completed', 'Cancelled'];


export const NailGalleryPage: React.FC = () => {
  const { isCustomer } = useAuth();
  
  if (isCustomer) {
    return <GalleryShopView />;
  }
  
  return <AdminGalleryWrapper />;
};

const AdminGalleryWrapper = () => {
  const [activeTab, setActiveTab] = useState<'products'|'orders'|'payments'>('products');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 [.midnight_&]:text-amber-400">
            Nail Gallery Admin
          </h1>
        </div>
        <div className="flex bg-muted/50 p-1 rounded-xl overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button 
            onClick={() => setActiveTab('products')} 
            className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", activeTab === 'products' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}
          >
            Designs
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", activeTab === 'orders' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}
          >
            Orders
          </button>
          <button 
            onClick={() => setActiveTab('payments')} 
            className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", activeTab === 'payments' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}
          >
            Payments
          </button>
        </div>
      </div>
      {activeTab === 'products' ? <AdminGalleryProductsTab /> : activeTab === 'orders' ? <AdminGalleryOrdersTab /> : <AdminGalleryPaymentsTab />}
    </div>
  );
};
const CATEGORIES = ["All", "Luxury", "Minimal", "Wedding", "Y2K", "Ready-to-Ship"];


const DIGITAL_WALLETS: Record<string, {name: string, accountName: string, phone: string, qrCode: string, color: string}> = {
  'KBZPay': {
    name: 'KBZPay',
    accountName: 'Nail Pro Studio',
    phone: '09123456789',
    qrCode: 'https://placehold.co/400x400/003478/FFF?text=KBZPay+QR',
    color: 'text-[#003478]'
  },
  'AYA Pay': {
    name: 'AYA Pay',
    accountName: 'Nail Pro Studio',
    phone: '09987654321',
    qrCode: 'https://placehold.co/400x400/E31837/FFF?text=AYA+Pay+QR',
    color: 'text-[#E31837]'
  },
  'WavePay': {
    name: 'WavePay',
    accountName: 'Nail Pro Studio',
    phone: '09555555555',
    qrCode: 'https://placehold.co/400x400/FFB81C/000?text=WavePay+QR',
    color: 'text-[#FFB81C]'
  },
  'CB Pay': {
    name: 'CB Pay',
    accountName: 'Nail Pro Studio',
    phone: '09777777777',
    qrCode: 'https://placehold.co/400x400/0055A5/FFF?text=CB+Pay+QR',
    color: 'text-[#0055A5]'
  },
  'OK$': {
    name: 'OK$',
    accountName: 'Nail Pro Studio',
    phone: '09888888888',
    qrCode: 'https://placehold.co/400x400/F04E23/FFF?text=OK$+QR',
    color: 'text-[#F04E23]'
  }
};

const GalleryShopView = () => {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [dynamicWallets, setDynamicWallets] = useState<Record<string, any>>(DIGITAL_WALLETS);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'payment_methods'), (snap) => {
      if (snap.exists()) {
        setDynamicWallets(snap.data());
      }
    });
    return () => unsub();
  }, []);

  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const location = useLocation();
  const [customerTab, setCustomerTab] = useState<'gallery'|'orders'>((location.state as any)?.tab || 'gallery');
  useEffect(() => {
    if ((location.state as any)?.tab) {
       setCustomerTab((location.state as any).tab);
    }
  }, [location.state]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // Product Details Modal State
  const [selectedShape, setSelectedShape] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  
  const [customNailSizes, setCustomNailSizes] = useState({ thumb: '', index: '', middle: '', ring: '', pinky: '' });

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'home' | 'pickup'>('home');
  const [address, setAddress] = useState('');
  const [paymentCategory, setPaymentCategory] = useState<'digital' | 'cod'>('digital');
  const [digitalPaymentMethod, setDigitalPaymentMethod] = useState('KBZPay');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [previewQr, setPreviewQr] = useState<string | null>(null);

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const filteredProducts = products.filter(p => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Ready-to-Ship") return p.isReadyToShip;
    return p.category.toLowerCase() === activeCategory.toLowerCase();
  });

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'products'));
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (profile) {
      setCustomerName(profile.name || '');
      setCustomerPhone(profile.phone || '');
    }
  }, [profile]);

  useEffect(() => {
    if (customerTab === 'orders' && user) {
      setLoadingOrders(true);
      const q = query(collection(db, 'orders'), where('customerId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const my = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        my.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setMyOrders(my);
        setLoadingOrders(false);
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders'));
      return unsubscribe;
    }
  }, [customerTab, user, profile]);

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedShape(product.shapesAvailable?.[0] || '');
    setSelectedSize(product.sizesAvailable?.[0] || '');
    setQuantity(1);
    setCustomNailSizes({ thumb: '', index: '', middle: '', ring: '', pinky: '' });
  };

  const handleBuyNow = () => {
    if (!selectedShape || !selectedSize) return;
    if (selectedSize === 'Custom' && (!customNailSizes.thumb || !customNailSizes.index || !customNailSizes.middle || !customNailSizes.ring || !customNailSizes.pinky)) {
      return; // Add basic validation handled in UI too
    }
    setIsCheckoutOpen(true);
  };

  const submitOrder = async () => {
    if (!selectedProduct) return;
    if (!customerName || !customerPhone || (deliveryType === 'home' && !address)) return;
    
    setIsPlacingOrder(true);
    try {
      const orderData = {
        customerId: user?.uid || 'guest',
        customerName,
        phone: customerPhone,
        customerEmail: user?.email || '',
        items: [{
          productId: selectedProduct.id,
          title: selectedProduct.title,
          shape: selectedShape,
          size: selectedSize,
          ...(selectedSize === 'Custom' ? { customNailSizes } : {}),
          quantity,
          price: selectedProduct.price
        }],
        deliveryType,
        address: deliveryType === 'home' ? address : 'Salon Pickup',
        paymentMethod: paymentCategory === 'cod' ? 'Cash on Delivery' : `Digital Pay - ${digitalPaymentMethod}`,
        totalAmount: selectedProduct.price * quantity,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setPlacedOrderId(docRef.id);
      setOrderSuccess(true);
    } catch (error) {
      console.error("Failed to place order:", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setOrderSuccess(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm font-bold text-muted-foreground">Loading Gallery...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 pt-4 sm:pt-6 lg:px-8 pb-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 [.midnight_&]:text-amber-400 flex items-center gap-2">
            <Sparkles className="text-primary" size={24} />
            Gallery & Shop
          </h1>
          <p className="text-xs font-medium text-muted-foreground mt-1">
            Discover our latest designs
          </p>
        </div>
        
        {user && (
          <div className="flex bg-muted/50 p-1 rounded-xl shrink-0">
             <button 
               onClick={() => setCustomerTab('gallery')} 
               className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", customerTab === 'gallery' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}
             >
               Shop
             </button>
             <button 
               onClick={() => setCustomerTab('orders')} 
               className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", customerTab === 'orders' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}
             >
               My Orders
             </button>
          </div>
        )}
      </div>

      {customerTab === 'orders' ? (
        <div className="space-y-4">
           {loadingOrders ? (
             <div className="flex flex-col items-center justify-center h-40">
               <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
             </div>
           ) : myOrders.length === 0 ? (
             <div className="text-center py-20 bg-card border border-dashed border-border rounded-2xl">
                <ShoppingBag size={40} className="mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-base font-bold text-foreground">No orders yet</h3>
                <p className="text-sm text-muted-foreground mt-2">Your placed orders will appear here.</p>
             </div>
           ) : (
             <div className="grid gap-4 md:grid-cols-2">
                {myOrders.map(order => (
                   <div key={order.id} className="bg-card border border-border rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3 border-b border-border pb-3">
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-xs text-muted-foreground mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                         </div>
                         <div className={cn("px-2 py-1 rounded-md text-[10px] font-bold border whitespace-nowrap", STATUS_COLORS[order.status] || 'bg-muted')}>
                            {order.status}
                         </div>
                      </div>
                      <div className="space-y-2 mb-3">
                         {order.items.map((item, idx) => (
                            <div key={idx} className="flex flex-col gap-1">
                               <div className="flex justify-between text-sm">
                                  <span>{item.quantity}x {item.title}</span>
                                  <span className="font-bold">{(item.price * item.quantity).toLocaleString()} Ks</span>
                               </div>
                               <span className="text-[10px] text-muted-foreground">Shape: {item.shape} • Size: {item.size}</span>
                               {item.size === 'Custom' && item.customNailSizes && (
                                  <span className="text-[9px] text-muted-foreground">T:{item.customNailSizes.thumb} I:{item.customNailSizes.index} M:{item.customNailSizes.middle} R:{item.customNailSizes.ring} P:{item.customNailSizes.pinky}</span>
                               )}
                            </div>
                         ))}
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-border">
                         <span className="text-xs font-bold text-muted-foreground">Total</span>
                         <span className="text-sm font-black text-primary">{order.totalAmount.toLocaleString()} Ks</span>
                      </div>
                   </div>
                ))}
             </div>
           )}
        </div>
      ) : (
        <>
      <div className="flex overflow-x-auto custom-scrollbar pb-2 mb-6 gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
              activeCategory === cat 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-card text-muted-foreground border-border hover:bg-muted"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {filteredProducts.map(product => (
          <motion.div 
            key={product.id}
            whileHover={{ y: -2 }}
            onClick={() => handleOpenProduct(product)}
            className="bg-card border border-amber-200/40 [.midnight_&]:border-amber-500/20 rounded-xl overflow-hidden shadow-sm flex flex-col group cursor-pointer"
          >
            <div className="aspect-[3/4] bg-muted/30 relative overflow-hidden flex items-center justify-center">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0]} 
                  alt={product.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <ImageIcon className="text-muted-foreground/30 w-12 h-12" />
              )}
              {product.isReadyToShip && (
                <div className="absolute top-2 right-2 bg-green-500/90 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-lg">
                  RTS
                </div>
              )}
            </div>
            
            <div className="p-3 sm:p-4 flex-1 flex flex-col">
              <div className="flex flex-col gap-1 mb-2">
                <h3 className="font-bold text-foreground text-sm line-clamp-1">{product.title}</h3>
                <span className="text-xs font-black text-primary">
                  {product.price.toLocaleString()} Ks
                </span>
              </div>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                {product.category}
              </span>
              
              <div className="mt-auto pt-2">
                 <button className="w-full py-2 bg-primary/10 group-hover:bg-primary text-primary group-hover:text-primary-foreground font-black text-[10px] uppercase tracking-widest rounded-lg transition-colors text-center border border-primary/20">
                    View Details
                 </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-card border border-dashed border-border rounded-2xl">
          <Sparkles size={40} className="mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-base font-bold text-foreground">No designs available</h3>
          <p className="text-sm text-muted-foreground mt-2">We couldn't find any designs in the "{activeCategory}" category.</p>
        </div>
      )}

      {/* Product Details Modal */}
      <Modal 
        isOpen={!!selectedProduct && !isCheckoutOpen} 
        onClose={() => setSelectedProduct(null)}
        title="Design Details"
        maxWidth="max-w-xl"
      >
        {selectedProduct && (
          <div className="space-y-6">
             <div className="aspect-square sm:aspect-video rounded-xl overflow-hidden bg-muted/30">
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <img 
                    src={selectedProduct.images[0]} 
                    alt={selectedProduct.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                     <ImageIcon className="text-muted-foreground/30 w-16 h-16" />
                  </div>
                )}
             </div>
             
             <div>
                 <div className="flex justify-between items-start mb-2">
                   <div>
                     <h3 className="text-2xl font-bold text-foreground tracking-tight">{selectedProduct.title}</h3>
                     <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{selectedProduct.category}</p>
                   </div>
                   <span className="text-lg font-black text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                     {selectedProduct.price.toLocaleString()} Ks
                   </span>
                 </div>
                 {selectedProduct.isReadyToShip && (
                    <div className="inline-flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-500/10 px-2 py-1 rounded-md uppercase tracking-widest mt-2">
                       Ready to Ship
                    </div>
                 )}
             </div>
             
             <div className="text-sm text-foreground/80 leading-relaxed">
               {selectedProduct.description || "No description provided."}
             </div>
             
             {selectedProduct.shapesAvailable && selectedProduct.shapesAvailable.length > 0 && (
               <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                     <Scissors size={14} className="text-primary"/> Select Shape
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                     {selectedProduct.shapesAvailable.map(shape => (
                        <button 
                           key={shape}
                           onClick={() => setSelectedShape(shape)}
                           className={cn(
                             "text-xs px-2 py-3 border rounded-xl font-bold transition-all text-center",
                             selectedShape === shape ? "bg-primary/10 border-primary text-primary shadow-sm" : "bg-card border-border text-muted-foreground hover:bg-muted"
                           )}
                        >
                          {shape}
                        </button>
                     ))}
                  </div>
               </div>
             )}
             
             {selectedProduct.sizesAvailable && selectedProduct.sizesAvailable.length > 0 && (
               <div className="space-y-3">
                  <div className="flex items-center justify-between">
                     <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                        <PackageOpen size={14} className="text-primary"/> Select Size
                     </h4>
                     <button onClick={() => setShowSizeGuide(true)} className="text-[10px] text-primary font-bold underline">How to Measure Your Nails</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {selectedProduct.sizesAvailable.includes('Custom') ? selectedProduct.sizesAvailable.map(size => (
                        <button 
                           key={size}
                           onClick={() => setSelectedSize(size)}
                           className={cn(
                             "flex-1 min-w-[60px] text-xs py-3 border rounded-xl font-bold transition-all text-center",
                             selectedSize === size ? "bg-primary/10 border-primary text-primary shadow-sm" : "bg-card border-border text-muted-foreground hover:bg-muted"
                           )}
                        >
                          {size}
                        </button>
                     )) : [...selectedProduct.sizesAvailable, 'Custom'].map(size => (
                        <button 
                           key={size}
                           onClick={() => setSelectedSize(size)}
                           className={cn(
                             "flex-1 min-w-[60px] text-xs py-3 border rounded-xl font-bold transition-all text-center",
                             selectedSize === size ? "bg-primary/10 border-primary text-primary shadow-sm" : "bg-card border-border text-muted-foreground hover:bg-muted"
                           )}
                        >
                          {size}
                        </button>
                     ))}
                  </div>
                  
                  {/* Custom Size Input Form */}
                  <AnimatePresence>
                     {selectedSize === 'Custom' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                           <div className="bg-muted/30 p-4 rounded-xl border border-border mt-3 space-y-3">
                              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest text-center mb-1">Enter your measurements (mm) or tip sizes</p>
                              <div className="grid grid-cols-5 gap-2">
                                 {['thumb', 'index', 'middle', 'ring', 'pinky'].map((finger) => (
                                    <div key={finger} className="flex flex-col gap-1 items-center">
                                       <label className="text-[9px] font-bold text-foreground capitalize">{finger}</label>
                                       <input 
                                          type="text"
                                          maxLength={4}
                                          value={(customNailSizes as any)[finger]}
                                          onChange={e => setCustomNailSizes({...customNailSizes, [finger]: e.target.value})}
                                          className="w-full text-center bg-input border border-border rounded-lg py-2 text-xs font-bold outline-none focus:border-primary transition-all"
                                          placeholder="15"
                                       />
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
             )}
             
             <div className="space-y-3">
                <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest">Quantity</h4>
                <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-xl w-32 justify-between border border-border">
                   <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 bg-card rounded-lg shadow-sm hover:text-primary transition-colors"><Minus size={14} /></button>
                   <span className="font-bold text-sm">{quantity}</span>
                   <button onClick={() => setQuantity(quantity + 1)} className="p-2 bg-card rounded-lg shadow-sm hover:text-primary transition-colors"><Plus size={14} /></button>
                </div>
             </div>
             
             <div className="pt-4 border-t border-border">
                <button 
                   onClick={handleBuyNow}
                   disabled={!selectedShape || !selectedSize || (selectedSize === 'Custom' && (!customNailSizes.thumb || !customNailSizes.index || !customNailSizes.middle || !customNailSizes.ring || !customNailSizes.pinky))}
                   className="w-full py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm rounded-xl hover:brightness-110 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                   <ShoppingBag size={18} /> Buy Now - {(selectedProduct.price * quantity).toLocaleString()} Ks
                </button>
                {(!selectedShape || !selectedSize) && (
                   <p className="text-center text-[10px] text-red-500 mt-2 font-bold">Please select shape and size</p>
                )}
             </div>
          </div>
        )}
      </Modal>
      
      {/* Size Guide Popover / Modal (Nested within logic visually) */}
      <Modal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} title="How to Measure" maxWidth="max-w-md">
         <div className="space-y-4 text-sm text-foreground">
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex gap-4 items-start">
               <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">1</div>
               <div>
                  <h4 className="font-bold">Place tape over your nail</h4>
                  <p className="text-muted-foreground text-xs mt-1">Place a piece of clear tape across the widest part of your nail bed and press down into the sidewalls.</p>
               </div>
            </div>
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex gap-4 items-start">
               <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">2</div>
               <div>
                  <h4 className="font-bold">Mark the edges</h4>
                  <p className="text-muted-foreground text-xs mt-1">Use a fine-tip pen to mark the exact edges (sidewalls) of your nail on the tape.</p>
               </div>
            </div>
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex gap-4 items-start">
               <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">3</div>
               <div>
                  <h4 className="font-bold">Measure the distance</h4>
                  <p className="text-muted-foreground text-xs mt-1">Remove the tape, place it flat on a ruler, and measure the distance between the two marks in millimeters (mm).</p>
               </div>
            </div>
            
            <ul className="space-y-2 bg-muted/30 p-4 rounded-xl border border-border mt-2">
               <li className="flex justify-between font-bold text-xs uppercase tracking-widest text-muted-foreground"><span>Standard Size</span><span>Thumb-to-Pinky (mm)</span></li>
               <li className="flex justify-between font-medium border-t border-border pt-2"><span>XS</span><span>14, 10, 11, 10, 7</span></li>
               <li className="flex justify-between font-medium"><span>S</span><span>15, 11, 12, 11, 8</span></li>
               <li className="flex justify-between font-medium"><span>M</span><span>16, 12, 13, 12, 9</span></li>
               <li className="flex justify-between font-medium"><span>L</span><span>18, 13, 14, 13, 10</span></li>
            </ul>
            <button onClick={() => setShowSizeGuide(false)} className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-widest text-sm mt-4 hover:brightness-110 shadow-lg shadow-primary/20">Got it</button>
         </div>
      </Modal>

      </>
      )}

      {/* Checkout Drawer/Modal */}
      <Modal 
        isOpen={isCheckoutOpen} 
        onClose={closeCheckout}
        title={orderSuccess ? "Order Placed" : "Checkout"}
        maxWidth="max-w-md"
      >
        <AnimatePresence mode="wait">
        {orderSuccess ? (
           <motion.div 
             key="success"
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="flex flex-col items-center justify-center py-10 text-center"
           >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                 <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-black text-foreground mb-2">Order Confirmed!</h2>
              <p className="text-muted-foreground text-sm mb-8">
                 Your order #{placedOrderId.slice(0, 6).toUpperCase()} has been placed successfully. We'll contact you shortly.
              </p>
              <button 
                 onClick={closeCheckout}
                 className="w-full py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20"
              >
                 Return to Gallery
              </button>
           </motion.div>
        ) : (
           <motion.div 
             key="form"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="space-y-6"
           >
              {/* Order Summary */}
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-start gap-4">
                 <div className="w-16 h-20 rounded-lg overflow-hidden bg-muted/30 shrink-0">
                   {selectedProduct?.images?.[0] ? (
                     <img src={selectedProduct.images[0]} className="w-full h-full object-cover" alt="" />
                   ) : <ImageIcon className="w-full h-full p-4 text-muted-foreground/30" />}
                 </div>
                 <div className="flex-1">
                    <h4 className="font-bold text-sm line-clamp-1">{selectedProduct?.title}</h4>
                    <p className="text-[10px] text-muted-foreground mt-1">Shape: <span className="font-bold text-foreground">{selectedShape}</span> • Size: <span className="font-bold text-foreground">{selectedSize}</span></p>
                    {selectedSize === 'Custom' && (
                       <p className="text-[9px] text-muted-foreground mt-0.5">T:{customNailSizes.thumb} I:{customNailSizes.index} M:{customNailSizes.middle} R:{customNailSizes.ring} P:{customNailSizes.pinky}</p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                       <span className="text-xs font-bold">{quantity}x</span>
                       <span className="text-sm font-black text-primary">{((selectedProduct?.price || 0) * quantity).toLocaleString()} Ks</span>
                    </div>
                 </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-2 border-b border-border pb-2">
                    <User size={14} className="text-primary" /> Contact Details
                 </h3>
                 <div className="grid grid-cols-2 gap-3">
                    <div>
                       <label className="text-[10px] font-bold text-muted-foreground ml-1">Name</label>
                       <input 
                         type="text" 
                         value={customerName}
                         onChange={e => setCustomerName(e.target.value)}
                         className="w-full mt-1 bg-input border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
                         placeholder="Jane Doe"
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-muted-foreground ml-1">Phone</label>
                       <input 
                         type="tel" 
                         value={customerPhone}
                         onChange={e => setCustomerPhone(e.target.value)}
                         className="w-full mt-1 bg-input border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
                         placeholder="09..."
                       />
                    </div>
                 </div>
              </div>

              {/* Delivery Option */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-2 border-b border-border pb-2">
                    <Truck size={14} className="text-primary" /> Delivery Method
                 </h3>
                 <div className="flex gap-3">
                    <button 
                       onClick={() => setDeliveryType('home')}
                       className={cn("flex-1 py-3 px-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-2 transition-all", deliveryType === 'home' ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-border text-muted-foreground')}
                    >
                       <Truck size={18} /> Home Delivery
                    </button>
                    <button 
                       onClick={() => setDeliveryType('pickup')}
                       className={cn("flex-1 py-3 px-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-2 transition-all", deliveryType === 'pickup' ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-border text-muted-foreground')}
                    >
                       <Store size={18} /> Salon Pickup
                    </button>
                 </div>
                 
                 {deliveryType === 'home' && (
                    <div className="animate-in slide-in-from-top-2">
                       <label className="text-[10px] font-bold text-muted-foreground ml-1 flex items-center gap-1"><MapPin size={10} /> Full Address</label>
                       <textarea 
                         value={address}
                         onChange={e => setAddress(e.target.value)}
                         className="w-full mt-1 bg-input border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary resize-none h-16"
                         placeholder="Street, Township, City"
                       />
                    </div>
                 )}
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-2 border-b border-border pb-2">
                    <CreditCard size={14} className="text-primary" /> Payment Method
                 </h3>
                 
                 <div className="flex gap-3">
                    <button 
                       onClick={() => setPaymentCategory('digital')}
                       className={cn("flex-1 py-3 px-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all", paymentCategory === 'digital' ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-border text-muted-foreground')}
                    >
                       <CreditCard size={16} /> Digital Pay
                    </button>
                    <button 
                       onClick={() => setPaymentCategory('cod')}
                       className={cn("flex-1 py-3 px-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all", paymentCategory === 'cod' ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-border text-muted-foreground')}
                    >
                       <DollarSign size={16} /> Cash on Delivery
                    </button>
                 </div>
                 
                 <AnimatePresence>
                    {paymentCategory === 'digital' && (
                       <motion.div
                         initial={{ opacity: 0, height: 0 }}
                         animate={{ opacity: 1, height: 'auto' }}
                         exit={{ opacity: 0, height: 0 }}
                         className="overflow-hidden"
                       >
                          <div className="bg-muted/20 p-3 rounded-xl border border-border mt-3">
                             <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Select Wallet</p>
                             <div className="grid grid-cols-3 gap-2 mb-3">
                                {['KBZPay', 'AYA Pay', 'WavePay', 'CB Pay', 'OK$'].map(method => (
                                   <button 
                                      key={method}
                                      onClick={() => setDigitalPaymentMethod(method)}
                                      className={cn("py-2 rounded-lg text-[10px] font-bold border transition-all", digitalPaymentMethod === method ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-card border-border text-muted-foreground hover:bg-muted')}
                                   >
                                      {method}
                                   </button>
                                ))}
                             </div>
                             <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl space-y-4">
                                <div className="flex flex-col items-center justify-center space-y-2">
                                   <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-xl overflow-hidden shadow-sm border border-border p-1 relative group cursor-pointer" onClick={() => setPreviewQr(dynamicWallets[digitalPaymentMethod]?.qrCode)}>
                                      <img src={dynamicWallets[digitalPaymentMethod]?.qrCode} alt={`${digitalPaymentMethod} QR`} className="w-full h-full object-cover rounded-lg" />
                                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                        <ZoomIn className="text-white" size={24} />
                                      </div>
                                   </div>
                                   <p className="text-[10px] font-bold text-muted-foreground">Scan to Pay</p>
                                </div>
                                <div className="space-y-3 bg-card p-3 rounded-lg border border-border">
                                   <div className="flex justify-between items-center border-b border-border pb-2">
                                      <span className="text-xs text-muted-foreground">Account Name</span>
                                      <span className={cn("text-xs font-bold", dynamicWallets[digitalPaymentMethod]?.color)}>{dynamicWallets[digitalPaymentMethod]?.accountName}</span>
                                   </div>
                                   <div className="flex justify-between items-center">
                                      <span className="text-xs text-muted-foreground">Phone Number</span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-black text-foreground">{dynamicWallets[digitalPaymentMethod]?.phone}</span>
                                        <button 
                                          onClick={() => handleCopyPhone(dynamicWallets[digitalPaymentMethod]?.phone)}
                                          className="p-1.5 bg-muted rounded-md text-muted-foreground hover:text-primary transition-colors"
                                          title="Copy Phone Number"
                                        >
                                          {copiedPhone ? <Check size={14} className="text-emerald-500"/> : <Copy size={14}/>}
                                        </button>
                                      </div>
                                   </div>
                                </div>
                                <div className="bg-muted/30 p-3 rounded-lg text-center">
                                   <p className="text-[10px] font-bold text-foreground leading-relaxed">
                                      After making payment, please confirm your order below and keep your payment receipt.
                                   </p>
                                </div>
                             </div>
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
                 
                 <AnimatePresence>
                    {paymentCategory === 'cod' && (
                       <motion.div
                         initial={{ opacity: 0, height: 0 }}
                         animate={{ opacity: 1, height: 'auto' }}
                         exit={{ opacity: 0, height: 0 }}
                         className="overflow-hidden"
                       >
                          <div className="bg-muted/20 p-3 rounded-xl border border-border mt-3 flex gap-3 items-start">
                             <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={16} />
                             <p className="text-[10px] text-muted-foreground leading-relaxed">
                                Pay the total amount directly to our delivery driver when your order arrives. Please prepare the exact amount if possible!
                             </p>
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>

                            <div className="pt-4 border-t border-border">
                 <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-foreground">Total:</span>
                    <span className="text-xl font-black text-primary">{((selectedProduct?.price || 0) * quantity).toLocaleString()} Ks</span>
                 </div>
                 <button 
                    onClick={submitOrder}
                    disabled={isPlacingOrder || !customerName || !customerPhone || (deliveryType === 'home' && !address)}
                    className="w-full py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm rounded-xl hover:brightness-110 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                 >
                    {isPlacingOrder ? (
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                       <>Confirm Order</>
                    )}
                 </button>
              </div>
           </motion.div>
        )}
        </AnimatePresence>
      </Modal>
      <Modal isOpen={!!previewQr} onClose={() => setPreviewQr(null)} title={`${digitalPaymentMethod} QR Code`} maxWidth="max-w-sm">
        <div className="p-4 bg-white rounded-xl flex items-center justify-center">
          <img src={previewQr || ''} alt="QR Code Full" className="w-full max-w-[300px] h-auto object-contain rounded-lg" />
        </div>
      </Modal>
    </motion.div>
  );
};
const AdminGalleryProductsTab = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [imagesInput, setImagesInput] = useState('');
  const [isReadyToShip, setIsReadyToShip] = useState(false);
  
  const SHAPES = ['Almond', 'Coffin', 'Square', 'Oval', 'Stiletto'];
  const SIZES = ['XS', 'S', 'M', 'L', 'Custom'];
  
  const [shapesAvailable, setShapesAvailable] = useState<string[]>([]);
  const [sizesAvailable, setSizesAvailable] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'products'));

    return unsubscribe;
  }, []);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setTitle(product.title);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setImagesInput(product.images.join(', '));
      setIsReadyToShip(product.isReadyToShip);
      setShapesAvailable(product.shapesAvailable || []);
      setSizesAvailable(product.sizesAvailable || []);
    } else {
      setEditingProduct(null);
      setTitle('');
      setDescription('');
      setPrice(0);
      setCategory('Luxury');
      setImagesInput('');
      setIsReadyToShip(false);
      setShapesAvailable([]);
      setSizesAvailable([]);
    }
    setIsModalOpen(true);
  };

  const toggleShape = (shape: string) => {
    setShapesAvailable(prev => prev.includes(shape) ? prev.filter(s => s !== shape) : [...prev, shape]);
  };
  
  const toggleSize = (size: string) => {
    setSizesAvailable(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const handleSave = async () => {
    if (!title.trim() || price <= 0 || !category.trim()) return;
    
    setIsSubmitting(true);
    try {
      const imageUrls = imagesInput.split(',').map(url => url.trim()).filter(url => url.length > 0);
      
      const productData = {
        title: title.trim(),
        description: description.trim(),
        price,
        category: category.trim(),
        images: imageUrls,
        isReadyToShip,
        sizesAvailable,
        shapesAvailable,
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date().toISOString()
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, editingProduct ? OperationType.UPDATE : OperationType.CREATE, 'products');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProductToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'products');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <motion.div 
      className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 pt-4 sm:pt-6 lg:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 [.midnight_&]:text-amber-400 flex items-center gap-2">
            <PackageOpen className="text-primary" size={24} />
            Product Management
          </h1>
          <p className="text-xs font-medium text-muted-foreground mt-1">
            Manage designs & inventory
          </p>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOpenModal()}
          className="bg-primary text-primary-foreground font-black px-6 py-3.5 rounded-2xl flex items-center gap-2 hover:brightness-110 shadow-lg shadow-primary/20 transition-all uppercase tracking-widest text-[10px]"
        >
          <Plus size={16} /> Add New Design
        </motion.button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {products.map(product => (
          <motion.div 
            key={product.id}
            className="bg-card border border-amber-200/40 [.midnight_&]:border-amber-500/20 rounded-xl overflow-hidden shadow-sm flex flex-col group relative"
          >
            <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-100">
               <button 
                 onClick={(e) => { e.stopPropagation(); handleOpenModal(product); }}
                 className="p-1.5 sm:p-2 bg-white/90 dark:bg-black/80 backdrop-blur-md text-slate-700 dark:text-slate-300 rounded-lg hover:text-primary transition-colors shadow-sm"
                 title="Edit"
               >
                 <Edit size={14} />
               </button>
               <button 
                 onClick={(e) => { e.stopPropagation(); setProductToDelete(product); }}
                 className="p-1.5 sm:p-2 bg-white/90 dark:bg-black/80 backdrop-blur-md text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                 title="Delete"
               >
                 <Trash2 size={14} />
               </button>
            </div>
          
            <div className="aspect-[3/4] bg-muted/30 relative overflow-hidden flex items-center justify-center">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0]} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="text-muted-foreground/30 w-16 h-16" />
              )}
               {product.isReadyToShip && (
                <div className="absolute top-3 left-3 bg-green-500/90 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-lg">
                  RTS
                </div>
              )}
            </div>
            
            <div className="p-3 sm:p-4 flex-1 flex flex-col">
              <div className="flex flex-col gap-1 mb-2">
                <h3 className="font-bold text-foreground text-sm line-clamp-1">{product.title}</h3>
                <span className="text-xs font-black text-primary">
                  {product.price.toLocaleString()} Ks
                </span>
              </div>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                {product.category}
              </span>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {product.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Design" : "Add New Design"}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center gap-2 mb-2">
                      <Tag size={14} className="text-primary" /> Title
                    </label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all"
                      placeholder="e.g. Milky Way Ombre"
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center gap-2 mb-2">
                        <Tag size={14} className="text-primary" /> Category
                      </label>
                      <input 
                        type="text" 
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all"
                        placeholder="e.g. Luxury"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center gap-2 mb-2">
                        <DollarSign size={14} className="text-primary" /> Price (Ks)
                      </label>
                      <input 
                        type="number" 
                        value={price || ''}
                        onChange={e => setPrice(Number(e.target.value))}
                        className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all"
                        placeholder="0"
                      />
                    </div>
                 </div>
                 
                 <div>
                    <label className="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center gap-2 mb-2">
                      <ImageIcon size={14} className="text-primary" /> Image URLs
                    </label>
                    <textarea 
                      value={imagesInput}
                      onChange={e => setImagesInput(e.target.value)}
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all h-20 resize-none"
                      placeholder="Comma-separated image URLs"
                    />
                 </div>
                 
                 <div>
                    <label className="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-primary" /> Description
                    </label>
                    <textarea 
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all h-24 resize-none"
                      placeholder="Product details..."
                    />
                 </div>
              </div>
              
              <div className="space-y-6">
                 <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                    <label className="flex items-center justify-between cursor-pointer" onClick={(e) => { e.preventDefault(); setIsReadyToShip(!isReadyToShip); }}>
                       <span className="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                          <PackageOpen size={14} className="text-green-500" />
                          Ready To Ship
                       </span>
                       <div className={cn(
                          "w-12 h-6 rounded-full transition-colors relative flex items-center",
                          isReadyToShip ? "bg-green-500" : "bg-border"
                       )}>
                          <div className={cn(
                             "w-4 h-4 rounded-full bg-white absolute transition-transform",
                             isReadyToShip ? "translate-x-7" : "translate-x-1"
                          )} />
                       </div>
                    </label>
                    <p className="text-[10px] text-muted-foreground mt-2">
                       If active, this product can be shipped immediately. Otherwise it is marked as made-to-order (Lookbook).
                    </p>
                 </div>
                 
                 <div>
                    <label className="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center gap-2 mb-3">
                      <Scissors size={14} className="text-primary" /> Available Shapes
                    </label>
                    <div className="flex flex-wrap gap-2">
                       {SHAPES.map(shape => (
                          <button
                            key={shape}
                            onClick={() => toggleShape(shape)}
                            className={cn(
                               "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                               shapesAvailable.includes(shape)
                                 ? "bg-primary/10 border-primary/30 text-primary"
                                 : "bg-input border-border text-muted-foreground hover:bg-muted"
                            )}
                          >
                             {shape}
                          </button>
                       ))}
                    </div>
                 </div>
                 
                 <div>
                    <label className="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center gap-2 mb-3">
                      <Sparkles size={14} className="text-primary" /> Available Sizes
                    </label>
                    <div className="flex flex-wrap gap-2">
                       {SIZES.map(size => (
                          <button
                            key={size}
                            onClick={() => toggleSize(size)}
                            className={cn(
                               "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                               sizesAvailable.includes(size)
                                 ? "bg-primary/10 border-primary/30 text-primary"
                                 : "bg-input border-border text-muted-foreground hover:bg-muted"
                            )}
                          >
                             {size}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="pt-6 border-t border-border flex justify-end gap-3">
              <button 
                 onClick={() => setIsModalOpen(false)}
                 className="px-6 py-3 rounded-xl font-bold text-sm text-foreground hover:bg-muted transition-colors"
              >
                 Cancel
              </button>
              <button 
                 onClick={handleSave}
                 disabled={isSubmitting || !title.trim() || price <= 0 || !category.trim()}
                 className="px-6 py-3 bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] rounded-xl hover:brightness-110 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
              >
                 {isSubmitting ? 'Saving...' : 'Save Design'}
              </button>
           </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        title="Confirm Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-foreground">
            Are you sure you want to delete the design <strong>{productToDelete?.title}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end pt-4">
            <button 
               onClick={() => setProductToDelete(null)}
               className="px-4 py-2 rounded-xl font-bold text-sm text-foreground hover:bg-muted transition-colors"
            >
               Cancel
            </button>
            <button 
               onClick={() => productToDelete && handleDelete(productToDelete.id)}
               className="px-4 py-2 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
            >
               Delete Design
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};



const AdminGalleryOrdersTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders'));
    return unsubscribe;
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus
      });
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm font-bold text-muted-foreground">Loading Orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-card border border-dashed border-border rounded-2xl">
          <ShoppingBag size={40} className="mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-base font-bold text-foreground">No orders yet</h3>
          <p className="text-sm text-muted-foreground mt-2">When customers place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map(order => (
            <motion.div 
              key={order.id}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedOrder(order)}
              className="bg-card border border-border rounded-xl p-4 shadow-sm cursor-pointer hover:border-primary/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">#{order.id.slice(0, 8)}</p>
                  <h3 className="font-bold text-sm text-foreground mt-1 line-clamp-1">{order.customerName}</h3>
                </div>
                <div className={cn("px-2 py-1 rounded-md text-[10px] font-bold border whitespace-nowrap", STATUS_COLORS[order.status] || 'bg-muted text-muted-foreground')}>
                  {order.status}
                </div>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                 <p className="flex items-center gap-2"><Phone size={12} /> {order.phone}</p>
                 <p className="flex items-center gap-2">{order.deliveryType === 'home' ? <Truck size={12} /> : <Store size={12}/>} {order.deliveryType === 'home' ? 'Delivery' : 'Pickup'}</p>
                 <p className="font-bold text-foreground mt-2 pt-2 border-t border-border">Total: {order.totalAmount.toLocaleString()} Ks</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal 
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order #${selectedOrder?.id.slice(0, 8)}`}
        maxWidth="max-w-xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
             <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="space-y-1 w-full sm:w-auto">
                   <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Update Status</p>
                   <CustomSelect 
                     value={selectedOrder.status}
                     options={STATUS_OPTIONS.map(s => ({ value: s, label: s }))}
                     onChange={(v) => updateOrderStatus(selectedOrder.id, v)}
                     className="min-w-[180px] w-full sm:w-auto"
                   />
                </div>
                <div className={cn("px-3 py-2 rounded-lg text-xs font-bold border text-center whitespace-nowrap", STATUS_COLORS[selectedOrder.status] || 'bg-muted')}>
                   {selectedOrder.status}
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1 border-b border-border pb-1">
                     <User size={12}/> Customer Info
                   </h4>
                   <div className="text-sm">
                      <p className="font-bold">{selectedOrder.customerName}</p>
                      <p className="text-muted-foreground">{selectedOrder.phone}</p>
                      <p className="text-muted-foreground">{selectedOrder.customerEmail}</p>
                   </div>
                </div>
                <div className="space-y-3">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1 border-b border-border pb-1">
                     {selectedOrder.deliveryType === 'home' ? <Truck size={12}/> : <Store size={12}/>} Delivery Info
                   </h4>
                   <div className="text-sm">
                      <p className="font-bold">{selectedOrder.deliveryType === 'home' ? 'Home Delivery' : 'Salon Pickup'}</p>
                      {selectedOrder.deliveryType === 'home' && (
                         <p className="text-muted-foreground whitespace-pre-wrap mt-1">{selectedOrder.address}</p>
                      )}
                   </div>
                </div>
             </div>
             
             <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1 border-b border-border pb-1">
                  <CreditCard size={12}/> Payment Info
                </h4>
                <div className="text-sm flex justify-between items-center">
                   <p className="font-bold uppercase">{selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : selectedOrder.paymentMethod}</p>
                   <p className="font-black text-primary text-lg">{selectedOrder.totalAmount.toLocaleString()} Ks</p>
                </div>
             </div>
             
             <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1 border-b border-border pb-1">
                  <ShoppingBag size={12}/> Order Items
                </h4>
                <div className="space-y-2">
                   {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="bg-muted/30 p-3 rounded-lg border border-border flex justify-between items-center">
                         <div>
                            <p className="font-bold text-sm">{item.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">Shape: {item.shape} • Size: {item.size}</p>
                            {item.size === 'Custom' && item.customNailSizes && (
                               <p className="text-[10px] text-muted-foreground mt-0.5 border-t border-border/50 pt-0.5">
                                 T:{item.customNailSizes.thumb} I:{item.customNailSizes.index} M:{item.customNailSizes.middle} R:{item.customNailSizes.ring} P:{item.customNailSizes.pinky}
                               </p>
                            )}
                         </div>
                         <div className="text-right">
                            <p className="font-bold text-sm">{item.quantity}x</p>
                            <p className="text-xs text-primary font-bold">{(item.price * item.quantity).toLocaleString()} Ks</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const AdminGalleryPaymentsTab = () => {
  const [wallets, setWallets] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const docRef = doc(db, 'settings', 'payment_methods');
        const docSnap = await onSnapshot(docRef, (snap) => {
           if (snap.exists()) {
             setWallets(snap.data());
           } else {
             // Initialize with default
             setWallets(DIGITAL_WALLETS);
           }
           setLoading(false);
        });
        return () => docSnap();
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchWallets();
  }, []);

  const handleChange = (key: string, field: string, value: string | boolean) => {
    setWallets(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'settings', 'payment_methods'), wallets).catch(async (e) => {
         // If doc doesn't exist, create it
         if (e.code === 'not-found') {
            const { setDoc } = await import('firebase/firestore');
            await setDoc(doc(db, 'settings', 'payment_methods'), wallets);
         } else {
            throw e;
         }
      });
      setSuccessMsg('Payment settings saved successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground font-bold">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm">
        <div>
          <h2 className="text-lg font-black text-foreground">Digital Wallets</h2>
          <p className="text-xs text-muted-foreground mt-1">Configure payment details displayed during customer checkout.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:brightness-110 disabled:opacity-50 transition-all shadow-sm flex items-center gap-2"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-3 rounded-lg text-sm font-bold flex items-center gap-2">
          <CheckCircle size={16} /> {successMsg}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(wallets).map(([key, wallet]) => (
          <div key={key} className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-black text-foreground flex items-center gap-2">
                <CreditCard size={18} className={wallet.color} />
                {wallet.name}
              </h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Account Name</label>
                <input 
                  type="text"
                  value={wallet.accountName || ""}
                  onChange={(e) => handleChange(key, 'accountName', e.target.value)}
                  className="w-full mt-1 bg-input border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Phone Number</label>
                <input 
                  type="text"
                  value={wallet.phone || ""}
                  onChange={(e) => handleChange(key, 'phone', e.target.value)}
                  className="w-full mt-1 bg-input border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">QR Code Image URL</label>
                <input 
                  type="text"
                  value={wallet.qrCode || wallet.qrCodeUrl || ""}
                  onChange={(e) => handleChange(key, 'qrCode', e.target.value)}
                  className="w-full mt-1 bg-input border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors font-medium"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
