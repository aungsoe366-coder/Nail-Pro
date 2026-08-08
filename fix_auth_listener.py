import re

with open("src/AppCore.tsx", "r", encoding="utf-8") as f:
    content = f.read()

pattern = re.compile(r"(if \(currentRole === 'customer'\) \{)(\s*getDocs\(query\(collection\(db, 'customers'\), where\('email', '==', email\)\)\))")

new_code = r"if (currentRole === 'customer' && u.displayName) {\2"

content = pattern.sub(new_code, content)
with open("src/AppCore.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Replaced")
