with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

content = content.replace("  Database,\n  Database,", "  Database,")
content = content.replace("  Database, \n", "  Database,\n")
import re
content = re.sub(r'  Database,\s*Database,', '  Database,', content)

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
