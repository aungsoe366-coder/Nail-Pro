import re

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

with open('auth_effect.tsx', 'r') as f:
    auth_effect = f.read()

new_auth_effect = """  useEffect(() => {
    let unsubProfile: (() => void) | null = null;
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }

      if (u) {
        setUser(u);
        const email = u.email!.toLowerCase();
        const docRef = doc(db, 'users', email);
        let initDone = false;

        unsubProfile = onSnapshot(docRef, (docSnap) => {
          try {
            if (!docSnap.exists()) {
              if (!initDone) {
                initDone = true;
                const now = new Date().toISOString();
                let currentRole = (email === (import.meta.env.VITE_SUPER_ADMIN_EMAIL || '')) ? 'super_admin' : 'customer';
                const profileData: any = {
                  name: u.displayName || (currentRole === 'super_admin' ? 'Admin' : 'Customer'),
                  email: email,
                  role: currentRole as any,
                  commission: 0,
                  uid: u.uid,
                  points: 0,
                  status: 'active',
                  createdAt: now,
                  updatedAt: now
                };
                
                // Do not await this so it doesn't block UI if offline.
                setDoc(docRef, profileData).catch(err => console.error("setDoc failed", err));

                if (currentRole === 'customer') {
                   getDocs(query(collection(db, 'customers'), where('email', '==', email))).then(custSnap => {
                       if (custSnap.empty) {
                          addDoc(collection(db, 'customers'), {
                            name: profileData.name,
                            email: email,
                            phone: '',
                            address: '',
                            notes: 'Registered via Google Sign-In',
                            points: 0,
                            totalVisits: 0,
                            totalSpent: 0
                          }).catch(err => console.error("addDoc customer failed", err));
                       }
                   }).catch(err => console.error("getDocs customers failed", err));
                }
                
                // Optimistically set profile to allow app load
                setProfile(profileData as UserProfile);
              }
            } else {
               const data = docSnap.data();
               if (data?.status === 'deleted') {
                  signOut(auth);
                  setUser(null);
                  setProfile(null);
                  setLoading(false);
                  setIsAuthReady(true);
                  return;
               }
               setProfile(data as UserProfile);
               
               // Background admin/uid sync
               if (!initDone) {
                 initDone = true;
                 const now = new Date().toISOString();
                 let updates: any = {};
                 if (email === (import.meta.env.VITE_SUPER_ADMIN_EMAIL || '') && data?.role !== 'super_admin') {
                   updates.role = 'super_admin';
                   updates.updatedAt = now;
                 }
                 if (!data?.uid || !data?.createdAt) {
                   updates.uid = u.uid;
                   updates.createdAt = data?.createdAt || now;
                   updates.updatedAt = now;
                 }
                 if (Object.keys(updates).length > 0) {
                    setDoc(docRef, updates, { merge: true }).catch(e => console.error("update doc failed", e));
                 }
               }
            }
            setLoading(false);
            setIsAuthReady(true);
          } catch (err) {
             console.error("Profile onSnapshot handler error:", err);
             setLoading(false);
             setIsAuthReady(true);
          }
        }, (err) => {
          console.error("Profile snapshot error:", err);
          if (err.message.includes('permission-denied')) { 
            signOut(auth);
          }
          setLoading(false);
          setIsAuthReady(true);
        });
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
        setIsAuthReady(true);
      }
    });

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
    };
  }, []);"""

text = text.replace(auth_effect, new_auth_effect)

with open('src/AppCore.tsx', 'w') as f:
    f.write(text)
print("Updated src/AppCore.tsx")
