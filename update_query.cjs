const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const queryToReplace = `const apptsQuery = isCustomer
 ? query(collection(db, 'appointments'), where('creatorEmail', '==', profile.email))
 : query(collection(db, 'appointments'));`;

const newQuery = `const apptsQuery = isCustomer
 ? query(collection(db, 'appointments'), or(
     where('creatorEmail', '==', profile.email),
     where('customerEmail', '==', profile.email),
     where('customerPhone', '==', profile.phone || 'none')
   ))
 : query(collection(db, 'appointments'));`;

if (code.includes(queryToReplace)) {
  code = code.replace(queryToReplace, newQuery);
  fs.writeFileSync('src/AppCore.tsx', code);
  console.log("Query updated.");
} else {
  console.log("Could not find the query to replace!");
}
