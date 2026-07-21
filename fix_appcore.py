with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

content = content.replace("shopSettings,\n  Info,", "shopSettings,")
content = content.replace("settings,\n  Info,", "settings,")

# Oh wait, the replace was content.replace("Settings,", "Settings,\n  Info,")
# So it turned "shopSettings," into "shopSettings,\n  Info,"
# And "settings," into "settings,\n  Info," (if it was Settings, with uppercase S, wait, "Settings," only matches uppercase S).
# So "shopSettings," doesn't match "Settings," because of "S" vs "s"? Wait, python's replace IS case-sensitive!
# How did "shopSettings" have an uppercase "S"? Oh, shopSettings is camelCase: "shopSettings" -> "Settings" is in it! 
# shopSettings, -> shopSettings,\n  Info,
content = content.replace("Settings,\n  Info,", "Settings,")

# Now properly add Info to lucide imports.
import re
# Find lucide-react import
lucide_import = re.search(r"import\s+\{([^}]+)\}\s+from\s+'lucide-react';", content)
if lucide_import:
    imports = lucide_import.group(1)
    if 'Info' not in imports:
        content = content.replace(lucide_import.group(0), f"import {{{imports}, Info}} from 'lucide-react';")

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
