import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# Add import at the top
import_str = "import nailSalonBg from './assets/images/nail_salon_background_1784539561011.jpg';"
if import_str not in content:
    content = content.replace("import React,", f"{import_str}\nimport React,")
    
old_wrapper = """<div className="fixed inset-0 z-[99999] overflow-hidden overscroll-none bg-gradient-to-br from-[#FFF5F5] via-[#F4DCD9] to-[#E8BEB9] transition-colors duration-500 ease-in-out text-foreground [.midnight_&]:text-slate-200 select-none">
      <div className="h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">"""

new_wrapper = """<div 
      className="fixed inset-0 z-[99999] overflow-hidden overscroll-none transition-colors duration-500 ease-in-out text-foreground [.midnight_&]:text-slate-200 select-none bg-cover bg-center"
      style={{ backgroundImage: `url(${nailSalonBg})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div className="h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden relative z-10">"""

if old_wrapper in content:
    content = content.replace(old_wrapper, new_wrapper)
    print("Replaced wrapper successfully.")
else:
    print("Failed to find wrapper.")

# Update the Welcome panel design to match a more professional look with glassmorphism
old_welcome = """          <motion.div 
            key="welcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-full flex flex-col items-center justify-center space-y-8 bg-card p-10 sm:p-12 rounded-[2.5rem] shadow-2xl shadow-[#4A2E31]/10 border border-border"
          >
            {/* Header */}
            <div className="text-center shrink-0 w-full flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center w-full"
              >
                <h1 className="text-4xl sm:text-5xl font-serif text-[#4A2E31] tracking-[0.25em] leading-none mb-4 uppercase ml-4">NAIL PRO</h1>
                <p className="text-[10px] sm:text-[11px] font-medium text-[#4A2E31]/80 uppercase tracking-[0.5em] ml-2 font-serif">Beauty Studio Management</p>
              </motion.div>
            </div>

            <div className="w-full space-y-4 pt-8">
              <button
                onClick={() => { setViewState('login'); setError(null); }}
                className="w-full bg-[#4A2E31] text-white font-black py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all text-[10px] tracking-[0.2em]"
              >
                SIGN IN
              </button>
              <button
                onClick={() => { setViewState('signup'); setError(null); }}
                className="w-full bg-white border border-[#4A2E31]/20 text-[#4A2E31] font-black py-4 rounded-xl shadow-sm hover:bg-[#F9EFEF] hover:scale-[1.02] active:scale-[0.98] transition-all text-[10px] tracking-[0.2em]"
              >
                CREATE ACCOUNT
              </button>
            </div>
          </motion.div>"""

new_welcome = """          <motion.div 
            key="welcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-full flex flex-col items-center justify-center space-y-8 bg-black/30 backdrop-blur-md p-10 sm:p-12 rounded-[2.5rem] shadow-2xl border border-white/20"
          >
            {/* Header */}
            <div className="text-center shrink-0 w-full flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center w-full"
              >
                <h1 className="text-4xl sm:text-5xl font-serif text-white tracking-[0.25em] leading-none mb-4 uppercase ml-4 text-shadow-sm">NAIL PRO</h1>
                <p className="text-[10px] sm:text-[11px] font-medium text-white/90 uppercase tracking-[0.5em] ml-2 font-serif">Beauty Studio Management</p>
              </motion.div>
            </div>

            <div className="w-full space-y-4 pt-8">
              <button
                onClick={() => { setViewState('login'); setError(null); }}
                className="w-full bg-white text-[#4A2E31] font-black py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all text-[10px] tracking-[0.2em]"
              >
                SIGN IN
              </button>
              <button
                onClick={() => { setViewState('signup'); setError(null); }}
                className="w-full bg-transparent border-2 border-white text-white font-black py-4 rounded-xl shadow-sm hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all text-[10px] tracking-[0.2em]"
              >
                CREATE ACCOUNT
              </button>
            </div>
          </motion.div>"""

if old_welcome in content:
    content = content.replace(old_welcome, new_welcome)
    print("Replaced welcome panel.")
else:
    print("Failed to find welcome panel.")


with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
