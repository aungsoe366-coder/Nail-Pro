import re
with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

content = content.replace('className={isPos ? "relative w-full flex-1 flex flex-col min-h-0" : "relative w-full h-full"}"', 'className={isPos ? "relative w-full flex-1 flex flex-col min-h-0" : "relative w-full h-full"}')
content = content.replace('className={isPos ? "w-full flex-1 flex flex-col min-h-0" : "w-full h-full"}"', 'className={isPos ? "w-full flex-1 flex flex-col min-h-0" : "w-full h-full"}')

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
