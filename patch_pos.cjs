const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// 1. Add state to POSPage
const stateRegex = /const \[loadingPOS, setLoadingPOS\] = useState\(true\);/;
if (code.match(stateRegex)) {
    code = code.replace(stateRegex, "const [loadingPOS, setLoadingPOS] = useState(true);\n  const [isSubmitting, setIsSubmitting] = useState(false);");
} else {
    console.log("Failed to find loadingPOS state");
}

// 2. Update confirmCheckout
const checkoutRegex = /const confirmCheckout = async \(print: boolean\) => \{\s*if \(\!pendingSaleParams\) return;\s*const \{ sale \} = pendingSaleParams;\s*try \{/g;
const checkoutReplacement = `const confirmCheckout = async (print: boolean) => {
    if (isSubmitting) return;
    if (!pendingSaleParams) return;
    
    setIsSubmitting(true);
    const { sale } = pendingSaleParams;
    try {`;

if (code.match(checkoutRegex)) {
    code = code.replace(checkoutRegex, checkoutReplacement);
} else {
    console.log("Failed to find confirmCheckout");
}

const endCheckoutRegex = /alert\("Sale saved successfully!"\);\s*\} catch \(error\) \{\s*handleFirestoreError\(error, OperationType\.CREATE, 'sales'\);\s*\}/g;
const endCheckoutReplacement = `alert("Sale saved successfully!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'sales');
    } finally {
      setIsSubmitting(false);
    }`;

if (code.match(endCheckoutRegex)) {
    code = code.replace(endCheckoutRegex, endCheckoutReplacement);
} else {
    console.log("Failed to find end of confirmCheckout");
}

// 3. Update the button
const buttonRegex = /disabled=\{cart\.length === 0 \|\| remainingAmount !== 0 \|\| \!isCartValid\}\s*className="([^"]+)"\s*>\s*COMPLETE SALE <ChevronRight size=\{18\} \/>/g;
const buttonReplacement = `disabled={cart.length === 0 || remainingAmount !== 0 || !isCartValid || isSubmitting}
                className="$1"
              >
                {isSubmitting ? "PROCESSING..." : "COMPLETE SALE"} <ChevronRight size={18} />`;

if (code.match(buttonRegex)) {
    code = code.replace(buttonRegex, buttonReplacement);
} else {
    console.log("Failed to find COMPLETE SALE button");
}

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Done patching POSPage");
