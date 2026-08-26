const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// 1. GPU Acceleration: add willChange
// Match motion divs with standard layout classes and add style if missing
code = code.replace(/(<motion\.div\s+(?:key=[^>]+)?\s*className="[^"]*(?:fixed inset-0|w-full max-w-)[^"]*"([^>]*)>)/g, (match, p1, p2) => {
  if (p2 && p2.includes('style=')) return match; // skip if already has style
  return match.replace(/>$/, ' style={{ willChange: "transform, opacity" }}>');
});

// Also optimize general AnimatePresence
code = code.replace(/<AnimatePresence>/g, '<AnimatePresence mode="wait">');

// 2. Remove backdrop-blur-* classes
code = code.replace(/backdrop-blur-[a-z0-9]*/g, '');

// 3. Optimize stagger
code = code.replace(/staggerChildren: 0\.08/g, 'staggerChildren: 0.015');
code = code.replace(/staggerChildren: 0\.05/g, 'staggerChildren: 0.015');
code = code.replace(/delay: index \* 0\.05/g, 'delay: index * 0.015');
code = code.replace(/delay: i \* 0\.08/g, 'delay: i * 0.015');

// 4. Optimize springs & standard transitions
code = code.replace(/transition=\{\{\s*duration:\s*0\.25\s*\}\}/g, 'transition={{ duration: 0.18, ease: "easeInOut" }}');
code = code.replace(/transition=\{\{\s*duration:\s*0\.2\s*\}\}/g, 'transition={{ duration: 0.18, ease: "easeInOut" }}');
code = code.replace(/transition=\{\{\s*duration:\s*0\.3,\s*ease:\s*"easeOut"\s*\}\}/g, 'transition={{ duration: 0.18, ease: "easeInOut" }}');
code = code.replace(/transition=\{\{\s*type:\s*"spring",\s*damping:\s*25,\s*stiffness:\s*200\s*\}\}/g, 'transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.8 }}');
code = code.replace(/transition=\{\{\s*type:\s*"spring",\s*stiffness:\s*260,\s*damping:\s*20\s*\}\}/g, 'transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.8 }}');
code = code.replace(/transition=\{\{\s*type:\s*"spring",\s*stiffness:\s*300,\s*damping:\s*24\s*\}\}/g, 'transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.8 }}');
code = code.replace(/transition=\{\{\s*type:\s*"spring",\s*stiffness:\s*350,\s*damping:\s*25\s*\}\}/g, 'transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.8 }}');
code = code.replace(/transition=\{\{\s*delay: i \* 0\.015,\s*type:\s*"spring",\s*stiffness:\s*300,\s*damping:\s*24\s*\}\}/g, 'transition={{ delay: i * 0.015, type: "spring", damping: 30, stiffness: 350, mass: 0.8 }}');
code = code.replace(/transition=\{\{\s*delay: index \* 0\.015,\s*type:\s*"spring",\s*stiffness:\s*300,\s*damping:\s*24\s*\}\}/g, 'transition={{ delay: index * 0.015, type: "spring", damping: 30, stiffness: 350, mass: 0.8 }}');

// 5. Remove width/height animations
// Specifically for accordion items / lists that had height animations
code = code.replace(/initial=\{\{\s*height:\s*0,\s*opacity:\s*0\s*\}\}/g, 'initial={{ opacity: 0 }}');
code = code.replace(/animate=\{\{\s*height:\s*'auto',\s*opacity:\s*1,\s*transition:\s*\{\s*duration:\s*0\.3,\s*ease:\s*"easeOut",\s*staggerChildren:\s*0\.015,\s*delayChildren:\s*0\.1\s*\}\s*\}\}/g, 'animate={{ opacity: 1, transition: { duration: 0.18, ease: "easeInOut" } }}');
code = code.replace(/exit=\{\{\s*height:\s*0,\s*opacity:\s*0,\s*transition:\s*\{\s*duration:\s*0\.2,\s*ease:\s*"easeIn"\s*\}\s*\}\}/g, 'exit={{ opacity: 0, transition: { duration: 0.18, ease: "easeInOut" } }}');

fs.writeFileSync('src/AppCore.tsx', code);
