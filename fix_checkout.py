import re
with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# Replace checkout container
old_checkout = '<div className="p-6 space-y-6 pb-32">'
new_checkout = '<div className="w-full overflow-y-auto p-6 space-y-6 pb-32" style={{ height: "calc(100vh - 120px)" }}>'

# Wait, checkout container is inside:
# <div className="flex-1 flex flex-col min-w-0 max-w-3xl mx-auto w-full border-x border-border/50 bg-card shadow-[0_-10px_30px_rgba(0,0,0,0.05)] overflow-y-auto">
# Let's remove overflow-y-auto from that wrapper and put it on the inner div with calc.
old_checkout_wrapper = 'overflow-y-auto">'
# Better to be precise.

content = content.replace('<div className="p-6 space-y-6 pb-32">', '<div className="w-full overflow-y-auto p-6 space-y-6 pb-32" style={{ height: "calc(100vh - 100px)" }}>')

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
