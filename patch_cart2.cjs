const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const target1 = ` const [currentStep, setCurrentStep] = useState<'services' | 'cart' | 'checkout'>('services');
 const LOYALTY_THRESHOLD = 500;
 const LOYALTY_DISCOUNT = 10; // 10%

 useEffect(() => {`;

const repl1 = ` const [currentStep, setCurrentStep] = useState<'services' | 'cart' | 'checkout'>('services');
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
fs.writeFileSync('src/AppCore.tsx', code);
