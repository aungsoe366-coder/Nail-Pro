import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

# 1. Fix Step Progress Line
old_line_grey = '<div className="absolute top-5 left-8 right-8 sm:left-14 sm:right-14 h-[2px] bg-border/50 -translate-y-1/2 z-0 rounded-full" />'
old_line_primary = '<div className="absolute top-5 left-8 sm:left-14 h-[2px] bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-500" style={{ width: currentStep === \'services\' ? \'0%\' : currentStep === \'cart\' ? \'50%\' : \'100%\' }} />'

new_lines = """          <div className="absolute top-5 left-[48px] right-[48px] sm:left-[80px] sm:right-[80px] h-[2px] bg-border/50 -translate-y-1/2 z-0 rounded-full">
            <div className="absolute top-0 left-0 bottom-0 bg-primary rounded-full transition-all duration-500" style={{ width: currentStep === 'services' ? '0%' : currentStep === 'cart' ? '50%' : '100%' }} />
          </div>"""

content = content.replace(old_line_grey + '\n          ' + old_line_primary, new_lines)

# 2. Fix pb-28 to pb-32 in services
content = content.replace('<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-28">', '<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-32">')

# 3. Fix pb-28 to pb-32 in cart
content = content.replace('<div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide pb-28">', '<div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide pb-32">')

# 4. Fix checkout padding
# Find "p-6 space-y-6" after "{currentStep === 'checkout' && ("
# Wait, let's just make sure there is only one or we specifically replace the one in checkout
checkout_idx = content.find("currentStep === 'checkout'")
p6_idx = content.find('<div className="p-6 space-y-6">', checkout_idx)
if p6_idx != -1:
    content = content[:p6_idx] + '<div className="p-6 space-y-6 pb-32">' + content[p6_idx + len('<div className="p-6 space-y-6">'):]

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
