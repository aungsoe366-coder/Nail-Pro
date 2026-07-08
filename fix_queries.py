import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target1 = """    let q = query(collection(db, 'sales'), orderBy('dateTime', 'desc'));
    if (isStaff) {
      q = query(collection(db, 'sales'), where('staffEmail', '==', profile.email), orderBy('dateTime', 'desc'));
    }"""

replacement1 = """    let q = query(collection(db, 'sales'), orderBy('dateTime', 'desc'));
    if (isStaff) {
      q = query(collection(db, 'sales'), where('staffNamesArray', 'array-contains', profile.name), orderBy('dateTime', 'desc'));
    }"""

target2 = """    } else if (isStaff) {
      setStaffList([profile.name]);
      const q = query(collection(db, 'sales'), where('staffEmail', '==', profile.email), orderBy('dateTime', 'desc'));"""

replacement2 = """    } else if (isStaff) {
      setStaffList([profile.name]);
      const q = query(collection(db, 'sales'), where('staffNamesArray', 'array-contains', profile.name), orderBy('dateTime', 'desc'));"""

new_content = content.replace(target1, replacement1).replace(target2, replacement2)

if new_content == content:
    print("NO CHANGE - QUERIES")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS - QUERIES")

