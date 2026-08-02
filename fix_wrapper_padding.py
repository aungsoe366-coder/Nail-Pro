import re

def fix_padding(content):
    # Standardize `p-2 sm:p-3 md:p-6`, `p-2 sm:p-4 md:p-6` -> `px-3 py-4 md:p-6`
    content = re.sub(r'\bp-2 sm:p-3 md:p-6\b', 'w-full px-3 py-4 md:p-6', content)
    content = re.sub(r'\bp-2 sm:p-4 md:p-6\b', 'w-full px-3 py-4 md:p-6', content)
    
    # Also fix space-y
    # Remove redundant w-full w-full
    content = content.replace('w-full w-full', 'w-full')
    
    return content

files = ['src/AppCore.tsx', 'src/pages/BusinessAnalysisPage.tsx']
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        data = file.read()
    new_data = fix_padding(data)
    with open(f, 'w', encoding='utf-8') as file:
        file.write(new_data)
