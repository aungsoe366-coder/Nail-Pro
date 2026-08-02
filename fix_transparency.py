import re

def fix_transparency(content):
    # 1. Header & Sidebar Solid Backgrounds
    # In AppCore.tsx, Sidebar has: bg-rose-50/50 dark:bg-rose-950/20
    # Header has: bg-rose-50/50 dark:bg-rose-950/20
    # Actually, many things have bg-rose-50/50 dark:bg-rose-950/20 because of our previous script.
    
    # We want to change the Header to solid white/midnight
    content = content.replace(
        'bg-rose-50/50 dark:bg-rose-950/20 z-[10001]',
        'bg-white dark:bg-slate-900 z-[10001]'
    )
    content = content.replace(
        'bg-rose-50/50 dark:bg-rose-950/20 transition-all duration-500", className',
        'bg-white dark:bg-slate-900 transition-all duration-500", className'
    )
    
    # 2. Main app container background gradient
    content = content.replace(
        'bg-white dark:bg-[#120f0e] text-[#0f172a] dark:text-[#f1f5f9]',
        'bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 dark:from-[#1a1412] dark:via-[#120f0e] dark:to-[#1a1412] text-[#0f172a] dark:text-[#f1f5f9]'
    )
    content = content.replace(
        'bg-white dark:bg-[#120f0e] p-3 md:p-6',
        'bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 dark:from-[#1a1412] dark:via-[#120f0e] dark:to-[#1a1412] p-3 md:p-6'
    )
    content = content.replace(
        'bg-white dark:bg-[#120f0e]',
        'bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 dark:from-[#1a1412] dark:via-[#120f0e] dark:to-[#1a1412]'
    )

    # 3. Card Backgrounds
    # Replace all remaining `bg-rose-50/50 dark:bg-rose-950/20` which represent the soft fill cards with `bg-white/90 dark:bg-slate-900/90` or `bg-white dark:bg-slate-900`
    # User said: `bg-white` or a very crisp, slightly opaque luxury rose-white tint `bg-white/90`
    content = content.replace(
        'bg-rose-50/50 dark:bg-rose-950/20',
        'bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm'
    )

    # Clean up any leftover bg-card that didn't get caught
    content = content.replace('bg-card', 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm')
    
    return content

files = ['src/AppCore.tsx', 'src/pages/BusinessAnalysisPage.tsx']
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        data = file.read()
    new_data = fix_transparency(data)
    with open(f, 'w', encoding='utf-8') as file:
        file.write(new_data)
