with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

import re
match = re.search(r"import\s+\{([^}]+)\}\s+from\s+'lucide-react'", content)
if match:
    imports = match.group(1)
    if 'Trash2' not in imports:
        new_imports = imports + ", Trash2"
        content = content[:match.start(1)] + new_imports + content[match.end(1):]
        with open('src/AppCore.tsx', 'w') as f:
            f.write(content)
        print("ADDED Trash2")
    else:
        print("Trash2 ALREADY IMPORTED")
else:
    print("NO LUCIDE IMPORT FOUND")
