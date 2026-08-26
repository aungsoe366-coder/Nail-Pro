const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const serviceCard = `
const ServiceCard = React.memo(({ service, isInCart, addToCart }: any) => (
  <motion.button 
    whileTap={{ scale: 0.97 }} 
    onClick={() => addToCart(service)} 
    className={\`text-left bg-card border border-border p-3.5 rounded-xl transition-all active:scale-95 group relative overflow-hidden flex flex-col justify-between min-h-[90px] \${ isInCart ? '-primary bg-primary/20 ring-2 ring-primary/20 shadow-primary/10' : ' hover:border-primary/50 hover:' }\`} 
  > 
    {isInCart && ( 
      <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center transition-transform scale-110"> 
        <Check size={12} strokeWidth={3} /> 
      </div> 
    )} 
    <div className="space-y-0.5 mt-1 pr-6"> 
      <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-80 truncate">{service.category}</p> 
      <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">{service.name}</h3> 
    </div> 
    <p className="text-sm font-black text-foreground mt-2">{service.price.toLocaleString()} Ks</p> 
  </motion.button>
));
`;

code = code.replace(/export const POSPage/, serviceCard + '\nexport const POSPage');

// Now replace the inline mapping with ServiceCard
const inlineMapping = /\{filteredServices\.map\(service => \{\s*const isInCart = cart\.some\(c => c\.id === service\.id\);\s*return \(\s*<motion\.button[\s\S]*?<\/motion\.button>\s*\);\s*\}\)\}/;

code = code.replace(inlineMapping, `{filteredServices.map(service => (
  <ServiceCard 
    key={service.id} 
    service={service} 
    isInCart={cart.some(c => c.id === service.id)} 
    addToCart={addToCart} 
  />
))}`);

fs.writeFileSync('src/AppCore.tsx', code);
