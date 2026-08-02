import re
with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# Replace flex-1 overflow-y-auto with calc for Services list
old_services = '<div className="flex-1 overflow-y-auto p-4">'
new_services = '<div className="w-full overflow-y-auto p-4" style={{ height: "calc(100vh - 250px)" }}>'
content = content.replace(old_services, new_services)

# Same for cart
old_cart = '<div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">'
new_cart = '<div className="w-full overflow-y-auto p-6 space-y-6 pb-32" style={{ height: "calc(100vh - 150px)" }}>'
content = content.replace(old_cart, new_cart)

# Same for checkout
old_checkout = 'overflow-y-auto">'
new_checkout = 'overflow-y-auto" style={{ height: "calc(100vh - 80px)" }}>'
# We have a few overflow-y-auto, let's just do it carefully.

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
