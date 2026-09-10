const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const targetStr = `   // Fetch Upcoming Appointment
   let apptConditions = [];
   if (profile?.email) apptConditions.push(where('customerEmail', '==', profile.email));
   if (profile?.email) apptConditions.push(where('creatorEmail', '==', profile.email));
   if (profile?.phone) apptConditions.push(where('customerPhone', '==', profile.phone));
   
   const fetchTrackers = async () => {
     try {
       // Since OR queries can be complex in Firestore, we'll fetch recently modified or just do simple fetch if possible
       // Let's keep it simple: fetch all for user's email/phone and find active client-side (it's safe for a single user's data scale)
       const apptQuery = query(collection(db, 'appointments'), where('status', 'in', ['pending', 'confirmed']));
       const unsubAppt = onSnapshot(apptQuery, (snap) => {
         const appts = snap.docs.map(doc => ({id: doc.id, ...doc.data()} as any))
           .filter(a => a.customerEmail === profile?.email || a.creatorEmail === profile?.email || (profile?.phone && a.customerPhone === profile?.phone));
         // sort by date asc
         appts.sort((a,b) => (a.date + ' ' + a.time).localeCompare(b.date + ' ' + b.time));
         setUpcomingAppt(appts.length > 0 ? appts[0] : null);
       });`;

const newStr = `   // Fetch Upcoming Appointment
   let apptConditions = [];
   if (profile?.email) {
     apptConditions.push(where('customerEmail', '==', profile.email));
     apptConditions.push(where('creatorEmail', '==', profile.email));
   }
   if (profile?.phone) {
     apptConditions.push(where('customerPhone', '==', profile.phone));
   }
   
   const fetchTrackers = async () => {
     try {
       let unsubAppt = () => {};
       if (apptConditions.length > 0) {
         const apptQuery = query(collection(db, 'appointments'), or(...apptConditions));
         unsubAppt = onSnapshot(apptQuery, (snap) => {
           const appts = snap.docs.map(doc => ({id: doc.id, ...doc.data()} as any))
             .filter(a => ['pending', 'confirmed'].includes(a.status));
           // sort by date asc
           appts.sort((a,b) => (a.date + ' ' + a.time).localeCompare(b.date + ' ' + b.time));
           setUpcomingAppt(appts.length > 0 ? appts[0] : null);
         });
       }`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, newStr);
  fs.writeFileSync('src/AppCore.tsx', code);
  console.log("Patched!");
} else {
  console.log("Not found.");
}
