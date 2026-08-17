import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target = """        if (coll === 'customers') {
          const customer = customers.find(c => c.id === id);
          if (customer) {
            let targetEmail = customer.email;
            if (!targetEmail && customer.phone) {
              // Try to find the associated user in the staff list (which contains all users)
              const userMatch = staff.find(s => s.phone === customer.phone || s.email === customer.email);
              if (userMatch && userMatch.email) {
                targetEmail = userMatch.email;
              }
            } else if (targetEmail && customer.phone) {
              // Even if email is present, ensure we find the correct user account
              const userMatch = staff.find(s => s.email === targetEmail || s.phone === customer.phone);
              if (userMatch && userMatch.email) {
                targetEmail = userMatch.email;
              }
            }
            if (targetEmail) {
              try {
                const functions = getFunctions(app, 'asia-southeast1');
                const deleteUserAccount = httpsCallable(functions, 'deleteUserAccount');
                await deleteUserAccount({ targetEmail });
              } catch (err) {
                console.warn("Could not delete associated auth account. It may not exist.", err);
              }
            }
          }
        }"""

replacement = """        if (coll === 'customers') {
          const customer = customers.find(c => c.id === id);
          if (customer) {
            let targetEmail = customer.email;
            let userIdToDelete: string | null = null;
            
            try {
              let qUser;
              if (customer.email) {
                 qUser = query(collection(db, 'users'), where('email', '==', customer.email));
              } else if (customer.phone) {
                 qUser = query(collection(db, 'users'), where('phone', '==', customer.phone));
              }
              if (qUser) {
                 const userSnapshot = await getDocs(qUser);
                 if (!userSnapshot.empty) {
                   const matchedUser = userSnapshot.docs[0];
                   userIdToDelete = matchedUser.id;
                   if (!targetEmail) {
                     targetEmail = matchedUser.data().email;
                   }
                 }
              }
            } catch (err) {
              console.warn("Could not find associated user document", err);
            }

            if (targetEmail) {
              try {
                const functions = getFunctions(app, 'asia-southeast1');
                const deleteUserAccount = httpsCallable(functions, 'deleteUserAccount');
                await deleteUserAccount({ targetEmail });
              } catch (err) {
                console.warn("Could not delete associated auth account. It may not exist.", err);
              }
            }
            
            if (userIdToDelete) {
              try {
                await deleteDoc(doc(db, 'users', userIdToDelete));
              } catch (err) {
                console.warn("Could not delete associated user document.", err);
              }
            }
          }
        }"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/AppCore.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Target not found")
