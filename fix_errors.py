import sys

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# Fix role check
content = content.replace("data.role === 'staff' || data.role === 'admin' || data.role === 'owner'", "data.role === 'staff' || data.role === 'cashier' || data.role === 'owner'")

# Fix User -> UserIcon in POSPage
# But wait, there might be `<User ` somewhere else. I'll just find and replace it carefully within POSPage.
# Actually I can just add `User, Minus, Percent` to the lucide-react import.
if "User," not in content:
    content = content.replace("import { ", "import { User, Minus, Percent, ", 1)

# Wait, `User as UserIcon` is in there. Importing `User` as `User` might conflict if another User is declared, but it shouldn't if I add them.
# Alternatively, I can just replace `<User ` with `<UserIcon `, `<Minus ` with `<MinusIcon ` etc? No, `Minus` is not imported at all.
# Let's just import `Minus, Percent` at the top of the file explicitly to avoid modifying the huge import block.
import_str = "import { Minus, Percent } from 'lucide-react';\n"
content = import_str + content

content = content.replace("<User ", "<UserIcon ")

# Fix shopSettings -> settings in PrintView inside POSPage
content = content.replace("shopSettings={shopSettings}", "settings={shopSettings}")

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)

print("Fixed errors.")
