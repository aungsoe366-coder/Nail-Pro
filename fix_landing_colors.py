import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# Fix signup/login tabs
content = content.replace('text-white/70 hover:text-foreground [.midnight_&]:hover:text-slate-200', 'text-white/70 hover:text-white')
content = content.replace('text-primary-foreground', 'text-white')

# Fix back button
content = content.replace('hover:text-primary [.midnight_&]:hover:text-amber-400', 'hover:text-white')

# Fix password eye button
content = content.replace('text-white/50 hover:text-primary [.midnight_&]:hover:text-amber-400', 'text-white/50 hover:text-white')

# Wait, check if eye button uses text-white/50
content = content.replace('text-primary [.midnight_&]:text-amber-400/40 hover:text-primary [.midnight_&]:hover:text-amber-400', 'text-white/50 hover:text-white')

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
