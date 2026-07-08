import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target = """  useEffect(() => {
    if (!profile) return;
    
    let q = query(collection(db, 'sales'), orderBy('dateTime', 'desc'));
    
    // If staff, we only fetch their own sales for security (though rules also enforce this)
    if (isStaff) {
      q = query(collection(db, 'sales'), where('staffEmail', '==', profile.email), orderBy('dateTime', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
      setSales(data);
      const allStaff = data.flatMap(s => {
        const names = [s.staff];
        if (s.items) s.items.forEach(i => { if (i.staffName) names.push(i.staffName); });
        return names;
      });
      setStaffList([...new Set(allStaff.filter(Boolean))]);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'sales'));
    return unsubscribe;
  }, [profile, isStaff]);"""

replacement = """  useEffect(() => {
    if (!profile) return;
    
    let unsubStaff: () => void = () => {};
    if (isAdmin || isCashier) {
      const qStaff = query(collection(db, 'users'));
      unsubStaff = onSnapshot(qStaff, (snapshot) => {
        const names = snapshot.docs
          .map(doc => doc.data() as UserProfile)
          .filter(u => {
            const isExcluded = u.role === 'super_admin' || 
                               (u.email && superAdminEmails.includes(u.email.toLowerCase().trim()));
            return !isExcluded && ['owner', 'cashier', 'staff'].includes(u.role || '');
          })
          .map(u => u.name);
        setStaffList([...new Set(names)].sort());
      });
    } else if (isStaff) {
      setStaffList([profile.name]);
    }

    let q = query(collection(db, 'sales'), orderBy('dateTime', 'desc'));
    if (isStaff) {
      q = query(collection(db, 'sales'), where('staffEmail', '==', profile.email), orderBy('dateTime', 'desc'));
    }
    
    const unsubSales = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
      setSales(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'sales'));
    
    return () => {
      unsubStaff();
      unsubSales();
    };
  }, [profile, isAdmin, isCashier, isStaff]);"""

new_content = content.replace(target, replacement)
if new_content == content:
    print("NO CHANGE - HISTORY STAFF")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS - HISTORY STAFF")

