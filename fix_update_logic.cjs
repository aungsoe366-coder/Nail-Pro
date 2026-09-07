const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const createLogicOld = `if (selectedCustId && selectedCustId !== 'manual') {
 newAppt.customerId = selectedCustId;
 const c = customers.find(c => c.id === selectedCustId);
 if (c && c.email) newAppt.customerEmail = c.email;
 } else {
 delete newAppt.customerId;
 }`;

const createLogicNew = `if (selectedCustId && selectedCustId !== 'manual') {
 newAppt.customerId = selectedCustId;
 const c = customers.find(c => c.id === selectedCustId);
 if (c) {
   if (c.email) newAppt.customerEmail = c.email;
   if (c.phone) newAppt.customerPhone = c.phone;
 }
 } else {
 delete newAppt.customerId;
 }`;

if (code.includes(createLogicOld)) {
  code = code.replace(createLogicOld, createLogicNew);
} else {
  console.log("createLogicOld not found");
}

const updateLogicOld = `if (selectedCustId && selectedCustId !== 'manual') {
 updatedAppt.customerId = selectedCustId;
 } else {
 updatedAppt.customerId = null; // Use null to remove it if needed
 }`;

const updateLogicNew = `if (selectedCustId && selectedCustId !== 'manual') {
 updatedAppt.customerId = selectedCustId;
 const c = customers.find(c => c.id === selectedCustId);
 if (c) {
   if (c.email) updatedAppt.customerEmail = c.email;
   if (c.phone) updatedAppt.customerPhone = c.phone;
 }
 } else {
 updatedAppt.customerId = null; // Use null to remove it if needed
 }`;

if (code.includes(updateLogicOld)) {
  code = code.replace(updateLogicOld, updateLogicNew);
} else {
  console.log("updateLogicOld not found");
}

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Fixed create and update logic.");
