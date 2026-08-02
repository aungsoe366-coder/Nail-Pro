import re
with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

old_line = '<div className="absolute top-5 left-[48px] right-[48px] sm:left-[80px] sm:right-[80px] h-[2px] bg-border/50 -translate-y-1/2 z-0 rounded-full">'
new_line = '<div className="absolute top-5 left-[32px] right-[32px] sm:left-[40px] sm:right-[40px] h-[2px] bg-border/50 -translate-y-1/2 z-0 rounded-full">'

content = content.replace(old_line, new_line)

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
