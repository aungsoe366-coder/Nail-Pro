import re

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

if "Camera," not in text and " Camera " not in text:
    text = text.replace("ScanFace", "ScanFace,\n  Camera")

sidebar_start = text.find("const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {")

if sidebar_start != -1:
    sidebar_body = text[sidebar_start:]
    
    # We want to replace the return statement of Sidebar
    
    # Wait, first we need to add the handlePhotoUpload state and function
    state_injection = """  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.email) return;
    
    setIsUploadingPhoto(true);
    try {
      const fileRef = ref(storage, `profilePhotos/${profile.email}_${Date.now()}`);
      const uploadTask = await uploadBytesResumable(fileRef, file);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      
      await updateDoc(doc(db, 'users', profile.email), { photoURL: downloadURL });
    } catch (err) {
      console.error("Failed to upload photo:", err);
      alert("Failed to upload photo.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };
"""

    old_sidebar_decl = "const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {\n  const { profile, logout } = useAuth();\n  const navigate = useNavigate();\n  const location = useLocation();"
    new_sidebar_decl = old_sidebar_decl + "\n" + state_injection
    
    text = text.replace(old_sidebar_decl, new_sidebar_decl)
    
    old_profile_ui = """        <div className="p-8 border-b border-border/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="relative z-10">
            <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-2 block">{profile?.role}</span>
            <h2 className="text-2xl font-black text-foreground tracking-tighter leading-tight">{profile?.name}</h2>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest opacity-60">{profile?.email}</p>
          </div>
        </div>"""
        
    new_profile_ui = """        <div className="p-8 border-b border-border/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="relative z-10 flex items-center space-x-4">
            <div className="relative shrink-0">
               <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-primary/20">
                 {profile?.photoURL ? (
                    <img src={profile.photoURL} alt={profile.name} className="w-full h-full object-cover" />
                 ) : (
                    <UserIcon size={32} className="text-muted-foreground" />
                 )}
               </div>
               <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                 <Camera size={20} />
                 <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={isUploadingPhoto} />
               </label>
               {isUploadingPhoto && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
               )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-1 block truncate">{profile?.role}</span>
              <h2 className="text-xl font-black text-foreground tracking-tighter leading-tight truncate">{profile?.name}</h2>
              <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest opacity-60 truncate">{profile?.email}</p>
            </div>
          </div>
        </div>"""
        
    text = text.replace(old_profile_ui, new_profile_ui)

with open('src/AppCore.tsx', 'w') as f:
    f.write(text)
print("Updated Sidebar in AppCore.tsx")
