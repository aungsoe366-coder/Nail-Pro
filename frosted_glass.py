import re

def apply_frosted_glass(content):
    # 1. Premium Header & Sidebar (Frosted Glass)
    # Header replacement
    content = content.replace(
        'bg-white dark:bg-slate-900 transition-all duration-500", className',
        'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-rose-200/30 dark:border-rose-900/30 transition-all duration-500", className'
    )
    # Sidebar replacement
    content = content.replace(
        'bg-white dark:bg-slate-900 z-[10001]',
        'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-rose-200/30 dark:border-rose-900/30 z-[10001]'
    )

    # 2. Luxury Contrast Stat Cards
    # Previously we changed card backgrounds to: bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm
    # Let's change them to: bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-rose-200/50 dark:border-rose-900/30
    content = content.replace(
        'bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm',
        'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-rose-200/50 dark:border-rose-900/30'
    )
    
    # Just in case there are other cards missed
    content = content.replace(
        'bg-white dark:bg-slate-900 rounded-2xl',
        'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-rose-200/50 dark:border-rose-900/30 rounded-2xl'
    )
    
    # 3. Typography Contrast (Make sure text pops)
    content = content.replace('text-slate-500 dark:text-slate-400', 'text-slate-700 dark:text-slate-300')
    content = content.replace('text-slate-400', 'text-slate-600 dark:text-slate-400')
    
    return content

files = ['src/AppCore.tsx', 'src/pages/BusinessAnalysisPage.tsx']
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        data = file.read()
    new_data = apply_frosted_glass(data)
    with open(f, 'w', encoding='utf-8') as file:
        file.write(new_data)
