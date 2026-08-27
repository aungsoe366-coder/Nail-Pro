const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex = /useEffect\(\(\) => \{\s*if \(selectedSvcId && selectedSvcId !== 'manual'\) \{\s*const s = services\.find\(s => s\.id === selectedSvcId\);\s*if \(s\) \{\s*setWillEarnPoints\(Math\.floor\(s\.price \/ 1000\)\);\s*if \(s\.duration\) \{\s*setApptDuration\(s\.duration\);\s*\}\s*\}\s*\} else \{\s*setWillEarnPoints\(0\);\s*\}\s*\}, \[selectedSvcId, services\]\);/g;

const replacement = `useEffect(() => {
 if (selectedSvcId && selectedSvcId !== 'manual') {
 const s = services.find(s => s.id === selectedSvcId);
 if (s) {
 setWillEarnPoints(Math.floor((s.price || 0) / 1000));
 setApptDuration(s.duration || 0);
 }
 } else {
 setWillEarnPoints(0);
 setApptDuration(30); // Default to 30 mins for manual services
 }
 }, [selectedSvcId, services]);`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/AppCore.tsx', code);
    console.log("Patched service logic");
} else {
    console.log("Service logic not found");
}
