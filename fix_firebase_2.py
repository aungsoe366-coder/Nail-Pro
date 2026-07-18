import re

with open('src/firebase.ts', 'r') as f:
    text = f.read()

# Remove testConnection entirely
pattern = r"async function testConnection\(\).*?testConnection\(\);"
text = re.sub(pattern, "", text, flags=re.DOTALL)

with open('src/firebase.ts', 'w') as f:
    f.write(text)
