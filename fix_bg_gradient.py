import re

def fix_bg(content):
    # Main container
    content = content.replace(
        'bg-rose-50/20 dark:bg-[#1a1412]',
        'bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 dark:from-[#1a1412] dark:via-[#120f0e] dark:to-[#1a1412]'
    )
    
    return content

files = ['src/AppCore.tsx', 'src/pages/BusinessAnalysisPage.tsx']
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        data = file.read()
    new_data = fix_bg(data)
    with open(f, 'w', encoding='utf-8') as file:
        file.write(new_data)
