import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

old_signin_btn = 'className="w-full bg-primary text-foreground [.midnight_&]:text-slate-200 font-black py-3 mt-2 rounded-xl shadow-[0_10px_20px_rgba(212,175,55,0.2)] active:scale-[0.98] transition-all disabled:opacity-50 text-[10px] tracking-[0.2em]"'
new_signin_btn = 'className="w-full bg-white text-[#4A2E31] font-black py-3 mt-2 rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 text-[10px] tracking-[0.2em]"'
content = content.replace(old_signin_btn, new_signin_btn)

old_signup_btn = 'className="w-full bg-primary text-foreground [.midnight_&]:text-slate-200 font-black py-3 mt-4 rounded-xl shadow-[0_10px_20px_rgba(212,175,55,0.2)] active:scale-[0.98] transition-all disabled:opacity-50 text-[10px] tracking-[0.2em]"'
new_signup_btn = 'className="w-full bg-white text-[#4A2E31] font-black py-3 mt-4 rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 text-[10px] tracking-[0.2em]"'
content = content.replace(old_signup_btn, new_signup_btn)

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
