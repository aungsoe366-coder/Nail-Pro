import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

target = "const val = Math.min(Number(e.target.value), (selectedCustomer?.points || 0));"
replacement = "const val = Math.min(Number(e.target.value), (customers.find(c => c.id === selectedCustomerId)?.points || 0));"

new_content = content.replace(target, replacement)
if new_content == content:
    print("NO CHANGE - SC")
else:
    with open('src/AppCore.tsx', 'w') as f:
        f.write(new_content)
    print("SUCCESS - SC")

