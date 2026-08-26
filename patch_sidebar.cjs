const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const oldMenu = `const menuItems = [
 { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} />, path: '/', roles: ['super_admin', 'owner', 'cashier', 'staff'] },`;

const newMenu = `const menuItems = [
 { id: 'customer-home', label: 'Home', icon: <Home size={18} />, path: '/', roles: ['customer'] },
 { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} />, path: '/', roles: ['super_admin', 'owner', 'cashier', 'staff'] },`;

code = code.replace(oldMenu, newMenu);

fs.writeFileSync('src/AppCore.tsx', code);
