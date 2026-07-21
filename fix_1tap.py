with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

old_button = """            {hasBiometric && (
              <button 
                onClick={handleBiometricLogin}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-primary/10 border border-primary/20 text-primary [.midnight_&]:text-amber-400 font-bold py-3 mt-4 rounded-xl hover:bg-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
              >
                {biometryType === BiometryType.FACE_ID || biometryType === BiometryType.FACE_AUTHENTICATION ? (
                  <ScanFace size={18} />
                ) : (
                  <Fingerprint size={18} />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest">Use Biometrics</span>
              </button>
            )}"""

new_button = """            {hasBiometric && (
              <button 
                onClick={handleBiometricLogin}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-primary/10 border border-primary/20 text-primary [.midnight_&]:text-amber-400 font-bold py-3 mt-4 rounded-xl hover:bg-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
              >
                <Zap size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">1-Tap Login</span>
              </button>
            )}"""

if old_button in content:
    content = content.replace(old_button, new_button)
    print("Replaced old button")
else:
    print("Old button not found")

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
