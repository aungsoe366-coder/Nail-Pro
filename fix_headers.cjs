const fs = require('fs');

const appCorePath = 'src/AppCore.tsx';
let content = fs.readFileSync(appCorePath, 'utf8');

// Update Change Password header
content = content.replace(
  '<h3 className="text-2xl font-black tracking-tight mb-2">Change Password</h3>',
  '<h3 className="text-2xl font-black tracking-tight mb-2 text-foreground [.midnight_&]:text-[#D4AF37]">Change Password</h3>'
);

// Update Software Update Available
content = content.replace(
  '<h3 className="text-2xl font-black tracking-tight text-foreground">Software Update Available</h3>',
  '<h3 className="text-2xl font-black tracking-tight text-foreground [.midnight_&]:text-[#D4AF37]">Software Update Available</h3>'
);

fs.writeFileSync(appCorePath, content);
console.log("Headers updated");
