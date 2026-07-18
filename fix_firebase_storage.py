import re

with open('src/firebase.ts', 'r') as f:
    text = f.read()

text = text.replace("import { getStorage } from 'firebase/storage';", "")
text = text.replace("export const storage = getStorage(app);", "")

with open('src/firebase.ts', 'w') as f:
    f.write(text)

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

text = text.replace("import { auth, db, app, storage, OperationType, handleFirestoreError } from './firebase';\nimport { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';", "import { auth, db, app, OperationType, handleFirestoreError } from './firebase';")

with open('src/AppCore.tsx', 'w') as f:
    f.write(text)
print("Removed storage references")
