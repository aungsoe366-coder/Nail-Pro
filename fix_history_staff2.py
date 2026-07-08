import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target = """    if (isAdmin || isCashier) {
      const qStaff = query(collection(db, 'users'));
      unsubStaff = onSnapshot(qStaff, (snapshot) => {
        const names = snapshot.docs
          .map(doc => doc.data() as UserProfile)
          .filter(u => {
            const isExcluded = u.role === 'super_admin' || 
                               (u.email && superAdminEmails.includes(u.email.toLowerCase().trim()));
            return !isExcluded && ['owner', 'cashier', 'staff'].includes(u.role || '');
          })"""

replacement = """    if (isAdmin || isCashier) {
      const qStaff = query(collection(db, 'users'));
      unsubStaff = onSnapshot(qStaff, (snapshot) => {
        const superAdminEmails = [(import.meta.env.VITE_SUPER_ADMIN_EMAIL || '')];
        const names = snapshot.docs
          .map(doc => doc.data() as UserProfile)
          .filter(u => {
            const isExcluded = u.role === 'super_admin' || 
                               (u.email && superAdminEmails.includes(u.email.toLowerCase().trim()));
            return !isExcluded && ['owner', 'cashier', 'staff'].includes(u.role || '');
          })"""

new_content = content.replace(target, replacement)
if new_content == content:
    print("NO CHANGE - HISTORY STAFF 2")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS - HISTORY STAFF 2")

