import re
with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# Replace h-full with flex-1 min-h-0 on POSPage root
old_root = '<div className="w-full h-full flex flex-col bg-background overflow-hidden relative">'
new_root = '<div className="w-full flex-1 flex flex-col min-h-0 bg-background overflow-hidden relative">'
content = content.replace(old_root, new_root)

# Replace pb-32 with something smaller if needed, but pb-32 is fine for spacing.
# Also ensure Top Wizard Nav is shrink-0 (already is)
# Ensure Bottom actions are fixed and have appropriate z-index (already absolute bottom-0)

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
