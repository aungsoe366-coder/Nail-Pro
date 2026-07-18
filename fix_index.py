with open('index.html', 'r') as f:
    text = f.read()

loader_html = """<div id="root">
      <div style="position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background-color: #FFF5F5;">
        <div style="width: 48px; height: 48px; border: 4px solid #d4af37; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      </div>
      <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    </div>"""

text = text.replace('<div id="root"></div>', loader_html)

with open('index.html', 'w') as f:
    f.write(text)
print("Updated index.html")
