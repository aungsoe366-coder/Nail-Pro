import re

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

text = text.replace("import { auth, db, app, OperationType, handleFirestoreError } from './firebase';", "import { auth, db, app, storage, OperationType, handleFirestoreError } from './firebase';\nimport { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';")

with open('src/AppCore.tsx', 'w') as f:
    f.write(text)
print("Updated AppCore.tsx imports")
