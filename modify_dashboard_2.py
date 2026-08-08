import re

with open('src/AppCore.tsx', 'r') as f:
    content = f.read()


# 1. We want to swap the Revenue Trend chart to the end, and remove Today's Performance,
# and format the chart card.

# Find the whole isOwnerOrAdmin block to rewrite it, and also the lists block.

start_owner_admin = content.find('{isOwnerOrAdmin && (')
if start_owner_admin == -1:
    print("Could not find owner/admin section")
    exit(1)

# We need a robust replacement strategy.
# Let's just find the exact chunks and replace them.

revenue_chart_pattern = r'\{isOwnerOrAdmin && \(\s*<div className="grid grid-cols-1 lg:grid-cols-3 gap-3">\s*/\* Sales Chart \*/\s*<div className="lg:col-span-2 bg-card border border-border rounded-2xl p-4 space-y-3 md:space-y-4 flex flex-col">.*?</ResponsiveContainer>\s*</div>\s*</div>'

quick_stats_pattern = r'/\* Quick Stats / Info \*/\s*<div className="bg-primary rounded-2xl p-4 md:p-5 text-white space-y-3 relative overflow-hidden">.*?<div className="absolute bottom-0 right-0 w-64 h-64 bg-input border border-border rounded-full -mr-32 -mb-32 blur-3xl" />\s*</div>\s*</div>\s*\)}'

lists_pattern = r'<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">\s*/\* Recent Sales \*/.*?</div>\s*</div>'

