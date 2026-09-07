const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

if (!code.includes('import {  collection,  doc,  getDoc, getDocFromCache,  getDocs,  setDoc,  addDoc,  updateDoc,  deleteDoc,  onSnapshot,  query,  where,  orderBy, or, getDocFromServer} from \'firebase/firestore\';')) {
  code = code.replace(
    /import \{\s*collection,\s*doc,\s*getDoc, getDocFromCache,\s*getDocs,\s*setDoc,\s*addDoc,\s*updateDoc,\s*deleteDoc,\s*onSnapshot,\s*query,\s*where,\s*orderBy,\s*getDocFromServer\s*\}\s*from\s*'firebase\/firestore';/,
    "import {  collection,  doc,  getDoc, getDocFromCache,  getDocs,  setDoc,  addDoc,  updateDoc,  deleteDoc,  onSnapshot,  query,  where,  orderBy, or, getDocFromServer} from 'firebase/firestore';"
  );
  
  if (!code.includes('or,')) {
    // maybe formatted differently
    code = code.replace("where,\n  orderBy,", "where,\n  orderBy,\n  or,");
  }
}

fs.writeFileSync('src/AppCore.tsx', code);
console.log("Fixed or import.");
