import re

def clean_classes(content):
    # Remove shadows from cards
    content = re.sub(r'\bshadow-(?:sm|md|lg|xl|2xl)\b', '', content)
    content = re.sub(r'\bdrop-shadow(?:-\w+)?\b', '', content)
    
    # Remove borders from cards
    # We want to remove border, border-border, border-border/50, border-primary/..., border-slate-... 
    # but only on the main cards.
    # Actually, the user says "Completely remove all border classes from the cards".
    # Let's just find where cards are and replace them.
    
    # Previously we changed many to bg-slate-100/80 dark:bg-slate-800/60 p-4 rounded-2xl
    content = content.replace(
        'bg-slate-100/80 dark:bg-slate-800/60',
        'bg-rose-50/60 dark:bg-rose-950/20'
    )
    
    # Let's catch any remaining bg-card border border-border/50 ...
    content = re.sub(
        r'\bbg-card\b[ \t]*\bborder\b[ \t]*\bborder-border(?:/\d+)?[ \t]*',
        'bg-rose-50/60 dark:bg-rose-950/20 ',
        content
    )
    
    # Same for border-primary/xx
    content = re.sub(
        r'\bbg-card\b[ \t]*\bborder\b[ \t]*\bborder-primary(?:/\d+)?[ \t]*',
        'bg-rose-50/60 dark:bg-rose-950/20 ',
        content
    )
    
    # Just generic bg-card border
    content = re.sub(
        r'\bbg-card\b[ \t]*\bborder\b[ \t]*',
        'bg-rose-50/60 dark:bg-rose-950/20 ',
        content
    )
    
    # Let's replace generic bg-card with bg-rose-50/60 dark:bg-rose-950/20 in card contexts
    # We will just do a mass replace for rounded-[2rem] rounded-2xl rounded-[2.5rem] rounded-3xl etc.
    content = content.replace('bg-card rounded-[2rem]', 'bg-rose-50/60 dark:bg-rose-950/20 rounded-[2rem]')
    content = content.replace('bg-card rounded-2xl', 'bg-rose-50/60 dark:bg-rose-950/20 rounded-2xl')
    content = content.replace('bg-card rounded-3xl', 'bg-rose-50/60 dark:bg-rose-950/20 rounded-3xl')
    content = content.replace('bg-card rounded-[2.5rem]', 'bg-rose-50/60 dark:bg-rose-950/20 rounded-[2.5rem]')
    content = content.replace('bg-card p-4', 'bg-rose-50/60 dark:bg-rose-950/20 p-4')
    content = content.replace('bg-card p-3 md:p-6', 'bg-rose-50/60 dark:bg-rose-950/20 p-4')
    
    # Text colors - replace generic text with Midnight
    # "Ensure primary text and main numbers use a rich, deep Midnight luxury tone (e.g., text-slate-900...)"
    content = content.replace('text-foreground', 'text-slate-900 dark:text-slate-100')
    content = content.replace('text-muted-foreground', 'text-slate-500 dark:text-slate-400')
    
    # Accents: replace some text-primary with gold/rose
    content = content.replace('text-primary', 'text-amber-600 dark:text-amber-400')
    content = content.replace('bg-primary/10', 'bg-amber-100/50 dark:bg-amber-900/30')
    content = content.replace('bg-primary/20', 'bg-amber-200/50 dark:bg-amber-900/40')
    content = content.replace('bg-primary/5', 'bg-amber-50/50 dark:bg-amber-900/20')
    
    # Fix buttons that might have been changed wrongly by text-primary
    content = content.replace('bg-amber-600 dark:text-amber-400', 'bg-primary')
    
    # Fix button text that was "text-primary-foreground"
    content = content.replace('text-amber-600 dark:text-amber-400-foreground', 'text-primary-foreground')
    
    # Ensure all cards use rounded-2xl or rounded-xl
    content = content.replace('rounded-[2.5rem]', 'rounded-2xl')
    content = content.replace('rounded-[2rem]', 'rounded-2xl')
    content = content.replace('rounded-3xl', 'rounded-2xl')
    
    # Clean up double classes
    content = re.sub(r' +', ' ', content)
    
    # Ensure body background
    content = content.replace('bg-background', 'bg-rose-50/20 dark:bg-[#1a1412]')
    
    return content

files = ['src/AppCore.tsx', 'src/pages/BusinessAnalysisPage.tsx']
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        data = file.read()
    new_data = clean_classes(data)
    with open(f, 'w', encoding='utf-8') as file:
        file.write(new_data)
