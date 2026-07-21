import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# Change max-w-[400px] to w-full max-w-2xl
content = content.replace('className="relative w-full max-w-[400px] flex flex-col justify-center z-10 shrink-0 h-full max-h-[800px]"', 'className="relative w-full max-w-2xl flex flex-col justify-center z-10 shrink-0 h-full max-h-[800px]"')

old_welcome = """        {viewState === 'welcome' && (
          <motion.div 
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
          </motion.div>
        )}"""

new_welcome = """        {viewState === 'welcome' && (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-full flex flex-col items-center justify-center space-y-8 bg-black/20 backdrop-blur-md p-10 sm:p-16 rounded-3xl shadow-2xl border border-white/10 w-full"
          >
            {/* Header */}
            <div className="text-center shrink-0 w-full flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center w-full"
              >
                <h1 className="text-5xl sm:text-6xl font-serif text-white tracking-[0.25em] leading-none mb-4 uppercase ml-4 text-shadow-lg">NAIL PRO</h1>
                <p className="text-xs sm:text-sm font-medium text-white/90 uppercase tracking-[0.5em] ml-2 font-serif">Beauty Studio Management</p>
              </motion.div>
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-4 pt-10">
              <button
                onClick={() => { setViewState('login'); setError(null); }}
                className="flex-1 bg-white text-[#4A2E31] font-black py-4 px-8 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all text-[10px] sm:text-xs tracking-[0.2em]"
              >
                SIGN IN
              </button>
              <button
                onClick={() => { setViewState('signup'); setError(null); }}
                className="flex-1 bg-transparent border-2 border-white text-white font-black py-4 px-8 rounded-xl shadow-sm hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all text-[10px] sm:text-xs tracking-[0.2em]"
              >
                CREATE ACCOUNT
              </button>
            </div>
          </motion.div>
        )}"""

content = content.replace(old_welcome, new_welcome)

# Also update login frame class
old_login_class = 'className="bg-card p-5 sm:p-6 rounded-[2rem] border border-border shadow-2xl shadow-[#4A2E31]/10 shrink-0 relative"'
new_login_class = 'className="bg-black/40 backdrop-blur-md text-white p-6 sm:p-10 rounded-[2.5rem] border border-white/20 shadow-2xl shrink-0 relative w-full"'
content = content.replace(old_login_class, new_login_class)

# And signup frame class
old_signup_class = 'className="bg-card p-5 sm:p-6 rounded-[2rem] border border-border shadow-2xl  shrink-0 relative w-full overflow-y-auto max-h-[80vh]"'
new_signup_class = 'className="bg-black/40 backdrop-blur-md text-white p-6 sm:p-10 rounded-[2.5rem] border border-white/20 shadow-2xl shrink-0 relative w-full overflow-y-auto max-h-[85vh] custom-scrollbar"'
content = content.replace(old_signup_class, new_signup_class)

# We might also want to adjust text colors inside the login/signup from foreground/primary to white/light for the transparent background
content = content.replace('text-[#4A2E31]', 'text-white')
content = content.replace('text-[#4A2E31]/70', 'text-white/70')

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
