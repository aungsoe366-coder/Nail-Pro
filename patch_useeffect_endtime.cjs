const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const hookInsert = `
  useEffect(() => {
    if (apptTime && apptDuration) {
      const [hours, minutes] = apptTime.split(':').map(Number);
      const endDate = new Date();
      endDate.setHours(hours, minutes + apptDuration);
      const endHours = endDate.getHours().toString().padStart(2, '0');
      const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
      setApptEndTime(\`\${endHours}:\${endMinutes}\`);
    }
  }, [apptTime, apptDuration]);
`;

const existing = `// Validate that selected staff works on the chosen date`;

code = code.replace(existing, hookInsert + '\n  ' + existing);

fs.writeFileSync('src/AppCore.tsx', code);
