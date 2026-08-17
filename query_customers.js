const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

admin.initializeApp();
const db = getFirestore("ai-studio-5354cc84-ebb9-46fb-aa8f-ce998e1a5b4a");

async function run() {
  const snapshot = await db.collection('customers').get();
  snapshot.forEach(doc => {
    console.log(doc.id, "=>", doc.data().name);
  });
}
run().catch(console.error);
