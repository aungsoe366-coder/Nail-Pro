import re

def fix_padding(content):
    content = content.replace('w-full max-w-7xl mx-auto w-full px-3 py-4 md:p-6', 'w-full max-w-7xl mx-auto px-3 py-4 md:p-6')
    content = content.replace('w-full max-w-5xl mx-auto w-full px-3 py-4 md:p-6', 'w-full max-w-5xl mx-auto px-3 py-4 md:p-6')
    content = content.replace('w-full max-w-4xl mx-auto w-full px-3 py-4 md:p-6', 'w-full max-w-4xl mx-auto px-3 py-4 md:p-6')
    content = content.replace('w-full px-3 py-4 md:p-6 space-y-3 md:space-y-6 max-w-4xl mx-auto', 'w-full max-w-4xl mx-auto px-3 py-4 md:p-6 space-y-3 md:space-y-6')
    return content

files = ['src/AppCore.tsx', 'src/pages/BusinessAnalysisPage.tsx']
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        data = file.read()
    new_data = fix_padding(data)
    with open(f, 'w', encoding='utf-8') as file:
        file.write(new_data)
