import re
import glob

def fix_tailwind_classes(content):
    # Padding
    content = re.sub(r'\bp-6\b', 'p-4 md:p-6', content)
    content = re.sub(r'\bp-8\b', 'p-4 md:p-8', content)
    content = re.sub(r'\bp-10\b', 'p-5 md:p-10', content)
    content = re.sub(r'\bpx-6\b', 'px-4 md:px-6', content)
    content = re.sub(r'\bpx-8\b', 'px-4 md:px-8', content)
    content = re.sub(r'\bpy-6\b', 'py-4 md:py-6', content)
    content = re.sub(r'\bpy-8\b', 'py-4 md:py-8', content)
    
    # Spacing / Gaps
    content = re.sub(r'\bspace-y-6\b', 'space-y-3 md:space-y-6', content)
    content = re.sub(r'\bspace-y-8\b', 'space-y-4 md:space-y-8', content)
    content = re.sub(r'\bgap-6\b', 'gap-3 md:gap-6', content)
    content = re.sub(r'\bgap-8\b', 'gap-4 md:gap-8', content)
    content = re.sub(r'\bmb-6\b', 'mb-3 md:mb-6', content)
    content = re.sub(r'\bmb-8\b', 'mb-4 md:mb-8', content)
    
    # Remove duplicates like `p-4 md:p-4 md:p-6` if they occur
    content = content.replace('p-4 md:p-4 md:p-6', 'p-4 md:p-6')
    
    return content

files = ['src/AppCore.tsx', 'src/pages/BusinessAnalysisPage.tsx']
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        data = file.read()
    
    new_data = fix_tailwind_classes(data)
    
    if new_data != data:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_data)
        print(f"Updated {f}")
    else:
        print(f"No changes for {f}")
