const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// Replace ServiceCard component
const serviceCardRegex = /const ServiceCard = React\.memo\(\(\{\s*service,\s*isInCart,\s*addToCart\s*\}:\s*any\s*\) => \([\s\S]*?<\/motion\.button>\n\)\);/g;

const newServiceCard = `const ServiceCard = React.memo(({ service, cartQty, onIncrement, onDecrement }: any) => {
  return (
    <div 
      className={\`text-left bg-card border border-border p-3.5 rounded-xl transition-all group relative overflow-hidden flex flex-col justify-between min-h-[90px] \${cartQty > 0 ? 'border-primary ring-1 ring-primary/20 shadow-sm bg-primary/5' : 'hover:border-primary/50 hover:shadow-sm'}\`} 
    > 
      <div className="space-y-0.5 mt-1 pr-6 flex-1 cursor-pointer" onClick={() => cartQty === 0 && onIncrement(service)}> 
        <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-80 truncate">{service.category}</p> 
        <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">{service.name}</h3> 
      </div> 
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
        <p className="text-sm font-black text-foreground">{service.price.toLocaleString()} Ks</p>
        
        {cartQty === 0 ? (
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => onIncrement(service)}
            className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm hover:opacity-90"
          >
            <Plus size={16} strokeWidth={3} />
          </motion.button>
        ) : (
          <div className="flex items-center justify-between bg-muted/60 rounded-full p-1 shadow-sm w-[90px]">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => onDecrement(service)}
              className="w-7 h-7 rounded-full bg-background text-foreground flex items-center justify-center shadow-sm hover:opacity-90"
            >
              <Minus size={14} strokeWidth={3} />
            </motion.button>
            <span className="text-sm font-bold w-6 text-center">{cartQty}</span>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => onIncrement(service)}
              className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm hover:opacity-90"
            >
              <Plus size={14} strokeWidth={3} />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
});`;

code = code.replace(serviceCardRegex, newServiceCard);

// Replace addToCart with incrementCartItem and decrementCartItem
const addToCartRegex = /const addToCart = useCallback\(\(service: Service\) => \{[\s\S]*?  \}, \[isLoyaltyDiscountActive\]\);/;

const newCartLogic = `const incrementCartItem = useCallback((service: Service) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === service.id);
      if (existing) {
        return prev.map(item => item.id === service.id ? { ...item, qty: item.qty + 1 } : item);
      }
      const initialDiscount = isLoyaltyDiscountActive ? LOYALTY_DISCOUNT : 0;
      return [...prev, { ...service, qty: 1, disP: initialDiscount }];
    });
  }, [isLoyaltyDiscountActive]);

  const decrementCartItem = useCallback((service: Service) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === service.id);
      if (existing) {
        if (existing.qty > 1) {
          return prev.map(item => item.id === service.id ? { ...item, qty: item.qty - 1 } : item);
        } else {
          return prev.filter(item => item.id !== service.id);
        }
      }
      return prev;
    });
  }, []);`;

code = code.replace(addToCartRegex, newCartLogic);

// Replace ServiceCard usage
const serviceCardUsageRegex = /<ServiceCard\s+key=\{service\.id\}\s+service=\{service\}\s+isInCart=\{cart\.some\(c => c\.id === service\.id\)\}\s+addToCart=\{addToCart\}\s+\/>/g;

const newServiceCardUsage = `<ServiceCard
    key={service.id}
    service={service}
    cartQty={cart.find(c => c.id === service.id)?.qty || 0}
    onIncrement={incrementCartItem}
    onDecrement={decrementCartItem}
  />`;

code = code.replace(serviceCardUsageRegex, newServiceCardUsage);

fs.writeFileSync('src/AppCore.tsx', code);
console.log('Patched AppCore.tsx');
