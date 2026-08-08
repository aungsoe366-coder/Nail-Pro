with open("src/AppCore.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("  }, [profile, today]);", "  }, [profile, today, isAdmin, isCashier]);", 1)

with open("src/AppCore.tsx", "w", encoding="utf-8") as f:
    f.write(content)
