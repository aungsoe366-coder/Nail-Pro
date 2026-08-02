import re
with open('src/AppCore.tsx', 'r') as f:
    content = f.read()
old_touch_start = """  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {"""
new_touch_start = """  const handleTouchStart = (e: React.TouchEvent) => {
    if (isPos) return;
    if (window.scrollY === 0) {"""
content = content.replace(old_touch_start, new_touch_start)
with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
