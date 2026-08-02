import re
with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# Replace scrollbar-hide with just standard classes on POSPage main scrolling areas
content = content.replace('<div className="flex-1 overflow-y-auto p-4 scrollbar-hide">', '<div className="flex-1 overflow-y-auto p-4">')
content = content.replace('<div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide pb-32">', '<div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">')
content = content.replace('overflow-y-auto scrollbar-hide">', 'overflow-y-auto">')

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
