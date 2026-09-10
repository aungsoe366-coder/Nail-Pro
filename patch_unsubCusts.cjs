const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const targetStr = ` const unsubCusts = (!isCustomer)
 ? onSnapshot(query(collection(db, 'customers'), orderBy('name')), (snapshot) => {
 setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer)));
 }, (error) => handleFirestoreError(error, OperationType.LIST, 'customers'))
 : onSnapshot(query(collection(db, 'customers'), where('email', '==', profile.email)), (snapshot) => {
 setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer)));
 }, (error) => handleFirestoreError(error, OperationType.LIST, 'customers'));`;

const newStr = ` const unsubCusts = (!isCustomer)
 ? onSnapshot(query(collection(db, 'customers'), orderBy('name')), (snapshot) => {
 setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer)));
 }, (error) => handleFirestoreError(error, OperationType.LIST, 'customers'))
 : (profile?.email ? onSnapshot(query(collection(db, 'customers'), where('email', '==', profile.email)), (snapshot) => {
 setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer)));
 }, (error) => handleFirestoreError(error, OperationType.LIST, 'customers')) : () => {});`;

// Let's use regex again because of whitespace

const regexStr = /const unsubCusts = \(!isCustomer\)\s*\?\s*onSnapshot\(query\(collection\(db, 'customers'\), orderBy\('name'\)\), \(snapshot\) => \{\s*setCustomers\(snapshot\.docs\.map\(doc => \(\{ id: doc\.id, \.\.\.doc\.data\(\) \} as Customer\)\)\);\s*\}, \(error\) => handleFirestoreError\(error, OperationType\.LIST, 'customers'\)\)\s*:\s*onSnapshot\(query\(collection\(db, 'customers'\), where\('email', '==', profile\.email\)\), \(snapshot\) => \{\s*setCustomers\(snapshot\.docs\.map\(doc => \(\{ id: doc\.id, \.\.\.doc\.data\(\) \} as Customer\)\)\);\s*\}, \(error\) => handleFirestoreError\(error, OperationType\.LIST, 'customers'\)\);/

if (regexStr.test(code)) {
  code = code.replace(regexStr, newStr);
  fs.writeFileSync('src/AppCore.tsx', code);
  console.log("Patched unsubCusts!");
} else {
  console.log("unsubCusts Target not found!");
}
