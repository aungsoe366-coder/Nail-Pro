import re

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

# 1. Remove DashboardPage loading blocking
dashboard_loading_old = """  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );"""

text = text.replace(dashboard_loading_old, "")

# 2. Add getDocFromCache to AuthProvider to instantly resolve if cached
auth_provider_old = """        let initDone = false;

        unsubProfile = onSnapshot(docRef, (docSnap) => {"""

auth_provider_new = """        let initDone = false;

        getDocFromCache(docRef).then(docSnap => {
          if (docSnap.exists()) {
             setProfile(docSnap.data() as UserProfile);
             setLoading(false);
             setIsAuthReady(true);
          }
        }).catch(() => {});

        unsubProfile = onSnapshot(docRef, (docSnap) => {"""

text = text.replace(auth_provider_old, auth_provider_new)

with open('src/AppCore.tsx', 'w') as f:
    f.write(text)
print("Applied loading fixes")
