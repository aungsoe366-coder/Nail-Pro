import re

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

old_upload = """  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };"""

new_upload = """  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.email) return;
    
    setIsUploadingPhoto(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          try {
            await updateDoc(doc(db, 'users', profile.email), { photoURL: dataUrl });
          } catch(err) {
            console.error("Failed to update photo in DB", err);
            alert("Failed to update photo in DB.");
          } finally {
            setIsUploadingPhoto(false);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Failed to process photo:", err);
      alert("Failed to process photo.");
      setIsUploadingPhoto(false);
    }
  };"""

text = text.replace(old_upload, new_upload)

with open('src/AppCore.tsx', 'w') as f:
    f.write(text)
print("Updated handlePhotoUpload")
