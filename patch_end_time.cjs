const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

// The first block
const block1 = `  useEffect(() => {
    if (apptTime && apptDuration) {
      const [hours, minutes] = apptTime.split(':').map(Number);
      const endDate = new Date();
      endDate.setHours(hours, minutes + apptDuration);
      const endHours = endDate.getHours().toString().padStart(2, '0');
      const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
      setApptEndTime(\`\${endHours}:\${endMinutes}\`);
    }
  }, [apptTime, apptDuration]);`;

const block2 = `useEffect(() => {
 if (apptTime && apptDuration) {
 const [hours, minutes] = apptTime.split(':').map(Number);
 const date = new Date();
 date.setHours(hours);
 date.setMinutes(minutes + apptDuration);
 const endHours = date.getHours().toString().padStart(2, '0');
 const endMinutes = date.getMinutes().toString().padStart(2, '0');
 setApptEndTime(\`\${endHours}:\${endMinutes}\`);
 }
 }, [apptTime, apptDuration]);`;

const replacement = `  useEffect(() => {
    if (apptTime && apptDuration !== undefined) {
      const [hours, minutes] = apptTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + apptDuration;
      const endHours = Math.floor(totalMinutes / 60) % 24;
      const endMins = totalMinutes % 60;
      setApptEndTime(\`\${endHours.toString().padStart(2, '0')}:\${endMins.toString().padStart(2, '0')}\`);
    }
  }, [apptTime, apptDuration]);`;

let modified = false;

if (code.includes(block1)) {
    code = code.replace(block1, replacement);
    modified = true;
} else {
    console.log("Block 1 not found");
}

if (code.includes(block2)) {
    code = code.replace(block2, '');
    modified = true;
} else {
    console.log("Block 2 not found");
}

if (modified) fs.writeFileSync('src/AppCore.tsx', code);

