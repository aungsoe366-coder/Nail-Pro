with open('src/AppCore.tsx', 'r') as f:
    content = f.read()

old_code = """  const forceUpdate = () => {
    window.location.reload();
  };"""

new_code = """  const [updateUrl, setUpdateUrl] = useState<string | null>(null);

  const forceUpdate = () => {
    if (updateUrl) {
      window.open(updateUrl, '_blank');
    } else {
      window.location.reload();
    }
  };"""

content = content.replace(old_code, new_code)

old_check = """          setUpdateMsg({ type: 'info', text: `Update available: v${data.latestVersion}` });"""
new_check = """          setUpdateMsg({ type: 'info', text: `Update available: v${data.latestVersion}` });
          if (data.updateUrl) setUpdateUrl(data.updateUrl);"""

content = content.replace(old_check, new_check)

with open('src/AppCore.tsx', 'w') as f:
    f.write(content)
