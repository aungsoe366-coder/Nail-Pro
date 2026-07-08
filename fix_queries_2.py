import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target1 = """    let q = query(collection(db, 'sales'), orderBy('dateTime', 'desc'));
    if (isStaff) {
      q = query(collection(db, 'sales'), where('staffNamesArray', 'array-contains', profile.name), orderBy('dateTime', 'desc'));
    }
    
    const unsubSales = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
      setSales(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'sales'));"""

replacement1 = """    const q = query(collection(db, 'sales'), orderBy('dateTime', 'desc'));
    
    const unsubSales = onSnapshot(q, (snapshot) => {
      let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
      
      if (isStaff && !isAdmin && !isCashier) {
        data = data.filter(s => {
          return (s.staffNamesArray && s.staffNamesArray.includes(profile.name)) || 
                 (s.staffName && s.staffName.includes(profile.name)) ||
                 (s.staffNames && s.staffNames.includes(profile.name)) ||
                 (s.staff && s.staff.includes(profile.name));
        });
      }
      
      setSales(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'sales'));"""

target2 = """    } else if (isStaff) {
      setStaffList([profile.name]);
      const q = query(collection(db, 'sales'), where('staffNamesArray', 'array-contains', profile.name), orderBy('dateTime', 'desc'));
      const unsubSales = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
        setSales(data);
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'sales'));
      return unsubSales;
    }"""

replacement2 = """    } else if (isStaff) {
      setStaffList([profile.name]);
      const q = query(collection(db, 'sales'), orderBy('dateTime', 'desc'));
      const unsubSales = onSnapshot(q, (snapshot) => {
        let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
        data = data.filter(s => {
          return (s.staffNamesArray && s.staffNamesArray.includes(profile.name)) || 
                 (s.staffName && s.staffName.includes(profile.name)) ||
                 (s.staffNames && s.staffNames.includes(profile.name)) ||
                 (s.staff && s.staff.includes(profile.name));
        });
        setSales(data);
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'sales'));
      return unsubSales;
    }"""

new_content = content.replace(target1, replacement1).replace(target2, replacement2)
if new_content != content:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS")
else:
    print("NO CHANGE")

