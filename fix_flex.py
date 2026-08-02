import re
with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# Remove calc entirely, use standard flex-1
# Services container
old_services = '<div className="w-full overflow-y-auto p-4" style={{ height: "calc(100vh - 250px)" }}>'
new_services = '<div className="flex-1 w-full overflow-y-auto p-4">'
content = content.replace(old_services, new_services)

# Cart container
old_cart = '<div className="w-full overflow-y-auto p-6 space-y-6 pb-32" style={{ height: "calc(100vh - 150px)" }}>'
new_cart = '<div className="flex-1 w-full overflow-y-auto p-6 space-y-6 pb-32">'
content = content.replace(old_cart, new_cart)

# Checkout container
old_checkout = '<div className="w-full overflow-y-auto p-6 space-y-6 pb-32" style={{ height: "calc(100vh - 100px)" }}>'
new_checkout = '<div className="flex-1 w-full overflow-y-auto p-6 space-y-6 pb-32">'
content = content.replace(old_checkout, new_checkout)

# Make sure their parent flex containers are fully connected
# <div className="absolute inset-0 flex flex-col bg-background animate-in fade-in duration-300 z-10">
#   <div className="flex-1 flex flex-col min-w-0 max-w-5xl mx-auto w-full border-x border-border/50 bg-card/10">

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
