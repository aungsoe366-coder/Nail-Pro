const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const newButton = `
 {(() => {
   const isCustValid = profile?.role === 'customer' || (selectedCustId === 'manual' ? (manualCustName.trim() !== '' && manualCustPhone.trim() !== '') : selectedCustId !== '');
   const isSvcValid = selectedSvcId === 'manual' ? manualSvcName.trim() !== '' : selectedSvcId !== '';
   const isDateValid = apptDate !== '';
   const isTimeValid = apptTime !== '';
   const isFormValid = isCustValid && isSvcValid && isDateValid && isTimeValid;

   return (
     <motion.button whileTap={{ scale: isFormValid ? 0.97 : 1 }}
       type="submit"
       disabled={!isFormValid}
       className={cn(
         "px-4 md:px-8 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 uppercase tracking-widest transition-all",
         isFormValid ? "bg-primary text-white hover:bg-primary/90 shadow-primary/20 hover:shadow-lg" : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
       )}
     >
       Next Step <ArrowRight size={14} />
     </motion.button>
   );
 })()}
`;

// regex replace
const oldButtonRegex = /<motion\.button whileTap=\{\{ scale: 0\.97 \}\}\s*type="submit"\s*className="px-4 md:px-8 py-2\.5 bg-primary text-white rounded-xl font-black text-xs hover:bg-primary\/90 transition-all hover:shadow-primary\/20 flex items-center gap-2 uppercase tracking-widest"\s*>\s*Next Step\s*<ArrowRight size=\{14\} \/>\s*<\/motion\.button>/m;

if (oldButtonRegex.test(code)) {
    code = code.replace(oldButtonRegex, newButton);
    fs.writeFileSync('src/AppCore.tsx', code);
    console.log("Success");
} else {
    console.log("Failed to match Next Step button");
}
