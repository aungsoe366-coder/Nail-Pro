import re

def clean_soft_fill(content):
    # Convert bg-card ... border ... shadow ... cards to soft fill
    # Pattern for cards in stat grids
    content = re.sub(
        r'bg-card p-(?:3|4|5|6) md:p-6 rounded-[23]3?xl border border-border shadow-sm',
        'bg-slate-100/80 dark:bg-slate-800/60 p-4 rounded-2xl',
        content
    )
    content = re.sub(
        r'bg-card rounded-2xl p-3 md:p-6 border border-border/50 shadow-sm',
        'bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl p-4',
        content
    )
    content = re.sub(
        r'bg-card p-4 md:p-6 rounded-2xl border border-border/50 shadow-sm',
        'bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl p-4',
        content
    )
    content = re.sub(
        r'bg-card p-4 rounded-2xl border border-border flex justify-between items-center shadow-sm',
        'bg-slate-100/80 dark:bg-slate-800/60 p-3.5 rounded-2xl flex justify-between items-center',
        content
    )
    content = re.sub(
        r'bg-card rounded-\[2rem\] border border-border shadow-(?:xl|2xl)',
        'bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl',
        content
    )
    content = re.sub(
        r'bg-card p-4 md:p-8 rounded-\[2\.5rem\] border border-border shadow-2xl',
        'bg-slate-100/80 dark:bg-slate-800/60 p-4 md:p-6 rounded-2xl',
        content
    )
    return content

with open('src/AppCore.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text_mod = clean_soft_fill(text)

with open('src/AppCore.tsx', 'w', encoding='utf-8') as f:
    f.write(text_mod)

print("Applied soft fill to all cards!")
