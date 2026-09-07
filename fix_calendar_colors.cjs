const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const calendarOld = `    if (appt.status === 'pending') {
      backgroundColor = 'rgba(234, 179, 8, 0.18)';
      borderColor = '#eab308';
      textColor = '#ca8a04';
    } else if (appt.status === 'confirmed') {
      backgroundColor = 'rgba(37, 99, 235, 0.18)';
      borderColor = '#2563eb';
      textColor = '#1d4ed8';
    } else if (appt.status === 'completed') {
      backgroundColor = 'rgba(22, 163, 74, 0.18)';
      borderColor = '#16a34a';
      textColor = '#15803d';
    } else if (appt.status === 'cancelled') {
      backgroundColor = 'rgba(220, 38, 38, 0.18)';
      borderColor = '#dc2626';
      textColor = '#b91c1c';
    }`;

const calendarNew = `    if (appt.status === 'pending') {
      backgroundColor = '#fffbeb'; // amber-50
      borderColor = '#fde68a'; // amber-200
      textColor = '#b45309'; // amber-700
    } else if (appt.status === 'confirmed') {
      backgroundColor = '#eff6ff'; // blue-50
      borderColor = '#bfdbfe'; // blue-200
      textColor = '#1d4ed8'; // blue-700
    } else if (appt.status === 'completed') {
      backgroundColor = '#ecfdf5'; // emerald-50
      borderColor = '#a7f3d0'; // emerald-200
      textColor = '#047857'; // emerald-700
    } else if (appt.status === 'cancelled') {
      backgroundColor = '#fff1f2'; // rose-50
      borderColor = '#fecdd3'; // rose-200
      textColor = '#be123c'; // rose-700
    }`;

code = code.replace(calendarOld, calendarNew);

fs.writeFileSync('src/AppCore.tsx', code);
console.log('Calendar styles updated.');
