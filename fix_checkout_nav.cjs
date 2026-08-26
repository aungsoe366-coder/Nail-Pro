const fs = require('fs');

let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const target = `{currentStep === 'checkout' && cart.length > 0 && (\n <motion.div className="w-full max-w-4xl mx-auto px-3 py-4 md:p-6 space-y-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>`;

const replacement = `{currentStep === 'checkout' && cart.length > 0 && (
 <motion.div className="w-full max-w-4xl mx-auto px-3 py-4 md:p-6 space-y-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
 
 {/* Checkout Header Navigation */}
 <div className="flex justify-between items-center pb-2">
   <motion.button whileTap={{ scale: 0.97 }} onClick={() => setCurrentStep('cart')} className="flex items-center gap-2 text-primary font-bold hover:underline">
     <ArrowLeft size={18} />
     <span className="text-sm">Back to Edit Cart</span>
   </motion.button>
 </div>
 `;

code = code.replace(target, replacement);

fs.writeFileSync('src/AppCore.tsx', code);
