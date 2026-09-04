const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex1 = /skipLabel\?: string;\s*\}> = \(\{ isOpen, onClose, text, onPrint, onSkipPrint, title = "Print Preview", printLabel = "Process & Print", skipLabel = "Complete Without Printing" \}\) => \{/g;
const replacement1 = `skipLabel?: string;
  isSubmitting?: boolean;
}> = ({ isOpen, onClose, text, onPrint, onSkipPrint, title = "Print Preview", printLabel = "Process & Print", skipLabel = "Complete Without Printing", isSubmitting = false }) => {`;

const regex2 = /<Printer size=\{20\} \/>\s*\{printLabel\}\s*<\/motion\.button>/g;
const replacement2 = `<Printer size={20} />
            {isSubmitting ? "Processing..." : printLabel}
          </motion.button>`;

const regex3 = /\{skipLabel\}\s*<\/motion\.button>\s*\)}/g;
const replacement3 = `{isSubmitting ? "Processing..." : skipLabel}
          </motion.button>
        )}`;

const regex4 = /className="w-full bg-primary text-white \[\.midnight_&\]:bg-secondary \[\.midnight_&\]:text-primary \[\.midnight_&\]: \[\.midnight_&\]:-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-\[1\.02\] active:scale-95 transition-all shadow-primary\/20"/g;
const replacement4 = `disabled={isSubmitting}
            className="w-full bg-primary text-white [.midnight_&]:bg-secondary [.midnight_&]:text-primary [.midnight_&]: [.midnight_&]:-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none"`;

const regex5 = /className="w-full bg-muted text-muted-foreground hover:text-foreground py-4 rounded-2xl font-bold transition-colors"/g;
const replacement5 = `disabled={isSubmitting}
            className="w-full bg-muted text-muted-foreground hover:text-foreground py-4 rounded-2xl font-bold transition-colors disabled:opacity-50 disabled:pointer-events-none"`;

if (code.match(regex1)) code = code.replace(regex1, replacement1);
if (code.match(regex2)) code = code.replace(regex2, replacement2);
if (code.match(regex3)) code = code.replace(regex3, replacement3);
if (code.match(regex4)) code = code.replace(regex4, replacement4);
if (code.match(regex5)) code = code.replace(regex5, replacement5);

// Update where PrintPreviewModal is called in POSPage to pass isSubmitting
const callRegex = /<PrintPreviewModal\s*isOpen=\{true\}/g;
const callReplacement = `<PrintPreviewModal
                isOpen={true}
                isSubmitting={isSubmitting}`;
if (code.match(callRegex)) code = code.replace(callRegex, callReplacement);

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Done patching PrintPreviewModal");
