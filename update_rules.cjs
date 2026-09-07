const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

const newFunctions = `
    function getUserPhone() {
      let email = getUserEmail();
      let userPath = /databases/$(database)/documents/users/$(email);
      let userDoc = exists(userPath) ? get(userPath).data : null;
      return (userDoc != null && 'phone' in userDoc) ? userDoc.phone : "unknown";
    }
    
    function hasRole(allowedRoles) {`;

code = code.replace("    function hasRole(allowedRoles) {", newFunctions);

const oldApptMatch = `    match /appointments/{id} {
      allow read: if isStaff() || (isAuthenticated() && (resource.data.customerEmail == getUserEmail() || resource.data.creatorEmail == getUserEmail()));
      allow create: if isAuthenticated();
      allow update: if isStaff() || (isAuthenticated() && (resource.data.customerEmail == getUserEmail() || resource.data.creatorEmail == getUserEmail()));
      allow delete: if isStaff();
    }`;

const newApptMatch = `    match /appointments/{id} {
      allow read: if isStaff() || (isAuthenticated() && (resource.data.customerEmail == getUserEmail() || resource.data.creatorEmail == getUserEmail() || (resource.data.customerPhone != null && resource.data.customerPhone == getUserPhone())));
      allow create: if isAuthenticated();
      allow update: if isStaff() || (isAuthenticated() && (resource.data.customerEmail == getUserEmail() || resource.data.creatorEmail == getUserEmail() || (resource.data.customerPhone != null && resource.data.customerPhone == getUserPhone())));
      allow delete: if isStaff();
    }`;

code = code.replace(oldApptMatch, newApptMatch);
fs.writeFileSync('firestore.rules', code);
console.log("Updated firestore.rules.");
