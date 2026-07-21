import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

content = content.replace('bg-white text-white font-black', 'bg-white text-[#4A2E31] font-black')

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
