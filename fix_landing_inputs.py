import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# Let's target input fields inside the LoginPage by replacing their classes
# The inputs have `className="w-full bg-input border border-border rounded-xl p-3 pl-10 text-foreground [.midnight_&]:text-slate-200 text-sm focus:border-primary outline-none transition-all placeholder:text-muted-foreground [.midnight_&]:placeholder-slate-400 [.midnight_&]:text-slate-300"`
# and for passwords: `className="w-full bg-input border border-border rounded-xl p-3 pl-10 pr-10 text-foreground [.midnight_&]:text-slate-200 text-sm focus:border-primary outline-none transition-all placeholder:text-muted-foreground [.midnight_&]:placeholder-slate-400 [.midnight_&]:text-slate-300"`
# and normal ones `className="w-full bg-input border border-border rounded-xl p-3 pl-10 text-foreground [.midnight_&]:text-slate-200 text-sm focus:border-primary outline-none transition-all placeholder:text-muted-foreground [.midnight_&]:placeholder-slate-400"`

old_input_class = 'className="w-full bg-input border border-border rounded-xl p-3 pl-10 text-foreground [.midnight_&]:text-slate-200 text-sm focus:border-primary outline-none transition-all placeholder:text-muted-foreground [.midnight_&]:placeholder-slate-400 [.midnight_&]:text-slate-300"'
new_input_class = 'className="w-full bg-white/10 border border-white/20 rounded-xl p-3 pl-10 text-white text-sm focus:border-white/50 outline-none transition-all placeholder:text-white/50"'
content = content.replace(old_input_class, new_input_class)

old_pw_input_class = 'className="w-full bg-input border border-border rounded-xl p-3 pl-10 pr-10 text-foreground [.midnight_&]:text-slate-200 text-sm focus:border-primary outline-none transition-all placeholder:text-muted-foreground [.midnight_&]:placeholder-slate-400 [.midnight_&]:text-slate-300"'
new_pw_input_class = 'className="w-full bg-white/10 border border-white/20 rounded-xl p-3 pl-10 pr-10 text-white text-sm focus:border-white/50 outline-none transition-all placeholder:text-white/50"'
content = content.replace(old_pw_input_class, new_pw_input_class)

old_normal_input = 'className="w-full bg-input border border-border rounded-xl p-3 pl-10 text-foreground [.midnight_&]:text-slate-200 text-sm focus:border-primary outline-none transition-all placeholder:text-muted-foreground [.midnight_&]:placeholder-slate-400"'
new_normal_input = 'className="w-full bg-white/10 border border-white/20 rounded-xl p-3 pl-10 text-white text-sm focus:border-white/50 outline-none transition-all placeholder:text-white/50"'
content = content.replace(old_normal_input, new_normal_input)

# Update texts inside login/signup from text-primary or text-muted-foreground to text-white
content = content.replace('text-primary [.midnight_&]:text-amber-400/60', 'text-white/70')
content = content.replace('text-primary [.midnight_&]:text-amber-400/40', 'text-white/50')
content = content.replace('text-muted-foreground [.midnight_&]:text-slate-300', 'text-white/70')

# Update auth method selector
old_selector = 'className="flex p-1 bg-input rounded-xl mb-5 border border-border shadow-sm"'
new_selector = 'className="flex p-1 bg-white/10 rounded-xl mb-5 border border-white/20 shadow-sm backdrop-blur-sm"'
content = content.replace(old_selector, new_selector)

# Update Or continue with
old_or = 'className="relative px-4 text-[8px] font-black text-white/70 uppercase tracking-widest bg-card"'
new_or = 'className="relative px-4 text-[8px] font-black text-white/70 uppercase tracking-widest bg-transparent"'
content = content.replace(old_or, new_or)

old_google = 'className="w-full flex items-center justify-center gap-3 bg-input border border-border text-foreground [.midnight_&]:text-slate-200 font-bold py-3 rounded-xl hover:bg-muted transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"'
new_google = 'className="w-full flex items-center justify-center gap-3 bg-white/10 border border-white/20 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm backdrop-blur-sm"'
content = content.replace(old_google, new_google)

# Update biometric button
old_bio = 'className="w-full flex items-center justify-center gap-3 bg-primary/10 border border-primary/20 text-primary [.midnight_&]:text-amber-400 font-bold py-3 mt-4 rounded-xl hover:bg-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"'
new_bio = 'className="w-full flex items-center justify-center gap-3 bg-white/10 border border-white/20 text-white font-bold py-3 mt-4 rounded-xl hover:bg-white/20 transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm backdrop-blur-sm"'
content = content.replace(old_bio, new_bio)


with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
