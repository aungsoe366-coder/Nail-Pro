import re

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

old_auth_code = """
        (async () => {
          try {
            const now = new Date().toISOString();
            
            if (email === (import.meta.env.VITE_SUPER_ADMIN_EMAIL || '')) {
              const docSnap = await getDoc(docRef);
              if (!docSnap.exists() || docSnap.data()?.role !== 'super_admin') {
                await setDoc(docRef, { 
                  role: 'super_admin', 
                  email: email,
                  name: u.displayName || 'Admin',
                  status: 'active',
                  uid: u.uid,
                  createdAt: now,
                  updatedAt: now
                }, { merge: true });
              }
            }

            const docSnap = await getDoc(docRef);
            let currentRole = 'customer';
            
            if (docSnap.exists()) {
              const data = docSnap.data() as UserProfile;
              currentRole = data.role;
              if (!data.uid || !data.createdAt) {
                await setDoc(docRef, { 
                  uid: u.uid,
                  createdAt: data.createdAt || now,
                  updatedAt: now
                }, { merge: true });
              }
            }

            if (currentRole === 'customer' && email !== (import.meta.env.VITE_SUPER_ADMIN_EMAIL || '')) {
              let initialName = u.displayName || 'Customer';
              let initialPoints = 0;
              try {
                const custQuery = query(collection(db, 'customers'), where('email', '==', email));
                const custSnap = await getDocs(custQuery);
                
                if (!custSnap.empty) {
                  const custData = custSnap.docs[0].data() as Customer;
                  initialName = custData.name || initialName;
                  initialPoints = custData.points || 0;
                } else {
                  if (docSnap.exists()) {
                    const existingData = docSnap.data() as UserProfile;
                    if (existingData.points) {
                      initialPoints = existingData.points;
                    }
                  }
                  await addDoc(collection(db, 'customers'), {
                    name: initialName,
                    email: email,
                    phone: '',
                    address: '',
                    notes: 'Registered via Google Sign-In',
                    points: initialPoints,
                    totalVisits: 0,
                    totalSpent: 0
                  });
                }
              } catch (err) {
                console.error("Failed to check or create customer record", err);
              }

              if (!docSnap.exists()) {
                const profileData: UserProfile = {
                  name: initialName,
                  email: email,
                  role: 'customer',
                  commission: 0,
                  uid: u.uid,
                  points: initialPoints,
                  status: 'active',
                  createdAt: now,
                  updatedAt: now
                };
                await setDoc(docRef, profileData);
              }
            } else if (!docSnap.exists()) {
              const profileData: UserProfile = {
                name: u.displayName || 'User',
                email: email,
                role: (email === (import.meta.env.VITE_SUPER_ADMIN_EMAIL || '')) ? 'super_admin' : 'customer',
                commission: 0,
                uid: u.uid,
                points: 0,
                status: 'active',
                createdAt: now,
                updatedAt: now
              };
              await setDoc(docRef, profileData);
            }

            unsubProfile = onSnapshot(docRef, (docSnap) => {
              if (!docSnap.exists() || docSnap.data()?.status === 'deleted') {
                signOut(auth);
                setUser(null);
                setProfile(null);
                return;
              }
              const profileData = docSnap.data() as UserProfile;
              setProfile(profileData);
              setLoading(false);
              setIsAuthReady(true);
            }, (err) => {
              console.error("Profile snapshot error:", err);
              if (err.message.includes('permission-denied')) { 
                signOut(auth);
              }
              setLoading(false);
              setIsAuthReady(true);
            });

            setUser(u);
          } catch (err) {
            console.error("Profile initialization error:", err);
            setLoading(false);
            setIsAuthReady(true);
          }
        })();"""

new_auth_code = """
        setUser(u);
        let initDone = false;
        
        unsubProfile = onSnapshot(docRef, async (docSnap) => {
          if (docSnap.exists() && docSnap.data()?.status === 'deleted') {
            signOut(auth);
            setUser(null);
            setProfile(null);
            setLoading(false);
            setIsAuthReady(true);
            return;
          }
          
          if (docSnap.exists()) {
            const profileData = docSnap.data() as UserProfile;
            setProfile(profileData);
            setLoading(false);
            setIsAuthReady(true);
            
            // Run background sync
            if (!initDone) {
              initDone = true;
              const now = new Date().toISOString();
              try {
                if (email === (import.meta.env.VITE_SUPER_ADMIN_EMAIL || '') && profileData.role !== 'super_admin') {
                  await setDoc(docRef, { role: 'super_admin', updatedAt: now }, { merge: true });
                }
                if (!profileData.uid || !profileData.createdAt) {
                  await setDoc(docRef, { uid: u.uid, createdAt: profileData.createdAt || now, updatedAt: now }, { merge: true });
                }
              } catch(e) {}
            }
          } else {
            // Document doesn't exist, this is a new user
            if (!initDone) {
              initDone = true;
              const now = new Date().toISOString();
              try {
                let currentRole = (email === (import.meta.env.VITE_SUPER_ADMIN_EMAIL || '')) ? 'super_admin' : 'customer';
                let initialName = u.displayName || 'User';
                let initialPoints = 0;
                
                if (currentRole === 'customer') {
                  initialName = u.displayName || 'Customer';
                  try {
                    const custQuery = query(collection(db, 'customers'), where('email', '==', email));
                    const custSnap = await getDocs(custQuery);
                    if (!custSnap.empty) {
                      const custData = custSnap.docs[0].data() as Customer;
                      initialName = custData.name || initialName;
                      initialPoints = custData.points || 0;
                    } else {
                      await addDoc(collection(db, 'customers'), {
                        name: initialName,
                        email: email,
                        phone: '',
                        address: '',
                        notes: 'Registered via Google Sign-In',
                        points: 0,
                        totalVisits: 0,
                        totalSpent: 0
                      });
                    }
                  } catch (err) {
                    console.error("Customer record creation failed", err);
                  }
                }
                
                const profileData: UserProfile = {
                  name: initialName,
                  email: email,
                  role: currentRole as any,
                  commission: 0,
                  uid: u.uid,
                  points: initialPoints,
                  status: 'active',
                  createdAt: now,
                  updatedAt: now
                };
                await setDoc(docRef, profileData);
              } catch (err) {
                console.error("Profile creation error:", err);
                setLoading(false);
                setIsAuthReady(true);
              }
            }
          }
        }, (err) => {
          console.error("Profile snapshot error:", err);
          if (err.message.includes('permission-denied')) { 
            signOut(auth);
          }
          setLoading(false);
          setIsAuthReady(true);
        });
"""

text = text.replace(old_auth_code, new_auth_code)

with open('src/AppCore.tsx', 'w') as f:
    f.write(text)
