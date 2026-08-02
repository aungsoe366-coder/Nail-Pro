import re

def clean_classes(content):
    content = content.replace('p-4 sm:p-4 md:p-6', 'p-4 md:p-6')
    content = content.replace('p-4 sm:p-4 md:p-8', 'p-4 md:p-8')
    content = content.replace('p-5 sm:p-4 md:p-6', 'p-4 md:p-6')
    content = content.replace('p-4 md:p-6 sm:p-4 md:p-6', 'p-4 md:p-6')
    
    # Just to be safe for space-y
    content = content.replace('space-y-4 md:space-y-6', 'space-y-4 md:space-y-6') 
    # wait if it was space-y-6, it became space-y-3 md:space-y-6
    # if it was space-y-4 sm:space-y-6 -> space-y-4 sm:space-y-3 md:space-y-6 (bad)
    content = content.replace('sm:space-y-3 md:space-y-6', 'sm:space-y-6')
    content = content.replace('gap-4 sm:gap-3 md:gap-6', 'gap-3 md:gap-6')
    content = content.replace('p-3 md:p-5 sm:p-4 md:p-6', 'p-3 md:p-6')
    return content

files = ['src/AppCore.tsx', 'src/pages/BusinessAnalysisPage.tsx']
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        data = file.read()
    new_data = clean_classes(data)
    with open(f, 'w', encoding='utf-8') as file:
        file.write(new_data)
