const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const targetStr = ` const apptsQuery = isCustomer
 ? query(collection(db, 'appointments'), or(
     where('creatorEmail', '==', profile.email),
     where('customerEmail', '==', profile.email),
     where('customerPhone', '==', profile.phone || 'none')
   ))
 : query(collection(db, 'appointments'));

 const unsubAppts = onSnapshot(apptsQuery, (snapshot) => {`;

const newStr = ` let apptConditions = [];
 if (isCustomer) {
   if (profile?.email) {
     apptConditions.push(where('customerEmail', '==', profile.email));
     apptConditions.push(where('creatorEmail', '==', profile.email));
   }
   if (profile?.phone) {
     apptConditions.push(where('customerPhone', '==', profile.phone));
   }
 }
 const apptsQuery = isCustomer 
   ? (apptConditions.length > 0 ? query(collection(db, 'appointments'), or(...apptConditions)) : null)
   : query(collection(db, 'appointments'));

 const unsubAppts = apptsQuery ? onSnapshot(apptsQuery, (snapshot) => {`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, newStr);
  
  const endFallback = /setLoadingAppts\(false\);\n\s*\}\);\n\n\s*const unsubCusts = \(!isCustomer\)/;
  const newEndFallback = `setLoadingAppts(false);\n   }) : () => { setLoadingAppts(false); };\n\n const unsubCusts = (!isCustomer)`;
  
  if (endFallback.test(code)) {
      code = code.replace(endFallback, newEndFallback);
  } else {
      console.log("endFallback also not found! Manually check around unsubCusts");
  }
  
  fs.writeFileSync('src/AppCore.tsx', code);
  console.log("Patched!");
} else {
  console.log("Target not found!");
}
