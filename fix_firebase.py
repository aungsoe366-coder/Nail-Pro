import re

with open('src/firebase.ts', 'r') as f:
    text = f.read()

text = text.replace("import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, getDocFromServer, doc } from 'firebase/firestore';", "import { getFirestore, getDocFromServer, doc } from 'firebase/firestore';")

text = text.replace("""export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()}),
  databaseId: firebaseConfig.firestoreDatabaseId
});""", "export const db = getFirestore(app);")

with open('src/firebase.ts', 'w') as f:
    f.write(text)
