with open('src/firebase.ts', 'r') as f:
    text = f.read()

text = text.replace(
    "export const db = initializeFirestore(app, { databaseId: firebaseConfig.firestoreDatabaseId, experimentalAutoDetectLongPolling: true, localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()}) });",
    "export const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true, localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()}) }, firebaseConfig.firestoreDatabaseId);"
)

with open('src/firebase.ts', 'w') as f:
    f.write(text)
print("Updated firebase.ts")
