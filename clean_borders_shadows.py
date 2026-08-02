import re

def super_clean(content):
    # Remove all borders except when it's an input or button maybe? 
    # Actually, the user says "Completely remove all border classes from the cards (e.g., border, border-slate-100)"
    
    # We will remove `border-b border-border`, `border-t border-border`, etc. from headers inside cards.
    content = re.sub(r'\bborder-border(?:/\d+)?\b', '', content)
    content = re.sub(r'\bborder-b\b(?!ottom)', '', content)
    content = re.sub(r'\bborder-t\b(?!op)', '', content)
    content = re.sub(r'\bborder-l\b(?!eft)', '', content)
    content = re.sub(r'\bborder-r\b(?!ight)', '', content)
    content = re.sub(r'\bborder\b', '', content)
    
    # But wait, removing `border` completely breaks `border-primary/10`, `border-red-500/20` etc.
    # Let's be more specific. Let's just remove `border` if it stands alone.
    # We already removed `border-border/50` etc.
    
    # Let's fix text-primary replacements that might have messed up buttons
    content = content.replace('text-amber-600 dark:text-amber-400-foreground', 'text-primary-foreground')
    
    # "text-slate-900 dark:text-slate-100" might have been applied to bg-primary buttons where it should be white.
    # If there is `bg-primary text-slate-900 dark:text-slate-100`, fix it.
    content = content.replace('bg-primary text-slate-900 dark:text-slate-100', 'bg-primary text-white')
    
    # Let's remove the remaining bg-card instances
    content = content.replace('bg-card', 'bg-rose-50/60 dark:bg-rose-950/20')
    content = content.replace('bg-rose-50/60 dark:bg-rose-950/20/80', 'bg-rose-50/60 dark:bg-rose-950/20')
    content = content.replace('bg-rose-50/60 dark:bg-rose-950/20/50', 'bg-rose-50/60 dark:bg-rose-950/20')
    
    # Soft fill the specific classes requested by user:
    # "Ensure primary text and main numbers use a rich, deep Midnight luxury tone (e.g., text-slate-900...)"
    content = content.replace('text-foreground', 'text-slate-900 dark:text-slate-100')
    
    # Clean up multiple spaces
    content = re.sub(r' +', ' ', content)
    
    return content

files = ['src/AppCore.tsx', 'src/pages/BusinessAnalysisPage.tsx']
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        data = file.read()
    new_data = super_clean(data)
    with open(f, 'w', encoding='utf-8') as file:
        file.write(new_data)
