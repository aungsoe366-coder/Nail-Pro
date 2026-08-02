import re

def refactor_app_core(content):
    # Refactor CustomerDashboardPage
    content = content.replace(
        'className="bg-card border border-border p-3 md:p-6 rounded-2xl shadow-sm flex flex-col items-center text-center space-y-4"',
        'className="bg-slate-100/80 dark:bg-slate-800/60 p-4 rounded-2xl flex flex-col items-center text-center space-y-3"'
    )

    # Refactor DashboardPage Stat Cards
    content = content.replace(
        'className="bg-card p-3 md:p-6 rounded-[2rem] border border-border shadow-sm space-y-4 relative overflow-hidden group"',
        'className="bg-slate-100/80 dark:bg-slate-800/60 p-4 rounded-2xl space-y-3 relative overflow-hidden group"'
    )

    # Refactor Chart Card
    content = content.replace(
        'className="lg:col-span-2 bg-card rounded-[2.5rem] border border-border p-4 md:p-8 shadow-sm space-y-3 md:space-y-6 flex flex-col"',
        'className="lg:col-span-2 bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl p-4 md:p-6 space-y-3 md:space-y-4 flex flex-col"'
    )

    # Refactor Performance Card
    content = content.replace(
        'className="bg-primary rounded-[2.5rem] p-4 md:p-8 text-white space-y-4 md:space-y-8 relative overflow-hidden shadow-2xl shadow-primary/20"',
        'className="bg-primary rounded-2xl p-4 md:p-6 text-white space-y-4 relative overflow-hidden"'
    )
    content = content.replace(
        'className="bg-white/10  p-4 rounded-2xl border border-border flex justify-between items-center"',
        'className="bg-white/10 p-3 rounded-xl flex justify-between items-center"'
    )

    # Refactor Recent Sales & Appointments Cards
    content = content.replace(
        'className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm flex flex-col"',
        'className="bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl overflow-hidden flex flex-col"'
    )

    return content

def refactor_business_analysis(content):
    # Main top card
    content = content.replace(
        'className="bg-card rounded-2xl p-3 md:p-6 border border-border/50 shadow-sm space-y-3 md:space-y-5"',
        'className="bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl p-4 md:p-5 space-y-3"'
    )
    content = content.replace(
        'className="border-t border-border/40 pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 min-w-0 max-w-full"',
        'className="border-t border-slate-200/60 dark:border-slate-700/50 pt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 min-w-0 max-w-full"'
    )

    # KPI Cards
    content = content.replace(
        'className="bg-card rounded-2xl p-3 md:p-5 border border-border/50 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all"',
        'className="bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl p-4 relative overflow-hidden group hover:bg-slate-200/70 dark:hover:bg-slate-800/90 transition-all"'
    )

    # Charts / Tables Cards
    content = content.replace(
        'className="bg-card rounded-2xl p-3 md:p-6 border border-border/50 shadow-sm flex flex-col justify-between"',
        'className="bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl p-4 md:p-5 flex flex-col justify-between"'
    )

    # Header in tables
    content = content.replace(
        'className="p-3 md:p-6 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"',
        'className="p-4 border-b border-slate-200/60 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"'
    )

    return content

with open('src/AppCore.tsx', 'r', encoding='utf-8') as f:
    app_core = f.read()
app_core_mod = refactor_app_core(app_core)
with open('src/AppCore.tsx', 'w', encoding='utf-8') as f:
    f.write(app_core_mod)

with open('src/pages/BusinessAnalysisPage.tsx', 'r', encoding='utf-8') as f:
    biz = f.read()
biz_mod = refactor_business_analysis(biz)
with open('src/pages/BusinessAnalysisPage.tsx', 'w', encoding='utf-8') as f:
    f.write(biz_mod)

print("Refactored to Soft Fill UI style!")
