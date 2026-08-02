import re

def fix_tailwind_classes(content):
    content = re.sub(r'\bp-5\b(?! md:p-10)', 'p-3 md:p-5', content)
    content = re.sub(r'\bpx-5\b', 'px-3 md:px-5', content)
    content = re.sub(r'\bpy-5\b', 'py-3 md:py-5', content)
    content = re.sub(r'\bgap-5\b', 'gap-3 md:gap-5', content)
    content = re.sub(r'\bspace-y-5\b', 'space-y-3 md:space-y-5', content)
    
    # Also fix any p-4 that are standalone on outermost boundaries or cards?
    # actually p-4 is pretty good for mobile. Maybe keep p-4.
    
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
