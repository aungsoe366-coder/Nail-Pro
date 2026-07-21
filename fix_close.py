import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

content = content.replace('            <div className="pt-6 text-center">', '            </div>\n            <div className="pt-6 text-center">')

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
