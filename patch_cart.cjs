const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const target1 = ` const [loadingPOS, setLoadingPOS] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
 const [currentStep, setCurrentStep] = useState<'services' | 'cart' | 'checkout'>('services');
 const LOYALTY_THRESHOLD = 500;
 const LOYALTY_DISCOUNT = 10; // 10%

 useEffect(() => {`;

const repl1 = ` const [loadingPOS, setLoadingPOS] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
 const [currentStep, setCurrentStep] = useState<'services' | 'cart' | 'checkout'>('services');
 const LOYALTY_THRESHOLD = 500;
 const LOYALTY_DISCOUNT = 10; // 10%

 useEffect(() => {
  let backButtonListener: any = null;
  const setupBackButton = async () => {
    if (currentStep === 'cart' || currentStep === 'checkout') {
      backButtonListener = await CapApp.addListener('backButton', () => {
        setCurrentStep('services');
      });
    }
  };
  setupBackButton();
  return () => {
    if (backButtonListener && typeof backButtonListener.remove === 'function') {
      backButtonListener.remove();
    }
  };
 }, [currentStep]);

 useEffect(() => {`;

code = code.replace(target1, repl1);

const target2 = `      <motion.div 
        className="bg-background w-full sm:max-w-xl sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.8 }}
      >`;

const repl2 = `      <motion.div 
        className="bg-background w-full sm:max-w-xl sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.8 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.2 }}
        onDragEnd={(e, info) => {
          if (info.offset.y > 100 || info.velocity.y > 500) {
            setCurrentStep('services');
          }
        }}
      >`;

code = code.replace(target2, repl2);

fs.writeFileSync('src/AppCore.tsx', code);
