import re

def fix_wrappers(content):
    # Fix instances of `p-4 md:p-6 max-w-7xl mx-auto` -> `w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-6`
    content = re.sub(r'className="p-4 md:p-6 max-w-7xl mx-auto', r'className="w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-6', content)
    
    # Fix instances of `max-w-[size] mx-auto w-full p-4 md:p-6` -> `w-full max-w-[size] mx-auto p-2 sm:p-4 md:p-6`
    content = re.sub(r'className="max-w-(5xl|4xl|2xl) mx-auto w-full p-4 md:p-6', r'className="w-full max-w-\1 mx-auto p-2 sm:p-4 md:p-6', content)
    
    # Fix instances of `p-4 space-y-3 md:space-y-6` (Monthly, Sales Report, Manage)
    content = re.sub(r'className="p-4 space-y-3 md:space-y-6', r'className="w-full p-2 sm:p-4 md:p-6 space-y-3 md:space-y-6', content)
    
    # Business Analysis page
    content = re.sub(r'className="space-y-3 md:space-y-6 pb-12 animate-in fade-in duration-300"', r'className="w-full p-2 sm:p-4 md:p-6 space-y-3 md:space-y-6 pb-12 animate-in fade-in duration-300"', content)
    
    # Also shrink p-4 on some inner cards for mobile if user complained about cards not being edge-to-edge.
    # User said "individual card padding ... p-4 or p-3 for mobile cards"
    content = re.sub(r'\bp-4 md:p-6\b', 'p-3 md:p-6', content)
    content = re.sub(r'\bp-4 md:p-8\b', 'p-4 md:p-8', content)  # Keep this as is for bigger hero sections
    
    return content

files = ['src/AppCore.tsx', 'src/pages/BusinessAnalysisPage.tsx']
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        data = file.read()
    new_data = fix_wrappers(data)
    with open(f, 'w', encoding='utf-8') as file:
        file.write(new_data)

