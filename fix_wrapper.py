import re
with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

old_wrapper = 'shadow-[0_-10px_30px_rgba(0,0,0,0.05)] overflow-y-auto">'
new_wrapper = 'shadow-[0_-10px_30px_rgba(0,0,0,0.05)] overflow-hidden">'
content = content.replace(old_wrapper, new_wrapper)

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
