import re

def fix_dashboard(content):
    # Customer Dashboard
    content = content.replace('w-full max-w-5xl mx-auto px-3 py-4 md:p-6 space-y-3 md:space-y-6 animate-in fade-in duration-300', 'w-full max-w-5xl mx-auto px-3 py-4 md:p-6 space-y-3 md:space-y-6 animate-in fade-in duration-300')
    
    return content

# actually, let's just grep for "max-w-5xl"
