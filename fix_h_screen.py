import re
with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

content = content.replace("h-[100dvh]", "h-screen")

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
