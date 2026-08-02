import re

def apply_luxury_theme(content):
    # 1. Remove all shadows
    content = re.sub(r'\bshadow-(?:sm|md|lg|xl|2xl|inner|none)\b', '', content)
    content = re.sub(r'\bshadow-\[.*?\]\b', '', content)
    content = re.sub(r'\bdrop-shadow(?:-[a-z]+)?\b', '', content)
    
    # 2. Remove all borders on cards (we'll just target border and border-border/border-border/50/border-primary)
    # Be careful not to remove border completely from input fields if possible, but user said "Completely remove all border classes from the cards".
    # Let's clean up common card classes
    content = re.sub(r'\bborder border-border(?:/\d+)?\b', '', content)
    content = re.sub(r'\bborder border-primary(?:/\d+)?\b', '', content)
    content = re.sub(r'\bborder border-slate-\d+(?:/\d+)?\b', '', content)
    
    # 3. Soft Fill Styling - Backgrounds
    # Replace any leftover bg-card or bg-slate with bg-rose-50/50
    content = re.sub(r'\bbg-slate-[12]00(?:/\d+)?\b', 'bg-rose-50/50', content)
    content = re.sub(r'\bdark:bg-slate-[89]00(?:/\d+)?\b', 'dark:bg-rose-950/20', content)
    content = re.sub(r'\bbg-rose-50/60\b', 'bg-rose-50/50', content)
    content = re.sub(r'\bbg-card\b', 'bg-rose-50/50 dark:bg-rose-950/20', content)
    
    # Page background
    content = re.sub(r'\bbg-background\b', 'bg-white dark:bg-[#120f0e]', content)
    
    # 4. Typography
    content = re.sub(r'\btext-foreground\b', 'text-[#0f172a] dark:text-[#f1f5f9]', content) # Deep midnight navy/charcoal
    content = re.sub(r'\btext-muted-foreground\b', 'text-slate-500 dark:text-slate-400', content)
    
    # 5. Premium Accents (Gold/Rose)
    content = re.sub(r'\btext-primary\b', 'text-amber-600 dark:text-amber-400', content)
    content = re.sub(r'\bbg-primary/10\b', 'bg-amber-100/50 dark:bg-amber-900/30', content)
    content = re.sub(r'\bbg-primary/20\b', 'bg-amber-200/50 dark:bg-amber-900/40', content)
    
    # We shouldn't replace bg-primary outright everywhere because primary is used for solid buttons. 
    # But if there are bg-primary badges, let's leave them or user can specify. User said "bg-amber-100/50".
    
    # 6. Card Geometry (Rounded)
    content = re.sub(r'\brounded-\[2\.5rem\]\b', 'rounded-2xl', content)
    content = re.sub(r'\brounded-\[2rem\]\b', 'rounded-2xl', content)
    content = re.sub(r'\brounded-3xl\b', 'rounded-2xl', content)
    
    # 7. Compact Padding
    content = re.sub(r'\bp-5 md:p-10\b', 'p-4', content)
    content = re.sub(r'\bp-4 md:p-8\b', 'p-4', content)
    content = re.sub(r'\bp-4 md:p-6\b', 'p-4', content)
    content = re.sub(r'\bp-3 md:p-6\b', 'p-4', content)
    content = re.sub(r'\bp-3 md:p-5\b', 'p-4', content)
    content = re.sub(r'\bspace-y-4 md:space-y-8\b', 'space-y-3', content)
    content = re.sub(r'\bspace-y-3 md:space-y-6\b', 'space-y-3', content)
    content = re.sub(r'\bgap-4 md:gap-8\b', 'gap-3', content)
    content = re.sub(r'\bgap-3 md:gap-6\b', 'gap-3', content)

    # Clean up double spaces
    content = re.sub(r' +', ' ', content)
    content = re.sub(r' className=" "', '', content)
    content = re.sub(r' className=""', '', content)
    
    return content

files = ['src/AppCore.tsx', 'src/pages/BusinessAnalysisPage.tsx']
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        data = file.read()
    new_data = apply_luxury_theme(data)
    with open(f, 'w', encoding='utf-8') as file:
        file.write(new_data)
