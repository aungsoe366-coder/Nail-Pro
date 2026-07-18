import re

with open('src/AppCore.tsx', 'r') as f:
    text = f.read()

text = text.replace("<ScanFace,\n  Camera size={18} />", "<ScanFace size={18} />")
text = text.replace("<ScanFace,  Camera size={18} />", "<ScanFace size={18} />")

with open('src/AppCore.tsx', 'w') as f:
    f.write(text)
print("Fixed syntax error")
