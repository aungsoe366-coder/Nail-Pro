import re

with open('src/firebase.ts', 'r') as f:
    text = f.read()

text = text.replace("import { initializeFirestore, getDocFromServer, doc } from 'firebase/firestore';", "import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, getDocFromServer, doc } from 'firebase/firestore';")

text = text.replace(
    "export const db = initializeFirestore(app, { databaseId: firebaseConfig.firestoreDatabaseId, experimentalAutoDetectLongPolling: true });",
    "export const db = initializeFirestore(app, { databaseId: firebaseConfig.firestoreDatabaseId, experimentalAutoDetectLongPolling: true, localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()}) });"
)

with open('src/firebase.ts', 'w') as f:
    f.write(text)
print("Updated firebase.ts")
